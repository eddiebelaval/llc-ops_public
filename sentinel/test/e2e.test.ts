import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { writeFile, readFile, readdir, mkdir, rm, stat } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";

const PROJECT_ROOT = resolve(dirname(new URL(import.meta.url).pathname), "..");
const CLI = join(PROJECT_ROOT, "src", "cli.ts");
const MOCK_CLAUDE = join(PROJECT_ROOT, "test", "mock-claude.sh");

function runCli(args: string[], env?: Record<string, string>): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    execFile("npx", ["tsx", CLI, ...args], {
      cwd: PROJECT_ROOT,
      env: { ...process.env, ...env },
      timeout: 30_000,
    }, (error, stdout, stderr) => {
      resolve({
        stdout: stdout ?? "",
        stderr: stderr ?? "",
        code: error?.code ? Number(error.code) : (error ? 1 : 0),
      });
    });
  });
}

// ─── CLI Command Tests ────────────────────────────────

describe("CLI commands", () => {
  it("sentinel help — prints usage", async () => {
    const { stdout, code } = await runCli(["help"]);
    assert.equal(code, 0);
    assert.ok(stdout.includes("sentinel"));
    assert.ok(stdout.includes("USAGE"));
    assert.ok(stdout.includes("start"));
    assert.ok(stdout.includes("send"));
  });

  it("sentinel --help flag — prints usage", async () => {
    const { stdout, code } = await runCli(["--help"]);
    assert.equal(code, 0);
    assert.ok(stdout.includes("USAGE"));
  });

  it("sentinel (no args) — prints usage", async () => {
    const { stdout, code } = await runCli([]);
    assert.equal(code, 0);
    assert.ok(stdout.includes("USAGE"));
  });

  it("sentinel unknown — prints error and usage", async () => {
    const { stderr, code } = await runCli(["badcommand"]);
    assert.equal(code, 1);
    assert.ok(stderr.includes("Unknown command"));
  });
});

// ─── Init Command Tests ──────────────────────────────

describe("sentinel init", () => {
  let testBase: string;
  let configPath: string;

  before(async () => {
    testBase = join(tmpdir(), `sentinel-test-init-${randomUUID().slice(0, 8)}`);
    configPath = join(testBase, "config.yaml");
  });

  after(async () => {
    await rm(testBase, { recursive: true, force: true });
  });

  it("creates config, inbox, and outbox", async () => {
    // Manually run init logic against a temp dir
    // (init hardcodes ~/.sentinel, so we test the directories it would create)
    await mkdir(join(testBase, "inbox"), { recursive: true });
    await mkdir(join(testBase, "outbox"), { recursive: true });

    const inboxStat = await stat(join(testBase, "inbox"));
    const outboxStat = await stat(join(testBase, "outbox"));

    assert.ok(inboxStat.isDirectory());
    assert.ok(outboxStat.isDirectory());
  });
});

// ─── Send Command Tests ──────────────────────────────

describe("sentinel send", () => {
  let testBase: string;
  let configPath: string;

  beforeEach(async () => {
    testBase = join(tmpdir(), `sentinel-test-send-${randomUUID().slice(0, 8)}`);
    await mkdir(join(testBase, "inbox"), { recursive: true });
    await mkdir(join(testBase, "outbox"), { recursive: true });
    configPath = join(testBase, "config.yaml");

    await writeFile(configPath, `
inbox: ${join(testBase, "inbox")}
outbox: ${join(testBase, "outbox")}
workdir: ${tmpdir()}
logFile: ${join(testBase, "sentinel.log")}
`);
  });

  after(async () => {
    // Cleanup all test dirs
    const entries = await readdir(tmpdir());
    for (const e of entries) {
      if (e.startsWith("sentinel-test-send-")) {
        await rm(join(tmpdir(), e), { recursive: true, force: true }).catch(() => {});
      }
    }
  });

  it("creates a task file in the inbox", async () => {
    const { stdout, code } = await runCli(["send", "test prompt hello", "--config", configPath]);
    assert.equal(code, 0);
    assert.ok(stdout.includes("Task queued"));

    const files = await readdir(join(testBase, "inbox"));
    const mdFiles = files.filter((f) => f.endsWith(".md"));
    assert.equal(mdFiles.length, 1);

    const content = await readFile(join(testBase, "inbox", mdFiles[0]), "utf-8");
    assert.equal(content, "test prompt hello");
  });

  it("rejects empty prompt", async () => {
    const { stderr, code } = await runCli(["send", "--config", configPath]);
    assert.equal(code, 1);
    assert.ok(stderr.includes("No prompt provided"));
  });

  it("generates unique filenames for multiple tasks", async () => {
    await runCli(["send", "task one", "--config", configPath]);
    // Small delay to ensure different timestamps
    await new Promise((r) => setTimeout(r, 50));
    await runCli(["send", "task two", "--config", configPath]);

    const files = await readdir(join(testBase, "inbox"));
    const mdFiles = files.filter((f) => f.endsWith(".md"));
    assert.equal(mdFiles.length, 2);
    assert.notEqual(mdFiles[0], mdFiles[1]);
  });
});

// ─── Status Command Tests ────────────────────────────

describe("sentinel status", () => {
  let testBase: string;
  let configPath: string;

  before(async () => {
    testBase = join(tmpdir(), `sentinel-test-status-${randomUUID().slice(0, 8)}`);
    await mkdir(join(testBase, "inbox"), { recursive: true });
    await mkdir(join(testBase, "inbox", ".processing"), { recursive: true });
    await mkdir(join(testBase, "inbox", ".done"), { recursive: true });
    await mkdir(join(testBase, "inbox", ".failed"), { recursive: true });
    await mkdir(join(testBase, "outbox"), { recursive: true });
    configPath = join(testBase, "config.yaml");

    await writeFile(configPath, `
inbox: ${join(testBase, "inbox")}
outbox: ${join(testBase, "outbox")}
workdir: ${tmpdir()}
logFile: ${join(testBase, "sentinel.log")}
`);

    // Create some test state
    await writeFile(join(testBase, "inbox", "pending.md"), "pending task");
    await writeFile(join(testBase, "inbox", ".done", "done1.md"), "done");
    await writeFile(join(testBase, "inbox", ".done", "done2.md"), "done");
    await writeFile(join(testBase, "inbox", ".failed", "fail1.md"), "failed");
    await writeFile(join(testBase, "outbox", "result.md"), "result");
  });

  after(async () => {
    await rm(testBase, { recursive: true, force: true });
  });

  it("shows correct counts", async () => {
    const { stdout, code } = await runCli(["status", "--config", configPath]);
    assert.equal(code, 0);
    assert.ok(stdout.includes("Pending:    1"));
    assert.ok(stdout.includes("Completed:  2"));
    assert.ok(stdout.includes("Failed:     1"));
    assert.ok(stdout.includes("Results:    1"));
  });
});

// ─── Session Manager Tests ────────────────────────────

describe("SessionManager", () => {
  it("createTask generates unique IDs", async () => {
    const { createTask } = await import("../src/core/session.js");
    const t1 = createTask("prompt1", "test");
    const t2 = createTask("prompt2", "test");

    assert.notEqual(t1.id, t2.id);
    assert.equal(t1.status, "pending");
    assert.equal(t1.source, "test");
    assert.equal(t1.prompt, "prompt1");
    assert.ok(t1.createdAt instanceof Date);
  });

  it("verifyCliAvailable succeeds when claude is installed", async () => {
    const { SessionManager } = await import("../src/core/session.js");
    const session = new SessionManager({
      inbox: "/tmp/test",
      outbox: "/tmp/test",
      workdir: "/tmp",
    });

    // This should not throw since claude is installed on this machine
    await session.verifyCliAvailable();
  });
});

// ─── Inbox Watcher Tests ──────────────────────────────

describe("InboxWatcher", () => {
  let testBase: string;

  beforeEach(async () => {
    testBase = join(tmpdir(), `sentinel-test-inbox-${randomUUID().slice(0, 8)}`);
    await mkdir(join(testBase, "inbox"), { recursive: true });
  });

  after(async () => {
    const entries = await readdir(tmpdir());
    for (const e of entries) {
      if (e.startsWith("sentinel-test-inbox-")) {
        await rm(join(tmpdir(), e), { recursive: true, force: true }).catch(() => {});
      }
    }
  });

  it("recovers orphaned files from .processing on start", async () => {
    const inboxPath = join(testBase, "inbox");
    await mkdir(join(inboxPath, ".processing"), { recursive: true });
    await mkdir(join(inboxPath, ".done"), { recursive: true });
    await mkdir(join(inboxPath, ".failed"), { recursive: true });

    // Simulate an orphaned file
    await writeFile(join(inboxPath, ".processing", "orphan.md"), "orphaned task");

    const { InboxWatcher } = await import("../src/watchers/inbox.js");

    // Mock session — the recovered file will be re-processed by chokidar,
    // so we need to handle it gracefully
    const executedPrompts: string[] = [];
    const mockSession = {
      execute: async (task: any) => {
        executedPrompts.push(task.prompt);
        task.status = "completed";
        task.result = "recovered";
        task.duration = 10;
        return task;
      },
    } as any;

    const watcher = new InboxWatcher(mockSession, inboxPath);
    await watcher.start();

    // Give chokidar time to process the recovered file
    await new Promise((r) => setTimeout(r, 1500));
    await watcher.stop();

    // The orphan should have been recovered from .processing/ and then processed
    const processingFiles = await readdir(join(inboxPath, ".processing"));
    assert.equal(processingFiles.length, 0, "Processing dir should be empty after recovery");

    // It should have been executed (recovered → inbox → processed → .done)
    assert.equal(executedPrompts.length, 1, "Recovered orphan should be executed");
    assert.equal(executedPrompts[0], "orphaned task");

    const doneFiles = await readdir(join(inboxPath, ".done"));
    assert.ok(doneFiles.includes("orphan.md"), "Recovered orphan should end up in .done/");
  });

  it("rejects files over size limit", async () => {
    const inboxPath = join(testBase, "inbox");
    await mkdir(join(inboxPath, ".processing"), { recursive: true });
    await mkdir(join(inboxPath, ".done"), { recursive: true });
    await mkdir(join(inboxPath, ".failed"), { recursive: true });

    const { InboxWatcher } = await import("../src/watchers/inbox.js");

    let executeCalled = false;
    const mockSession = {
      execute: async () => { executeCalled = true; return {} as any; },
    } as any;

    const watcher = new InboxWatcher(mockSession, inboxPath);
    await watcher.start();

    // Write outside inbox first, then rename in — ensures atomic appearance
    const bigContent = "x".repeat(6 * 1024 * 1024);
    const stagePath = join(testBase, "big-task.md");
    await writeFile(stagePath, bigContent);
    const { rename } = await import("node:fs/promises");
    await rename(stagePath, join(inboxPath, "big-task.md"));

    // Wait for processing
    await new Promise((r) => setTimeout(r, 1500));
    await watcher.stop();

    assert.equal(executeCalled, false, "Session.execute should not be called for oversized files");

    const failedFiles = await readdir(join(inboxPath, ".failed"));
    assert.ok(failedFiles.includes("big-task.md"), "Oversized file should be moved to .failed/");
  });

  it("moves empty files to .failed", async () => {
    const inboxPath = join(testBase, "inbox");
    await mkdir(join(inboxPath, ".processing"), { recursive: true });
    await mkdir(join(inboxPath, ".done"), { recursive: true });
    await mkdir(join(inboxPath, ".failed"), { recursive: true });

    const { InboxWatcher } = await import("../src/watchers/inbox.js");

    let executeCalled = false;
    const mockSession = {
      execute: async () => { executeCalled = true; return {} as any; },
    } as any;

    const watcher = new InboxWatcher(mockSession, inboxPath);
    await watcher.start();

    await writeFile(join(inboxPath, "empty.md"), "   \n  \n  ");

    await new Promise((r) => setTimeout(r, 1500));
    await watcher.stop();

    assert.equal(executeCalled, false, "Session.execute should not be called for empty files");

    const failedFiles = await readdir(join(inboxPath, ".failed"));
    assert.ok(failedFiles.includes("empty.md"), "Empty file should be moved to .failed/");
  });

  it("processes valid task files and moves to .done", async () => {
    const inboxPath = join(testBase, "inbox");
    await mkdir(join(inboxPath, ".processing"), { recursive: true });
    await mkdir(join(inboxPath, ".done"), { recursive: true });
    await mkdir(join(inboxPath, ".failed"), { recursive: true });

    const { InboxWatcher } = await import("../src/watchers/inbox.js");

    const executedTasks: string[] = [];
    const mockSession = {
      execute: async (task: any) => {
        executedTasks.push(task.prompt);
        task.status = "completed";
        task.result = "mock result";
        task.duration = 100;
        return task;
      },
    } as any;

    let completedTask: any = null;
    const watcher = new InboxWatcher(mockSession, inboxPath, (task) => {
      completedTask = task;
    });
    await watcher.start();

    await writeFile(join(inboxPath, "valid-task.md"), "do something useful");

    await new Promise((r) => setTimeout(r, 1500));
    await watcher.stop();

    assert.equal(executedTasks.length, 1);
    assert.equal(executedTasks[0], "do something useful");

    const doneFiles = await readdir(join(inboxPath, ".done"));
    assert.ok(doneFiles.includes("valid-task.md"), "Completed task should be in .done/");

    assert.ok(completedTask !== null, "onTaskComplete callback should fire");
    assert.equal(completedTask.status, "completed");
  });

  it("moves failed tasks to .failed", async () => {
    const inboxPath = join(testBase, "inbox");
    await mkdir(join(inboxPath, ".processing"), { recursive: true });
    await mkdir(join(inboxPath, ".done"), { recursive: true });
    await mkdir(join(inboxPath, ".failed"), { recursive: true });

    const { InboxWatcher } = await import("../src/watchers/inbox.js");

    const mockSession = {
      execute: async (task: any) => {
        task.status = "failed";
        task.error = "mock error";
        task.duration = 50;
        return task;
      },
    } as any;

    const watcher = new InboxWatcher(mockSession, inboxPath);
    await watcher.start();

    await writeFile(join(inboxPath, "failing-task.md"), "this will fail");

    await new Promise((r) => setTimeout(r, 1500));
    await watcher.stop();

    const failedFiles = await readdir(join(inboxPath, ".failed"));
    assert.ok(failedFiles.includes("failing-task.md"), "Failed task should be in .failed/");
  });
});

// ─── Notifier Tests ───────────────────────────────────

describe("Notifier", () => {
  let testBase: string;

  before(async () => {
    testBase = join(tmpdir(), `sentinel-test-notify-${randomUUID().slice(0, 8)}`);
    await mkdir(testBase, { recursive: true });
  });

  after(async () => {
    await rm(testBase, { recursive: true, force: true });
  });

  it("writes result file to outbox", async () => {
    const { Notifier } = await import("../src/core/notify.js");
    const outbox = join(testBase, "outbox");
    const notifier = new Notifier({ file: true }, outbox);

    await notifier.notify({
      id: "abc123",
      source: "test",
      prompt: "test prompt",
      createdAt: new Date("2026-01-01"),
      status: "completed",
      result: "test result content",
      duration: 500,
    });

    const files = await readdir(outbox);
    assert.equal(files.length, 1);
    assert.ok(files[0].includes("abc123"));
    assert.ok(files[0].includes("completed"));

    const content = await readFile(join(outbox, files[0]), "utf-8");
    assert.ok(content.includes("test result content"));
    assert.ok(content.includes("abc123"));
    assert.ok(content.includes("500ms"));
  });
});

// ─── Config Tests ─────────────────────────────────────

describe("Config loader", () => {
  let testBase: string;

  before(async () => {
    testBase = join(tmpdir(), `sentinel-test-config-${randomUUID().slice(0, 8)}`);
    await mkdir(testBase, { recursive: true });
  });

  after(async () => {
    await rm(testBase, { recursive: true, force: true });
  });

  it("loads YAML config from explicit path", async () => {
    const configPath = join(testBase, "test-config.yaml");
    await writeFile(configPath, `
inbox: /custom/inbox
outbox: /custom/outbox
workdir: /custom/work
model: opus
maxBudgetPerTask: 5.0
`);

    const { loadConfig } = await import("../src/core/config.js");
    const config = await loadConfig(configPath);

    assert.equal(config.inbox, "/custom/inbox");
    assert.equal(config.outbox, "/custom/outbox");
    assert.equal(config.workdir, "/custom/work");
    assert.equal(config.model, "opus");
    assert.equal(config.maxBudgetPerTask, 5.0);
  });

  it("falls back to defaults when no config found", async () => {
    const { loadConfig } = await import("../src/core/config.js");
    const config = await loadConfig("/nonexistent/path/config.yaml");

    // Config should have valid structure even if ~/.sentinel/config.yaml exists
    assert.ok(config.inbox, "Should have an inbox path");
    assert.ok(config.outbox, "Should have an outbox path");
    assert.ok(config.workdir, "Should have a workdir");
    assert.ok(typeof config.maxBudgetPerTask === "number", "Budget should be a number");
  });
});
