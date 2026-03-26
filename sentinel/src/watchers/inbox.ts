import { watch, type FSWatcher } from "chokidar";
import { readFile, rename, mkdir, readdir, stat } from "node:fs/promises";
import { basename, join } from "node:path";
import { createTask, type SessionManager, type SessionPool } from "../core/session.js";
import type { Task } from "../core/types.js";
import { log } from "../core/logger.js";

const MAX_TASK_SIZE = 5 * 1024 * 1024; // 5 MB — stdin piping has no ARG_MAX limit

/**
 * InboxWatcher monitors a directory for new .md files.
 * When a file appears:
 *   1. Read its contents as the task prompt
 *   2. Move it to inbox/.processing/
 *   3. Feed it to the SessionManager
 *   4. Move to inbox/.done/ or inbox/.failed/
 */
export class InboxWatcher {
  private watcher: FSWatcher | null = null;
  private session: SessionManager | SessionPool;
  private inboxPath: string;
  private queue: string[] = [];
  private processing = false;
  private onTaskComplete?: (task: Task) => void;

  constructor(
    session: SessionManager | SessionPool,
    inboxPath: string,
    onTaskComplete?: (task: Task) => void,
  ) {
    this.session = session;
    this.inboxPath = inboxPath;
    this.onTaskComplete = onTaskComplete;
  }

  async start(): Promise<void> {
    await mkdir(join(this.inboxPath, ".processing"), { recursive: true });
    await mkdir(join(this.inboxPath, ".done"), { recursive: true });
    await mkdir(join(this.inboxPath, ".failed"), { recursive: true });

    // Recover orphaned tasks from .processing/ (crash recovery)
    await this.recoverOrphans();

    this.watcher = watch(this.inboxPath, {
      ignoreInitial: false,
      depth: 0,
      ignored: (path: string) => {
        const name = basename(path);
        // Ignore dotfiles/dotdirs but not the watched directory itself
        return name.startsWith(".") && name !== basename(this.inboxPath);
      },
    });

    this.watcher.on("add", (filepath: string) => {
      const name = basename(filepath);
      if (!name.endsWith(".md")) return;
      log("info", `Inbox: new task detected — ${name}`);
      this.queue.push(filepath);
      this.processQueue();
    });

    this.watcher.on("error", (err: unknown) => {
      log("error", `Inbox watcher error: ${err}`);
    });

    log("info", `Inbox watcher started — watching ${this.inboxPath}`);
  }

  async stop(): Promise<void> {
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = null;
      log("info", "Inbox watcher stopped");
    }
  }

  private async recoverOrphans(): Promise<void> {
    const processingDir = join(this.inboxPath, ".processing");
    try {
      const files = await readdir(processingDir);
      for (const file of files) {
        if (!file.endsWith(".md")) continue;
        const src = join(processingDir, file);
        const dest = join(this.inboxPath, file);
        await rename(src, dest);
        log("warn", `Recovered orphaned task: ${file}`);
      }
    } catch {
      // Nothing to recover
    }
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    try {
      while (this.queue.length > 0) {
        const filepath = this.queue.shift()!;
        await this.processFile(filepath);
      }
    } finally {
      this.processing = false;
    }
  }

  private async processFile(filepath: string): Promise<void> {
    const filename = basename(filepath);

    try {
      // Check file size before reading
      const fileStat = await stat(filepath);
      if (fileStat.size > MAX_TASK_SIZE) {
        log("error", `Task file too large (${fileStat.size} bytes, max ${MAX_TASK_SIZE}): ${filename}`);
        await rename(filepath, join(this.inboxPath, ".failed", filename));
        return;
      }

      const content = await readFile(filepath, "utf-8");
      if (!content.trim()) {
        log("warn", `Skipping empty file: ${filename}`);
        await rename(filepath, join(this.inboxPath, ".failed", filename));
        return;
      }

      // Move to processing
      const processingPath = join(this.inboxPath, ".processing", filename);
      await rename(filepath, processingPath);

      // Extract telegram task ID from filename if present (tg-XXXXXXXX pattern)
      const tgMatch = filename.match(/--tg-([a-z0-9]+)--/);
      const source = tgMatch ? "telegram" : "inbox";
      const taskId = tgMatch ? tgMatch[1] : undefined;

      const task = createTask(content, source, filepath, taskId);
      log("info", `Processing task ${task.id} from ${filename}`);

      const result = await this.session.execute(task);

      // Move to done or failed
      const destDir = result.status === "completed" ? ".done" : ".failed";
      const destPath = join(this.inboxPath, destDir, filename);
      try {
        await rename(processingPath, destPath);
      } catch (moveErr) {
        log("error", `Failed to move ${filename} to ${destDir}: ${moveErr}`);
        // File stays in .processing — will be recovered on next start
      }

      this.onTaskComplete?.(result);

      // Drain queued tasks if using a pool
      if ("drainQueue" in this.session) this.session.drainQueue();
    } catch (err) {
      log("error", `Failed to process ${filename}: ${err}`);
      // Try to move to failed as a last resort
      try {
        await rename(filepath, join(this.inboxPath, ".failed", filename));
      } catch {
        // Original file may already have been moved — nothing more to do
      }
    }
  }
}
