import { createTask, type SessionManager } from "../core/session.js";
import type { Task } from "../core/types.js";
import { log } from "../core/logger.js";

/**
 * CronWatcher executes prompts on a schedule.
 * Uses simple interval-based scheduling (no cron parser dependency).
 *
 * For v0.1, supports:
 *   - interval: run every N milliseconds
 *   - daily: run once per day at a specific hour
 *
 * Future: full cron expressions via node-cron
 */
export interface CronJob {
  name: string;
  prompt: string;
  intervalMs: number;
}

export class CronWatcher {
  private session: SessionManager;
  private jobs: Map<string, NodeJS.Timeout> = new Map();
  private onTaskComplete?: (task: Task) => void;

  constructor(
    session: SessionManager,
    onTaskComplete?: (task: Task) => void,
  ) {
    this.session = session;
    this.onTaskComplete = onTaskComplete;
  }

  addJob(job: CronJob): void {
    if (this.jobs.has(job.name)) {
      this.removeJob(job.name);
    }

    const timer = setInterval(async () => {
      log("info", `Cron: firing job "${job.name}"`);
      const task = createTask(job.prompt, `cron:${job.name}`);

      try {
        const result = await this.session.execute(task);
        this.onTaskComplete?.(result);
      } catch (err) {
        log("error", `Cron job "${job.name}" failed: ${err}`);
      }
    }, job.intervalMs);

    this.jobs.set(job.name, timer);
    log("info", `Cron: registered job "${job.name}" (every ${job.intervalMs}ms)`);
  }

  removeJob(name: string): void {
    const timer = this.jobs.get(name);
    if (timer) {
      clearInterval(timer);
      this.jobs.delete(name);
      log("info", `Cron: removed job "${name}"`);
    }
  }

  stop(): void {
    for (const [name, timer] of this.jobs) {
      clearInterval(timer);
      log("info", `Cron: stopped job "${name}"`);
    }
    this.jobs.clear();
  }
}
