import { watch, type FSWatcher } from "chokidar";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createTask, type SessionManager } from "../core/session.js";
import type { Task } from "../core/types.js";
import { log } from "../core/logger.js";

/**
 * FileWatcher monitors arbitrary file patterns and triggers
 * Claude tasks when changes are detected.
 *
 * Use cases:
 *   - Watch VISION.md for drift detection
 *   - Watch test files for auto-fix on failure
 *   - Watch config files for validation
 */
export interface FileWatchRule {
  name: string;
  /** Directory to watch */
  path: string;
  /** Glob patterns within the directory */
  patterns: string[];
  /** Prompt template — {{file}} and {{content}} get replaced */
  prompt: string;
  /** Debounce in ms (default 2000) */
  debounce?: number;
}

export class FileWatcher {
  private watchers: FSWatcher[] = [];
  private session: SessionManager;
  private onTaskComplete?: (task: Task) => void;
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    session: SessionManager,
    onTaskComplete?: (task: Task) => void,
  ) {
    this.session = session;
    this.onTaskComplete = onTaskComplete;
  }

  async addRule(rule: FileWatchRule): Promise<void> {
    const debounceMs = rule.debounce ?? 2000;

    const watcher = watch(rule.patterns, {
      cwd: rule.path,
      ignoreInitial: true,
    });

    watcher.on("change", (filepath: string) => {
      const key = `${rule.name}:${filepath}`;

      const existing = this.debounceTimers.get(key);
      if (existing) clearTimeout(existing);

      this.debounceTimers.set(
        key,
        setTimeout(() => {
          this.debounceTimers.delete(key);
          this.handleChange(rule, filepath);
        }, debounceMs),
      );
    });

    this.watchers.push(watcher);
    log("info", `File watcher "${rule.name}" started — ${rule.patterns.join(", ")} in ${rule.path}`);
  }

  private async handleChange(rule: FileWatchRule, filepath: string): Promise<void> {
    const fullPath = join(rule.path, filepath);
    log("info", `File changed: ${fullPath} (rule: ${rule.name})`);

    try {
      const content = await readFile(fullPath, "utf-8");
      const prompt = rule.prompt
        .replace(/\{\{file\}\}/g, filepath)
        .replace(/\{\{content\}\}/g, content);

      const task = createTask(prompt, `file:${rule.name}`, fullPath);
      const result = await this.session.execute(task);
      this.onTaskComplete?.(result);
    } catch (err) {
      log("error", `File watcher "${rule.name}" error: ${err}`);
    }
  }

  async stop(): Promise<void> {
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();

    for (const w of this.watchers) {
      await w.close();
    }
    this.watchers = [];
    log("info", "All file watchers stopped");
  }
}
