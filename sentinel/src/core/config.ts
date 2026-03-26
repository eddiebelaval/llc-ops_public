import { readFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { homedir } from "node:os";
import { parse as parseYaml } from "yaml";
import type { SentinelConfig } from "./types.js";

const DEFAULT_BASE = join(homedir(), ".sentinel");

const DEFAULTS: SentinelConfig = {
  inbox: join(DEFAULT_BASE, "inbox"),
  outbox: join(DEFAULT_BASE, "outbox"),
  workdir: process.cwd(),
  // permissionMode not set by default — avoids CLI beta header issues
  maxBudgetPerTask: 1.0,
  maxConcurrency: 1,
  logFile: join(DEFAULT_BASE, "sentinel.log"),
  notify: {
    file: true,
    stdout: true,
  },
};

/**
 * Load config from (in priority order):
 *   1. Explicit path via --config flag
 *   2. ./sentinel.yaml in current directory
 *   3. ~/.sentinel/config.yaml
 *   4. Defaults
 */
export async function loadConfig(
  explicitPath?: string,
): Promise<SentinelConfig> {
  const candidates = [
    explicitPath,
    resolve("sentinel.yaml"),
    resolve("sentinel.yml"),
    join(DEFAULT_BASE, "config.yaml"),
    join(DEFAULT_BASE, "config.yml"),
  ].filter(Boolean) as string[];

  for (const path of candidates) {
    try {
      const raw = await readFile(path, "utf-8");
      const parsed = parseYaml(raw) as Partial<SentinelConfig>;
      return mergeConfig(DEFAULTS, parsed);
    } catch {
      // File doesn't exist or isn't valid YAML — try next
    }
  }

  // No config found — use defaults
  return { ...DEFAULTS };
}

function mergeConfig(
  defaults: SentinelConfig,
  overrides: Partial<SentinelConfig>,
): SentinelConfig {
  return {
    ...defaults,
    ...overrides,
    notify: {
      ...defaults.notify,
      ...overrides.notify,
    },
  };
}
