import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

type LogLevel = "debug" | "info" | "warn" | "error";

let logFile: string | undefined;
let minLevel: LogLevel = "info";

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export function configureLogger(opts: {
  logFile?: string;
  level?: LogLevel;
}): void {
  if (opts.logFile) {
    logFile = opts.logFile;
    mkdirSync(dirname(logFile), { recursive: true });
  }
  if (opts.level) {
    minLevel = opts.level;
  }
}

export function log(level: LogLevel, message: string): void {
  if (LEVELS[level] < LEVELS[minLevel]) return;

  const timestamp = new Date().toISOString();
  const prefix = level.toUpperCase().padEnd(5);
  const line = `[${timestamp}] ${prefix} ${message}`;

  if (level === "error") {
    process.stderr.write(line + "\n");
  } else {
    process.stdout.write(line + "\n");
  }

  if (logFile) {
    try {
      appendFileSync(logFile, line + "\n");
    } catch {
      // Log file unavailable — continue without crashing
    }
  }
}
