import { mkdir } from "node:fs/promises";
import { SessionManager, SessionPool } from "./session.js";
import { Notifier } from "./notify.js";
import { InboxWatcher } from "../watchers/inbox.js";
import { TelegramBridge } from "../bridges/telegram.js";
import type { SentinelConfig } from "./types.js";
import { log, configureLogger } from "./logger.js";

export class Daemon {
  private config: SentinelConfig;
  private session: SessionManager | SessionPool;
  private notifier: Notifier;
  private inbox: InboxWatcher;
  private telegram: TelegramBridge | null = null;
  private running = false;

  constructor(config: SentinelConfig) {
    this.config = config;

    configureLogger({
      logFile: config.logFile,
      level: "info",
    });

    const concurrency = config.maxConcurrency ?? 1;
    this.session = concurrency > 1
      ? new SessionPool(config, concurrency)
      : new SessionManager(config);

    this.notifier = new Notifier(
      config.notify ?? { file: true, stdout: true },
      config.outbox,
    );

    if (config.telegram) {
      this.telegram = new TelegramBridge(config);
    }

    this.inbox = new InboxWatcher(this.session, config.inbox, (task) => {
      this.notifier.notify(task);
      this.telegram?.handleTaskComplete(task);
    });
  }

  async start(): Promise<void> {
    if (this.running) return;

    log("info", "========================================");
    log("info", "  Sentinel v0.1.0 starting...");
    log("info", `  Session: ${this.session.sessionId}`);
    log("info", `  Inbox:   ${this.config.inbox}`);
    log("info", `  Outbox:  ${this.config.outbox}`);
    log("info", `  Workdir: ${this.config.workdir}`);
    if ((this.config.maxConcurrency ?? 1) > 1) {
      log("info", `  Sessions: ${this.config.maxConcurrency} (parallel)`);
    }
    if (this.telegram) {
      log("info", "  Telegram: enabled");
    }
    log("info", "========================================");

    await this.session.verifyCliAvailable();

    await Promise.all([
      mkdir(this.config.inbox, { recursive: true }),
      mkdir(this.config.outbox, { recursive: true }),
    ]);

    await this.inbox.start();

    if (this.telegram) {
      await this.telegram.start();
    }

    process.on("SIGINT", () => this.shutdown("SIGINT"));
    process.on("SIGTERM", () => this.shutdown("SIGTERM"));

    this.running = true;
    log("info", "Sentinel is running. Drop .md files into the inbox to send tasks.");

    await this.keepAlive();
  }

  async stop(): Promise<void> {
    if (!this.running) return;
    this.running = false;

    log("info", "Stopping Sentinel...");
    this.telegram?.stop();
    await this.inbox.stop();

    const stats = this.session.stats;
    log("info", `Session stats: ${stats.tasksCompleted} tasks completed`);
    log("info", "Sentinel stopped.");
  }

  private async shutdown(signal: string): Promise<void> {
    log("info", `Received ${signal}`);
    await this.stop();
    process.exit(0);
  }

  private keepAlive(): Promise<void> {
    return new Promise(() => {
      // Intentionally never resolves — keeps the event loop alive.
    });
  }
}
