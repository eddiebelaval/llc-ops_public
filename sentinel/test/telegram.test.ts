import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { readdir, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import type { SentinelConfig } from "../src/core/types.js";

// ─── Telegram Bridge Unit Tests ─────────────────────

describe("TelegramBridge", () => {
  let testBase: string;
  let testConfig: SentinelConfig;

  before(async () => {
    testBase = join(tmpdir(), `sentinel-test-tg-${randomUUID().slice(0, 8)}`);
    await mkdir(join(testBase, "inbox"), { recursive: true });
    await mkdir(join(testBase, "inbox", ".processing"), { recursive: true });
    await mkdir(join(testBase, "inbox", ".done"), { recursive: true });
    await mkdir(join(testBase, "inbox", ".failed"), { recursive: true });
    await mkdir(join(testBase, "outbox"), { recursive: true });

    testConfig = {
      inbox: join(testBase, "inbox"),
      outbox: join(testBase, "outbox"),
      workdir: tmpdir(),
      telegram: {
        botToken: "fake-token",
        allowedChatIds: ["12345", "67890"],
        pollInterval: 1,
      },
    };
  });

  after(async () => {
    await rm(testBase, { recursive: true, force: true });
  });

  it("rejects construction without telegram config", async () => {
    const { TelegramBridge } = await import("../src/bridges/telegram.js");
    assert.throws(() => {
      new TelegramBridge({
        inbox: "/tmp/test",
        outbox: "/tmp/test",
        workdir: "/tmp",
      });
    }, /requires telegram config/);
  });

  it("constructs with valid config", async () => {
    const { TelegramBridge } = await import("../src/bridges/telegram.js");
    const bridge = new TelegramBridge(testConfig);
    assert.ok(bridge);
  });

  it("tracks and matches task IDs for replies", async () => {
    const { TelegramBridge } = await import("../src/bridges/telegram.js");
    const bridge = new TelegramBridge(testConfig);

    // Track a task
    bridge.trackTask("abc123", "12345");

    // Simulate task completion — capture the sendMessage call
    let sentMessage = "";
    let sentChatId = "";
    // Override sendMessage to capture output
    bridge.sendMessage = async (chatId: string, text: string) => {
      sentChatId = chatId;
      sentMessage = text;
    };

    await bridge.handleTaskComplete({
      id: "abc123",
      source: "telegram",
      prompt: "test",
      createdAt: new Date(),
      status: "completed",
      result: "The answer is 42",
      duration: 1500,
    });

    assert.equal(sentChatId, "12345");
    assert.ok(sentMessage.includes("[OK]"));
    assert.ok(sentMessage.includes("abc123"));
    assert.ok(sentMessage.includes("The answer is 42"));
    assert.ok(sentMessage.includes("1.5s"));
  });

  it("ignores task completion for non-telegram tasks", async () => {
    const { TelegramBridge } = await import("../src/bridges/telegram.js");
    const bridge = new TelegramBridge(testConfig);

    let messageSent = false;
    bridge.sendMessage = async () => { messageSent = true; };

    await bridge.handleTaskComplete({
      id: "not-tracked",
      source: "inbox",
      prompt: "test",
      createdAt: new Date(),
      status: "completed",
      result: "result",
      duration: 100,
    });

    assert.equal(messageSent, false, "Should not send message for non-telegram tasks");
  });

  it("truncates long results to fit Telegram limit", async () => {
    const { TelegramBridge } = await import("../src/bridges/telegram.js");
    const bridge = new TelegramBridge(testConfig);

    bridge.trackTask("long-task", "12345");

    let sentMessage = "";
    bridge.sendMessage = async (_chatId: string, text: string) => {
      sentMessage = text;
    };

    const longResult = "x".repeat(5000);
    await bridge.handleTaskComplete({
      id: "long-task",
      source: "telegram",
      prompt: "test",
      createdAt: new Date(),
      status: "completed",
      result: longResult,
      duration: 100,
    });

    assert.ok(sentMessage.length < 4200, "Message should be truncated");
    assert.ok(sentMessage.includes("truncated"), "Should indicate truncation");
  });

  it("handles failed tasks with error message", async () => {
    const { TelegramBridge } = await import("../src/bridges/telegram.js");
    const bridge = new TelegramBridge(testConfig);

    bridge.trackTask("fail-task", "12345");

    let sentMessage = "";
    bridge.sendMessage = async (_chatId: string, text: string) => {
      sentMessage = text;
    };

    await bridge.handleTaskComplete({
      id: "fail-task",
      source: "telegram",
      prompt: "test",
      createdAt: new Date(),
      status: "failed",
      error: "Something broke",
      duration: 50,
    });

    assert.ok(sentMessage.includes("[FAIL]"));
    assert.ok(sentMessage.includes("Something broke"));
  });
});

// ─── Telegram Task ID Extraction in InboxWatcher ─────

describe("InboxWatcher telegram ID extraction", () => {
  let testBase: string;

  before(async () => {
    testBase = join(tmpdir(), `sentinel-test-tg-inbox-${randomUUID().slice(0, 8)}`);
    await mkdir(join(testBase, "inbox"), { recursive: true });
    await mkdir(join(testBase, "inbox", ".processing"), { recursive: true });
    await mkdir(join(testBase, "inbox", ".done"), { recursive: true });
    await mkdir(join(testBase, "inbox", ".failed"), { recursive: true });
  });

  after(async () => {
    await rm(testBase, { recursive: true, force: true });
  });

  it("extracts telegram task ID from filename and uses it", async () => {
    const inboxPath = join(testBase, "inbox");
    const { InboxWatcher } = await import("../src/watchers/inbox.js");

    const executedTasks: Array<{ id: string; source: string }> = [];
    const mockSession = {
      execute: async (task: any) => {
        executedTasks.push({ id: task.id, source: task.source });
        task.status = "completed";
        task.result = "done";
        task.duration = 10;
        return task;
      },
    } as any;

    const watcher = new InboxWatcher(mockSession, inboxPath);
    await watcher.start();

    // Drop a telegram-sourced task file
    await writeFile(
      join(inboxPath, "2026-03-13T16-00-00--tg-abc12345--summarize-commits.md"),
      "summarize the last 5 commits"
    );

    await new Promise((r) => setTimeout(r, 1500));
    await watcher.stop();

    assert.equal(executedTasks.length, 1);
    assert.equal(executedTasks[0].id, "abc12345", "Should use telegram task ID");
    assert.equal(executedTasks[0].source, "telegram", "Should detect telegram source");
  });

  it("uses random ID for non-telegram files", async () => {
    const inboxPath = join(testBase, "inbox");
    const { InboxWatcher } = await import("../src/watchers/inbox.js");

    const executedTasks: Array<{ id: string; source: string }> = [];
    const mockSession = {
      execute: async (task: any) => {
        executedTasks.push({ id: task.id, source: task.source });
        task.status = "completed";
        task.result = "done";
        task.duration = 10;
        return task;
      },
    } as any;

    const watcher = new InboxWatcher(mockSession, inboxPath);
    await watcher.start();

    await writeFile(
      join(inboxPath, "regular-task.md"),
      "do something"
    );

    await new Promise((r) => setTimeout(r, 1500));
    await watcher.stop();

    assert.equal(executedTasks.length, 1);
    assert.equal(executedTasks[0].source, "inbox", "Should be inbox source");
    assert.notEqual(executedTasks[0].id, "", "Should have a generated ID");
  });
});
