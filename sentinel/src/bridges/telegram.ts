import { writeFile, mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";
import type { SentinelConfig, TelegramBridgeConfig, Task } from "../core/types.js";
import { log } from "../core/logger.js";

const TELEGRAM_API = "https://api.telegram.org/bot";

/**
 * TelegramBridge provides two-way remote control of Sentinel.
 *
 * Inbound:  Telegram messages → inbox task files
 * Outbound: Task results → Telegram replies
 * Commands: /status, /help → instant responses
 *
 * Uses long polling (no webhooks, no ngrok, no public IP needed).
 * Zero dependencies — raw fetch against the Telegram Bot API.
 */
export class TelegramBridge {
  private config: TelegramBridgeConfig;
  private sentinelConfig: SentinelConfig;
  private running = false;
  private offset = 0;
  private pollIntervalMs: number;
  private onTaskComplete?: (task: Task) => void;
  private pendingReplies: Map<string, string> = new Map(); // taskId → chatId

  constructor(sentinelConfig: SentinelConfig) {
    if (!sentinelConfig.telegram) {
      throw new Error("Telegram bridge requires telegram config");
    }
    this.config = sentinelConfig.telegram;
    this.sentinelConfig = sentinelConfig;
    this.pollIntervalMs = (this.config.pollInterval ?? 2) * 1000;
  }

  async start(): Promise<void> {
    // Verify bot token works
    const me = await this.apiCall("getMe");
    if (!me.ok) {
      throw new Error(`Telegram bot auth failed: ${JSON.stringify(me)}`);
    }
    log("info", `Telegram bridge connected as @${me.result.username}`);

    this.running = true;
    this.poll();
  }

  stop(): void {
    this.running = false;
    log("info", "Telegram bridge stopped");
  }

  /** Called by the daemon when a task completes — sends result back to Telegram */
  async handleTaskComplete(task: Task): Promise<void> {
    const chatId = this.pendingReplies.get(task.id);
    if (!chatId) return; // Task wasn't from Telegram

    this.pendingReplies.delete(task.id);

    const icon = task.status === "completed" ? "[OK]" : "[FAIL]";
    const duration = task.duration ? `${(task.duration / 1000).toFixed(1)}s` : "?";
    const body = task.result ?? task.error ?? "No output";

    // Telegram has a 4096 char limit per message
    const maxLen = 3800;
    const truncated = body.length > maxLen
      ? body.slice(0, maxLen) + "\n\n... (truncated)"
      : body;

    const text = `${icon} Task ${task.id} (${duration})\n\n${truncated}`;
    await this.sendMessage(chatId, text);
  }

  /** Register a task ID to get a reply in the originating chat */
  trackTask(taskId: string, chatId: string): void {
    this.pendingReplies.set(taskId, chatId);
  }

  private async poll(): Promise<void> {
    while (this.running) {
      try {
        const updates = await this.getUpdates();
        for (const update of updates) {
          this.offset = update.update_id + 1;
          await this.handleUpdate(update);
        }
      } catch (err) {
        log("warn", `Telegram poll error: ${err}`);
      }

      await sleep(this.pollIntervalMs);
    }
  }

  private async handleUpdate(update: any): Promise<void> {
    const message = update.message;
    if (!message?.text) return;

    const chatId = String(message.chat.id);
    const text = message.text.trim();
    const username = message.from?.username ?? "unknown";

    // Security: only allow configured chat IDs
    if (!this.config.allowedChatIds.includes(chatId)) {
      log("warn", `Telegram: rejected message from unauthorized chat ${chatId} (@${username})`);
      await this.sendMessage(chatId, "Unauthorized. Your chat ID is not in the allowedChatIds config.");
      return;
    }

    log("info", `Telegram: message from @${username} (${chatId}): ${text.slice(0, 80)}`);

    // Handle commands
    if (text.startsWith("/")) {
      await this.handleCommand(chatId, text);
      return;
    }

    // Everything else is a task
    await this.createTask(chatId, text, username);
  }

  private async handleCommand(chatId: string, text: string): Promise<void> {
    const [cmd] = text.split(" ");

    switch (cmd) {
      case "/status":
        await this.handleStatus(chatId);
        break;

      case "/help":
        await this.sendMessage(chatId, [
          "Sentinel — Remote Control",
          "",
          "Send any message to queue it as a task.",
          "",
          "Commands:",
          "/status — Queue counts",
          "/help — This message",
          "/ping — Check if alive",
        ].join("\n"));
        break;

      case "/ping":
        await this.sendMessage(chatId, "Sentinel is alive.");
        break;

      case "/start":
        await this.sendMessage(chatId, [
          "Sentinel connected.",
          "",
          "Send me any message and I'll feed it to Claude.",
          "Results come back here when done.",
          "",
          "Try: summarize the last 5 commits in ~/Development/sentinel",
        ].join("\n"));
        break;

      default:
        await this.sendMessage(chatId, `Unknown command: ${cmd}\nSend /help for options.`);
    }
  }

  private async handleStatus(chatId: string): Promise<void> {
    try {
      const inboxPath = this.sentinelConfig.inbox;
      const inbox = await readdir(inboxPath).catch(() => []);
      const processing = await readdir(join(inboxPath, ".processing")).catch(() => []);
      const done = await readdir(join(inboxPath, ".done")).catch(() => []);
      const failed = await readdir(join(inboxPath, ".failed")).catch(() => []);
      const outbox = await readdir(this.sentinelConfig.outbox).catch(() => []);

      const pending = inbox.filter((f) => f.endsWith(".md")).length;

      await this.sendMessage(chatId, [
        "Sentinel Status",
        `  Pending:    ${pending}`,
        `  Processing: ${processing.length}`,
        `  Completed:  ${done.length}`,
        `  Failed:     ${failed.length}`,
        `  Results:    ${outbox.length}`,
        `  Tracking:   ${this.pendingReplies.size} replies`,
      ].join("\n"));
    } catch (err) {
      await this.sendMessage(chatId, `Status error: ${err}`);
    }
  }

  private async createTask(chatId: string, prompt: string, username: string): Promise<void> {
    const inboxPath = this.sentinelConfig.inbox;
    await mkdir(inboxPath, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const slug = prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const taskId = Math.random().toString(36).slice(2, 10);
    const filename = `${timestamp}--tg-${taskId}--${slug}.md`;
    const filepath = join(inboxPath, filename);

    await writeFile(filepath, prompt);

    // Track this task so we can reply when it completes
    // Extract the task ID that InboxWatcher will assign — we use the filename
    // to correlate since the inbox watcher reads the file
    this.pendingReplies.set(taskId, chatId);

    await this.sendMessage(chatId, `Queued. Task ID: ${taskId}\nI'll reply when Claude is done.`);
    log("info", `Telegram: queued task ${taskId} from @${username}`);
  }

  private async getUpdates(): Promise<any[]> {
    const res = await this.apiCall("getUpdates", {
      offset: this.offset,
      timeout: 10, // long poll — 10 second timeout
      allowed_updates: ["message"],
    });

    if (!res.ok) {
      log("warn", `Telegram getUpdates failed: ${JSON.stringify(res)}`);
      return [];
    }

    return res.result ?? [];
  }

  async sendMessage(chatId: string, text: string): Promise<void> {
    try {
      const res = await this.apiCall("sendMessage", {
        chat_id: chatId,
        text,
      });
      if (!res.ok) {
        log("warn", `Telegram sendMessage failed: ${JSON.stringify(res)}`);
      }
    } catch (err) {
      log("warn", `Telegram sendMessage error: ${err}`);
    }
  }

  private async apiCall(method: string, body?: Record<string, any>): Promise<any> {
    const url = `${TELEGRAM_API}${this.config.botToken}/${method}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(15_000),
    });
    return res.json();
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
