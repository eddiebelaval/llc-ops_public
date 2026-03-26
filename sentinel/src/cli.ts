#!/usr/bin/env node

import { parseArgs } from "node:util";
import { execFileSync } from "node:child_process";
import { writeFile, mkdir, readdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
import { loadConfig } from "./core/config.js";
import { Daemon } from "./core/daemon.js";
import { log } from "./core/logger.js";

const HELP = `
sentinel — Always-on daemon for Claude Code

USAGE
  sentinel start [--config path]    Start the daemon
  sentinel send "prompt"            Drop a task into the inbox
  sentinel status                   Show daemon status
  sentinel init                     Create default config
  sentinel install                  Install as macOS launchd service
  sentinel uninstall                Remove launchd service
  sentinel help                     Show this help

OPTIONS
  --config, -c    Path to config file (default: ~/.sentinel/config.yaml)
  --workdir, -w   Working directory for Claude sessions
  --model, -m     Claude model to use

INBOX
  Drop any .md file into ~/.sentinel/inbox/ to queue a task.
  Results appear in ~/.sentinel/outbox/.

EXAMPLES
  sentinel start                           # Start with defaults
  sentinel send "summarize git log"        # Quick task
  sentinel send "run tests and fix fails"  # Autonomous fix loop
  echo "check for drift" > ~/.sentinel/inbox/drift-check.md
`;

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    strict: false,
    allowPositionals: true,
    options: {
      config: { type: "string", short: "c" },
      workdir: { type: "string", short: "w" },
      model: { type: "string", short: "m" },
      help: { type: "boolean", short: "h" },
    },
  });

  if (values.help || positionals.length === 0) {
    console.log(HELP);
    process.exit(0);
  }

  const command = positionals[0];

  switch (command) {
    case "start":
      await startDaemon(values);
      break;

    case "send":
      await sendTask(positionals.slice(1).join(" "), values);
      break;

    case "status":
      await showStatus(values);
      break;

    case "init":
      await initConfig();
      break;

    case "install":
      await installService(values);
      break;

    case "uninstall":
      await uninstallService();
      break;

    case "help":
      console.log(HELP);
      break;

    default:
      console.error(`Unknown command: ${command}`);
      console.log(HELP);
      process.exit(1);
  }
}

async function startDaemon(opts: Record<string, unknown>): Promise<void> {
  const config = await loadConfig(opts.config as string | undefined);

  if (opts.workdir) config.workdir = opts.workdir as string;
  if (opts.model) config.model = opts.model as string;

  const daemon = new Daemon(config);
  await daemon.start();
}

async function sendTask(
  prompt: string,
  opts: Record<string, unknown>,
): Promise<void> {
  if (!prompt.trim()) {
    console.error("Error: No prompt provided. Usage: sentinel send \"your prompt\"");
    process.exit(1);
  }

  const config = await loadConfig(opts.config as string | undefined);
  const inboxPath = config.inbox;
  await mkdir(inboxPath, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const slug = prompt.slice(0, 40).replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  const filename = `${timestamp}--${slug}.md`;
  const filepath = join(inboxPath, filename);

  await writeFile(filepath, prompt);
  console.log(`Task queued: ${filepath}`);
}

async function showStatus(opts: Record<string, unknown>): Promise<void> {
  const config = await loadConfig(opts.config as string | undefined);

  try {
    const inbox = await readdir(config.inbox).catch(() => []);
    const processing = await readdir(join(config.inbox, ".processing")).catch(() => []);
    const done = await readdir(join(config.inbox, ".done")).catch(() => []);
    const failed = await readdir(join(config.inbox, ".failed")).catch(() => []);
    const outbox = await readdir(config.outbox).catch(() => []);

    const pendingTasks = inbox.filter((f) => f.endsWith(".md"));

    console.log(`Sentinel Status`);
    console.log(`  Pending:    ${pendingTasks.length}`);
    console.log(`  Processing: ${processing.length}`);
    console.log(`  Completed:  ${done.length}`);
    console.log(`  Failed:     ${failed.length}`);
    console.log(`  Results:    ${outbox.length}`);
  } catch {
    console.log("Sentinel not initialized. Run: sentinel init");
  }
}

async function initConfig(): Promise<void> {
  const base = join(homedir(), ".sentinel");
  await mkdir(base, { recursive: true });
  await mkdir(join(base, "inbox"), { recursive: true });
  await mkdir(join(base, "outbox"), { recursive: true });

  const configPath = join(base, "config.yaml");
  const defaultConfig = `# Sentinel — Always-on Claude Code daemon
# https://github.com/your-username/sentinel

# Where to watch for incoming task files
inbox: ${join(base, "inbox")}

# Where to write results
outbox: ${join(base, "outbox")}

# Working directory for Claude sessions
workdir: ${homedir()}/Development

# Claude model (optional — uses your default)
# model: sonnet

# Permission mode for Claude CLI
permissionMode: auto

# Max spend per task in USD
maxBudgetPerTask: 1.00

# Max parallel sessions (each gets its own Claude session)
# maxConcurrency: 3

# Log file
logFile: ${join(base, "sentinel.log")}

# Notification targets
notify:
  file: true
  stdout: true
  # telegram:
  #   botToken: "your-bot-token"
  #   chatId: "your-chat-id"
  # webhook: "https://your-webhook-url.com/sentinel"

# Telegram bridge — two-way remote control
# Send tasks from your phone, get results back in chat
# telegram:
#   botToken: "your-bot-token-from-botfather"
#   allowedChatIds:
#     - "your-chat-id"
#   pollInterval: 2
`;

  await writeFile(configPath, defaultConfig);
  console.log(`Sentinel initialized:`);
  console.log(`  Config:  ${configPath}`);
  console.log(`  Inbox:   ${join(base, "inbox")}`);
  console.log(`  Outbox:  ${join(base, "outbox")}`);
  console.log(`\nStart with: sentinel start`);
}

const PLIST_LABEL = "com.sentinel.daemon";
const PLIST_PATH = join(homedir(), "Library", "LaunchAgents", `${PLIST_LABEL}.plist`);

async function installService(opts: Record<string, unknown>): Promise<void> {
  if (process.platform !== "darwin") {
    console.error("Error: sentinel install is only supported on macOS (launchd).");
    console.error("On Linux, create a systemd unit file manually.");
    process.exit(1);
  }

  const config = await loadConfig(opts.config as string | undefined);
  const base = join(homedir(), ".sentinel");

  // Resolve actual paths — launchd runs with minimal PATH
  let nodePath: string;
  let cliPath: string;
  try {
    nodePath = execFileSync("which", ["node"], { encoding: "utf-8" }).trim();
    cliPath = join(process.cwd(), "dist", "cli.js");
  } catch {
    console.error("Error: Could not resolve node path. Is Node.js installed?");
    process.exit(1);
  }

  const configFlag = opts.config ? `<string>--config</string>\n      <string>${opts.config}</string>` : "";

  const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${PLIST_LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${nodePath}</string>
    <string>${cliPath}</string>
    <string>start</string>
    ${configFlag}
  </array>
  <key>WorkingDirectory</key>
  <string>${config.workdir}</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>${join(base, "daemon-stdout.log")}</string>
  <key>StandardErrorPath</key>
  <string>${join(base, "daemon-stderr.log")}</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>${process.env.PATH}</string>
    <key>HOME</key>
    <string>${homedir()}</string>
  </dict>
</dict>
</plist>
`;

  await mkdir(join(homedir(), "Library", "LaunchAgents"), { recursive: true });
  await writeFile(PLIST_PATH, plist);

  try {
    execFileSync("launchctl", ["load", "-w", PLIST_PATH], { stdio: "pipe" });
  } catch {
    console.error(`Warning: launchctl load failed. You may need to load manually.`);
  }

  console.log(`Sentinel installed as launchd service:`);
  console.log(`  Plist:  ${PLIST_PATH}`);
  console.log(`  Logs:   ${join(base, "daemon-stdout.log")}`);
  console.log(`\nSentinel will start on login and restart on crash.`);
  console.log(`Uninstall with: sentinel uninstall`);
}

async function uninstallService(): Promise<void> {
  if (process.platform !== "darwin") {
    console.error("Error: sentinel uninstall is only supported on macOS.");
    process.exit(1);
  }

  try {
    execFileSync("launchctl", ["unload", PLIST_PATH], { stdio: "pipe" });
  } catch {
    // Service may not be loaded — that's fine
  }

  try {
    await unlink(PLIST_PATH);
    console.log(`Sentinel service removed.`);
    console.log(`  Deleted: ${PLIST_PATH}`);
  } catch {
    console.log(`Sentinel service not installed (no plist found).`);
  }
}

main().catch((err) => {
  log("error", `Fatal: ${err}`);
  process.exit(1);
});
