import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { execFile } from "node:child_process";
import { access, stat } from "node:fs/promises";
import path from "node:path";

// AirDrop Control Center checkbox positions (macOS Sequoia+)
// These are positional — fragile but the only option since
// Control Center doesn't expose accessible labels.
const AIRDROP_CB = {
  CONTACTS_ONLY: 1,
  EVERYONE: 2,
  OFF: 3,
} as const;

type ExecResult = { stdout: string; stderr: string; code: number };

function runCommand(cmd: string, args: string[], timeoutMs = 10_000): Promise<ExecResult> {
  return new Promise((resolve) => {
    const child = execFile(cmd, args, { timeout: timeoutMs }, (err, stdout, stderr) => {
      resolve({
        stdout: stdout?.toString() ?? "",
        stderr: stderr?.toString() ?? "",
        code: err ? (err as NodeJS.ErrnoException & { code?: number }).code ?? 1 : 0,
      });
    });
    child.on("error", () => {
      resolve({ stdout: "", stderr: "command failed", code: 1 });
    });
  });
}

function runOsascript(script: string, timeoutMs = 15_000): Promise<ExecResult> {
  return runCommand("/usr/bin/osascript", ["-e", script], timeoutMs);
}

async function getAirDropStatus(): Promise<{ enabled: boolean; mode: string }> {
  // Open AirDrop panel, read checkbox values, close
  const result = await runOsascript(`
    tell application "System Events"
      tell process "ControlCenter"
        click (first menu bar item of menu bar 1 whose description is "AirDrop")
        delay 1.5

        tell group 1 of window "Control Center"
          set cb1 to value of checkbox 1
          set cb2 to value of checkbox 2
          set cb3 to value of checkbox 3
        end tell

        key code 53
        return (cb1 as string) & "," & (cb2 as string) & "," & (cb3 as string)
      end tell
    end tell
  `);

  if (result.code !== 0 || !result.stdout.trim()) {
    return { enabled: false, mode: "unknown" };
  }

  const vals = result.stdout.trim().split(",").map(Number);
  const [contacts, everyone, off] = vals;

  if (off === 1) {
    return { enabled: false, mode: "off" };
  }
  if (everyone === 1) {
    return { enabled: true, mode: "everyone" };
  }
  if (contacts === 1) {
    return { enabled: true, mode: "contacts-only" };
  }
  return { enabled: true, mode: "unknown" };
}

async function clickAirDropCheckbox(position: number): Promise<boolean> {
  const result = await runOsascript(`
    tell application "System Events"
      tell process "ControlCenter"
        click (first menu bar item of menu bar 1 whose description is "AirDrop")
        delay 1.5

        tell group 1 of window "Control Center"
          click checkbox ${position}
        end tell

        delay 0.5
        key code 53
      end tell
    end tell
  `);
  return result.code === 0;
}

async function sendFileViaAirDrop(filePath: string): Promise<{ ok: boolean; error?: string }> {
  // Verify file exists
  try {
    await access(filePath);
  } catch {
    return { ok: false, error: `File not found: ${filePath}` };
  }

  const resolvedPath = path.resolve(filePath);
  const fileInfo = await stat(resolvedPath);
  const sizeMB = (fileInfo.size / (1024 * 1024)).toFixed(1);

  // Use NSSharingService to open AirDrop picker
  const result = await runOsascript(`
    use framework "AppKit"
    use framework "Foundation"
    use scripting additions

    set airdropService to current application's NSSharingService's sharingServiceNamed:"com.apple.share.AirDrop.send"
    if airdropService is missing value then
      return "error:AirDrop service unavailable"
    end if

    set theFile to current application's NSURL's fileURLWithPath:"${resolvedPath}"
    set itemList to current application's NSArray's arrayWithObject:theFile

    airdropService's performWithItems:itemList
    delay 2
    return "ok:picker opened"
  `, 20_000);

  if (result.stdout.trim().startsWith("error:")) {
    return { ok: false, error: result.stdout.trim().replace("error:", "") };
  }
  if (result.code !== 0) {
    return { ok: false, error: result.stderr.trim() || "Failed to open AirDrop" };
  }

  return { ok: true };
}

async function discoverAirDropDevices(): Promise<string[]> {
  // Use dns-sd to find AirDrop-capable devices on the network
  // AirDrop uses _airdrop._tcp but also BLE — dns-sd only catches
  // devices actively advertising via Bonjour
  const result = await runCommand("/usr/bin/dns-sd", ["-B", "_airdrop._tcp", "."], 5_000);

  // dns-sd is killed after timeout, output is in stderr
  const output = result.stdout + result.stderr;
  const devices: Set<string> = new Set();

  for (const line of output.split("\n")) {
    if (!line.includes("Add")) continue;
    // Instance name starts after the service type column
    const match = line.match(/_airdrop\._tcp\.\s+(.+)$/);
    if (match?.[1]) {
      devices.add(match[1].trim());
    }
  }

  return [...devices].sort();
}

function formatHelp(): string {
  return [
    "AirDrop commands:",
    "",
    "/airdrop status        Check AirDrop state",
    "/airdrop on            Enable (Contacts Only)",
    "/airdrop everyone      Enable for Everyone",
    "/airdrop off           Disable receiving",
    "/airdrop send <path>   Send file (opens picker on Mac)",
    "/airdrop discover      Find nearby AirDrop devices",
  ].join("\n");
}

function formatMode(mode: string): string {
  switch (mode) {
    case "contacts-only":
      return "Contacts Only";
    case "everyone":
      return "Everyone";
    case "off":
      return "Off";
    default:
      return mode;
  }
}

export default function register(api: OpenClawPluginApi) {
  api.registerCommand({
    name: "airdrop",
    description: "Control AirDrop on this Mac (toggle, send files, discover devices).",
    acceptsArgs: true,
    handler: async (ctx) => {
      const args = ctx.args?.trim() ?? "";
      const tokens = args.split(/\s+/).filter(Boolean);
      const action = tokens[0]?.toLowerCase() ?? "";

      api.logger.info?.(`airdrop: /airdrop invoked action=${action || "help"}`);

      if (!action || action === "help") {
        const status = await getAirDropStatus();
        return {
          text: `AirDrop: ${formatMode(status.mode)}\n\n${formatHelp()}`,
        };
      }

      if (action === "status") {
        const status = await getAirDropStatus();
        return {
          text: `AirDrop: ${formatMode(status.mode)}`,
        };
      }

      if (action === "on" || action === "contacts") {
        const clicked = await clickAirDropCheckbox(AIRDROP_CB.CONTACTS_ONLY);
        if (!clicked) {
          return { text: "Failed to toggle AirDrop. Check Accessibility permissions." };
        }
        api.logger.info?.("airdrop: set to Contacts Only");
        return { text: "AirDrop: Contacts Only" };
      }

      if (action === "everyone" || action === "all") {
        const clicked = await clickAirDropCheckbox(AIRDROP_CB.EVERYONE);
        if (!clicked) {
          return { text: "Failed to toggle AirDrop. Check Accessibility permissions." };
        }
        api.logger.info?.("airdrop: set to Everyone");
        return { text: "AirDrop: Everyone (10 minutes)" };
      }

      if (action === "off" || action === "disable") {
        const clicked = await clickAirDropCheckbox(AIRDROP_CB.OFF);
        if (!clicked) {
          return { text: "Failed to toggle AirDrop. Check Accessibility permissions." };
        }
        api.logger.info?.("airdrop: disabled");
        return { text: "AirDrop: Off" };
      }

      if (action === "send") {
        const filePath = tokens.slice(1).join(" ");
        if (!filePath) {
          return { text: "Usage: /airdrop send <file-path>" };
        }
        const result = await sendFileViaAirDrop(filePath);
        if (!result.ok) {
          return { text: `AirDrop send failed: ${result.error}` };
        }
        const fileName = path.basename(filePath);
        api.logger.info?.(`airdrop: send initiated for ${fileName}`);
        return {
          text: `AirDrop picker opened for: ${fileName}\nSelect a recipient on the Mac to complete the transfer.`,
        };
      }

      if (action === "discover" || action === "scan" || action === "list") {
        const devices = await discoverAirDropDevices();
        if (devices.length === 0) {
          return {
            text: "No AirDrop devices found via Bonjour.\nNote: AirDrop primarily uses BLE + Wi-Fi Direct, so nearby devices may not appear in network scans. Open Finder > AirDrop on the Mac to see the full list.",
          };
        }
        const list = devices.map((d, i) => `  ${i + 1}. ${d}`).join("\n");
        return {
          text: `AirDrop devices (Bonjour):\n${list}\n\nNote: This shows network-advertised devices. For the full list, open Finder > AirDrop.`,
        };
      }

      return { text: formatHelp() };
    },
  });
}
