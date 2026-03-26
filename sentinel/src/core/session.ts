import { execFile, spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import type { SentinelConfig, SessionState, Task } from "./types.js";
import { log } from "./logger.js";

/**
 * Wraps the Claude CLI to provide persistent, resumable sessions.
 * First task runs without --resume. Subsequent tasks resume the session
 * so context accumulates across tasks.
 */
export class SessionManager {
  private state: SessionState;
  private config: SentinelConfig;
  private running = false;
  private sessionEstablished = false;

  constructor(config: SentinelConfig) {
    this.config = config;
    this.state = {
      sessionId: config.sessionId ?? randomUUID(),
      startedAt: new Date(),
      tasksCompleted: 0,
    };
    // If the user provided an explicit session ID, trust it
    if (config.sessionId) {
      this.sessionEstablished = true;
    }
  }

  get sessionId(): string {
    return this.state.sessionId;
  }

  get stats(): SessionState {
    return { ...this.state };
  }

  async execute(task: Task): Promise<Task> {
    if (this.running) {
      throw new Error("Session is already executing a task");
    }

    this.running = true;
    task.status = "running";
    const start = Date.now();

    try {
      const result = await this.callClaude(task.prompt);
      task.status = "completed";
      task.result = result;
      task.duration = Date.now() - start;
      this.state.tasksCompleted++;
      this.state.lastTaskAt = new Date();
      this.sessionEstablished = true;
      log("info", `Task ${task.id} completed in ${task.duration}ms`);
    } catch (err) {
      task.status = "failed";
      task.error = err instanceof Error ? err.message : String(err);
      task.duration = Date.now() - start;
      log("error", `Task ${task.id} failed: ${task.error}`);
    } finally {
      this.running = false;
    }

    return task;
  }

  async verifyCliAvailable(): Promise<void> {
    return new Promise((resolve, reject) => {
      execFile("claude", ["--version"], { timeout: 10_000 }, (error, stdout) => {
        if (error) {
          reject(new Error(
            "Claude CLI not found. Install it first: https://docs.anthropic.com/en/docs/claude-code\n" +
            `Details: ${error.message}`
          ));
          return;
        }
        log("info", `Claude CLI found: ${stdout.trim()}`);
        resolve();
      });
    });
  }

  private callClaude(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const sessionFlag = this.sessionEstablished ? "--resume" : "--session-id";
      const args = [
        "-p", "-",                    // read prompt from stdin
        "--output-format", "text",
        sessionFlag, this.state.sessionId,
        ...(this.config.model ? ["--model", this.config.model] : []),
        ...(this.config.permissionMode ? ["--permission-mode", this.config.permissionMode] : []),
        ...(this.config.maxBudgetPerTask ? ["--max-budget-usd", String(this.config.maxBudgetPerTask)] : []),
        ...(this.config.systemPrompt ? ["--system-prompt", this.config.systemPrompt] : []),
      ];

      log("debug", `Calling claude (stdin pipe, ${prompt.length} chars)`);

      // Strip CLAUDECODE env var so child sessions don't think they're nested
      const env = { ...process.env };
      delete env.CLAUDECODE;

      const child = spawn("claude", args, {
        cwd: this.config.workdir,
        env,
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 5 * 60 * 1000,
      });

      const chunks: Buffer[] = [];
      const errChunks: Buffer[] = [];

      child.stdout.on("data", (chunk: Buffer) => chunks.push(chunk));
      child.stderr.on("data", (chunk: Buffer) => errChunks.push(chunk));

      child.on("close", (code) => {
        const stdout = Buffer.concat(chunks).toString().trim();
        const stderr = Buffer.concat(errChunks).toString();

        if (code !== 0) {
          reject(new Error(`Claude CLI exited with code ${code}\n${stderr}`));
          return;
        }
        resolve(stdout);
      });

      // Pipe prompt via stdin — no ARG_MAX limit
      child.stdin.write(prompt);
      child.stdin.end();
    });
  }
}

/**
 * Manages a pool of SessionManagers for concurrent task execution.
 * Each session gets its own Claude session UUID.
 */
export class SessionPool {
  private sessions: SessionManager[];
  private queue: Array<{
    task: Task;
    resolve: (result: Task) => void;
    reject: (err: Error) => void;
  }> = [];

  constructor(config: SentinelConfig, size = 1) {
    this.sessions = Array.from({ length: size }, () => new SessionManager(config));
  }

  get sessionId(): string {
    return this.sessions[0].sessionId;
  }

  get stats(): SessionState {
    const combined = this.sessions.reduce(
      (acc, s) => {
        const st = s.stats;
        acc.tasksCompleted += st.tasksCompleted;
        if (st.lastTaskAt && (!acc.lastTaskAt || st.lastTaskAt > acc.lastTaskAt)) {
          acc.lastTaskAt = st.lastTaskAt;
        }
        return acc;
      },
      { sessionId: this.sessions[0].sessionId, startedAt: this.sessions[0].stats.startedAt, tasksCompleted: 0, lastTaskAt: undefined as Date | undefined },
    );
    return combined;
  }

  async verifyCliAvailable(): Promise<void> {
    return this.sessions[0].verifyCliAvailable();
  }

  async execute(task: Task): Promise<Task> {
    // Find a free session
    const free = this.sessions.find((s) => !s["running"]);
    if (free) {
      return free.execute(task);
    }

    // All sessions busy — queue the task
    return new Promise<Task>((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
    });
  }

  /** Called by InboxWatcher after a task completes to drain the queue */
  drainQueue(): void {
    if (this.queue.length === 0) return;
    const free = this.sessions.find((s) => !s["running"]);
    if (!free) return;

    const next = this.queue.shift()!;
    free.execute(next.task).then(next.resolve, next.reject);
  }
}

export function createTask(prompt: string, source: string, filepath?: string, id?: string): Task {
  return {
    id: id ?? randomUUID().slice(0, 8),
    source,
    prompt,
    filepath,
    createdAt: new Date(),
    status: "pending",
  };
}
