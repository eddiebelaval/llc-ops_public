import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { NotifyConfig, Task } from "./types.js";
import { log } from "./logger.js";

export class Notifier {
  private config: NotifyConfig;
  private outboxPath?: string;

  constructor(config: NotifyConfig, outboxPath?: string) {
    this.config = config;
    this.outboxPath = outboxPath;
  }

  async notify(task: Task): Promise<void> {
    const promises: Promise<void>[] = [];

    if (this.config.file !== false && this.outboxPath) {
      promises.push(this.writeToOutbox(task));
    }

    if (this.config.stdout) {
      this.writeStdout(task);
    }

    if (this.config.telegram) {
      promises.push(this.sendTelegram(task));
    }

    if (this.config.webhook) {
      promises.push(this.sendWebhook(task));
    }

    await Promise.allSettled(promises);
  }

  private async writeToOutbox(task: Task): Promise<void> {
    await mkdir(this.outboxPath!, { recursive: true });
    const filename = `${task.id}-${task.status}.md`;
    const content = formatTaskResult(task);
    await writeFile(join(this.outboxPath!, filename), content);
    log("debug", `Result written to outbox: ${filename}`);
  }

  private writeStdout(task: Task): void {
    const summary = `[${task.status.toUpperCase()}] Task ${task.id} (${task.source}) — ${task.duration}ms`;
    process.stdout.write(summary + "\n");
    if (task.result) {
      process.stdout.write(task.result.slice(0, 500) + "\n");
    }
  }

  private async sendTelegram(task: Task): Promise<void> {
    const { botToken, chatId } = this.config.telegram!;
    const icon = task.status === "completed" ? "[OK]" : "[FAIL]";
    const text = `${icon} Sentinel: ${task.source}\n${task.result?.slice(0, 2000) ?? task.error ?? "No output"}`;

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
        },
      );
      if (!res.ok) {
        log("warn", `Telegram notify failed: ${res.status}`);
      }
    } catch (err) {
      log("warn", `Telegram notify error: ${err}`);
    }
  }

  private async sendWebhook(task: Task): Promise<void> {
    try {
      const res = await fetch(this.config.webhook!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          status: task.status,
          source: task.source,
          result: task.result,
          error: task.error,
          duration: task.duration,
          createdAt: task.createdAt.toISOString(),
        }),
      });
      if (!res.ok) {
        log("warn", `Webhook notify failed: ${res.status}`);
      }
    } catch (err) {
      log("warn", `Webhook notify error: ${err}`);
    }
  }
}

function formatTaskResult(task: Task): string {
  return `---
id: ${task.id}
source: ${task.source}
status: ${task.status}
created: ${task.createdAt.toISOString()}
duration: ${task.duration ?? 0}ms
---

${task.result ?? task.error ?? "No output"}
`;
}
