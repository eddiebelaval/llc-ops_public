import fs from 'node:fs';
import path from 'node:path';
import { scanBlock, determineConnectionFlow } from './scanner.js';
import { archiveManifest, listArchive } from './archiver.js';
import { generateTasks } from './tasks.js';
import type { Manifest } from './types.js';

// ─── Terminal colors ───
const C = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  switch (command) {
    case 'scan':
      runScan(args[1]);
      break;
    case 'init':
      runInit(args[1]);
      break;
    case 'status':
      runStatus(args[1]);
      break;
    case 'tasks':
      runTasks(args[1]);
      break;
    case 'history':
      runHistory(args[1]);
      break;
    default:
      printUsage();
  }
}

function resolveManifest(input?: string): string {
  if (input) {
    return path.isAbsolute(input) ? input : path.resolve(process.cwd(), input);
  }
  return path.resolve(process.cwd(), 'codebase-map.json');
}

function readManifest(manifestPath: string): Manifest {
  if (!fs.existsSync(manifestPath)) {
    console.error(`${C.red}Manifest not found:${C.reset} ${manifestPath}`);
    console.error(`Run ${C.cyan}codebase-map init${C.reset} to create one.`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
}

// ─── SCAN ───────────────────────────────────────
function runScan(manifestArg?: string) {
  const startTime = Date.now();
  const manifestPath = resolveManifest(manifestArg);
  const projectRoot = path.dirname(manifestPath);
  const manifest = readManifest(manifestPath);

  console.log();
  console.log(`${C.bold}CODEBASE MAP${C.reset} ${C.dim}-- Heartbeat Scan${C.reset}`);
  console.log(`${C.dim}Project:${C.reset} ${manifest.project.name}`);
  console.log(`${C.dim}Root:${C.reset}    ${projectRoot}`);
  console.log();

  // Archive previous version before modifying
  archiveManifest(manifest, manifestPath);

  // Scan each block
  console.log(`${C.bold}Blocks${C.reset}`);
  let totalChanges = 0;
  const allChanges: string[] = [];

  for (const block of manifest.blocks) {
    const result = scanBlock(
      block,
      projectRoot,
      manifest.blocks,
      manifest.connections
    );

    block.protocol = result.protocol;
    block.phase = result.phase;
    block.status = result.status;

    const statusColor: Record<string, string> = {
      green: C.green,
      yellow: C.yellow,
      red: C.red,
      none: C.dim,
    };
    const color = statusColor[result.status] || C.dim;
    const checks = Object.values(result.protocol).filter(Boolean).length;
    const total = Object.values(result.protocol).length;

    let changeNote = '';
    if (result.changes.length > 0) {
      changeNote = `  ${C.cyan}(${result.changes.join(', ')})${C.reset}`;
      totalChanges += result.changes.length;
      allChanges.push(...result.changes.map(ch => `${block.name}: ${ch}`));
    }

    console.log(
      `  ${block.name.padEnd(24)} ` +
        `${C.dim}[${result.phase.padEnd(8)}]${C.reset} ` +
        `${color}${result.status.padEnd(7)}${C.reset} ` +
        `${checks}/${total}${changeNote}`
    );
  }

  // Update connection flows
  console.log();
  console.log(`${C.bold}Connections${C.reset}`);

  for (const conn of manifest.connections) {
    const prevFlow = conn.flow;
    conn.flow = determineConnectionFlow(conn, manifest.blocks);

    const changed =
      prevFlow !== conn.flow
        ? ` ${C.cyan}(was: ${prevFlow})${C.reset}`
        : '';

    const flowColor: Record<string, string> = {
      active: C.green,
      wired: C.yellow,
      planned: C.dim,
    };
    const fc = flowColor[conn.flow] || C.dim;

    console.log(
      `  ${conn.from.padEnd(18)} -> ${conn.to.padEnd(18)} ${fc}${conn.flow}${C.reset}${changed}`
    );
  }

  // Generate tasks from protocol gaps
  manifest.tasks = generateTasks(manifest);
  const openTasks = manifest.tasks.filter(t => t.status === 'open');
  const critical = openTasks.filter(t => t.priority === 'critical').length;
  const high = openTasks.filter(t => t.priority === 'high').length;
  const medium = openTasks.filter(t => t.priority === 'medium').length;
  const low = openTasks.filter(t => t.priority === 'low').length;

  console.log();
  console.log(
    `${C.bold}Tasks:${C.reset} ${openTasks.length} open ` +
      `(${C.red}${critical} critical${C.reset}, ` +
      `${C.yellow}${high} high${C.reset}, ` +
      `${C.cyan}${medium} medium${C.reset}, ` +
      `${C.dim}${low} low${C.reset})`
  );

  // Update heartbeat metadata
  const duration = Date.now() - startTime;
  const prevVersion = manifest.heartbeat?.version || 0;

  manifest.heartbeat = {
    lastScan: new Date().toISOString(),
    version: prevVersion + 1,
    scanDurationMs: duration,
    blocksChanged: totalChanges,
  };

  // Write updated manifest
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log();
  console.log(
    `${C.green}Manifest updated${C.reset} ` +
      `${C.dim}(v${manifest.heartbeat.version}, ${duration}ms, ${totalChanges} changes)${C.reset}`
  );
  console.log();
}

// ─── INIT ───────────────────────────────────────
function runInit(rootArg?: string) {
  const projectRoot = rootArg
    ? path.resolve(process.cwd(), rootArg)
    : process.cwd();
  const manifestPath = path.join(projectRoot, 'codebase-map.json');

  if (fs.existsSync(manifestPath)) {
    console.error(`${C.yellow}Manifest already exists at ${manifestPath}${C.reset}`);
    process.exit(1);
  }

  // Detect project name
  let projectName = path.basename(projectRoot);
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8')
    );
    projectName = pkg.name || projectName;
  } catch {
    // No package.json, use directory name
  }

  const template: Manifest = {
    version: '1.0',
    project: {
      name: projectName,
      description: '',
      repo: projectRoot,
    },
    protocol: {
      steps: ['created', 'wired', 'integrated', 'tested', 'documented'],
      labels: {
        created: 'File / component exists',
        wired: 'Connected to consumers',
        integrated: 'Data flows end-to-end',
        tested: 'Tests passing',
        documented: 'Docs written',
      },
    },
    layers: [
      { id: 'frontend', label: 'Frontend', accent: '#4ecdc4' },
      { id: 'backend', label: 'Backend', accent: '#ef6f2e' },
      { id: 'database', label: 'Database', accent: '#f59e0b' },
      { id: 'integration', label: 'External', accent: '#8b5cf6' },
    ],
    blocks: [],
    connections: [],
    heartbeat: {
      lastScan: new Date().toISOString(),
      version: 0,
      scanDurationMs: 0,
      blocksChanged: 0,
    },
    tasks: [],
  };

  fs.writeFileSync(manifestPath, JSON.stringify(template, null, 2));

  console.log();
  console.log(`${C.green}Created${C.reset} ${manifestPath}`);
  console.log();
  console.log('Next steps:');
  console.log(`  1. Add blocks to ${C.cyan}codebase-map.json${C.reset}`);
  console.log(`  2. Add connections between blocks`);
  console.log(`  3. Run ${C.cyan}codebase-map scan${C.reset} to check codebase state`);
  console.log();
}

// ─── STATUS ─────────────────────────────────────
function runStatus(manifestArg?: string) {
  const manifestPath = resolveManifest(manifestArg);
  const manifest = readManifest(manifestPath);

  const blocks = manifest.blocks;
  const green = blocks.filter(b => b.status === 'green').length;
  const yellow = blocks.filter(b => b.status === 'yellow').length;
  const red = blocks.filter(b => b.status === 'red').length;
  const planned = blocks.filter(b => b.status === 'none').length;

  console.log();
  console.log(`${C.bold}${manifest.project.name}${C.reset} ${C.dim}-- Codebase Map${C.reset}`);
  console.log();
  console.log(
    `  ${C.green}${green} green${C.reset}  ` +
      `${C.yellow}${yellow} yellow${C.reset}  ` +
      `${C.red}${red} red${C.reset}  ` +
      `${C.dim}${planned} planned${C.reset}  ` +
      `(${blocks.length} total)`
  );

  if (manifest.heartbeat) {
    const ago = timeSince(manifest.heartbeat.lastScan);
    console.log(`  Last scan: ${ago} (v${manifest.heartbeat.version})`);
  }

  const openTasks = (manifest.tasks || []).filter(t => t.status === 'open');
  if (openTasks.length > 0) {
    console.log(`  Open tasks: ${openTasks.length}`);
  }
  console.log();
}

// ─── TASKS ──────────────────────────────────────
function runTasks(manifestArg?: string) {
  const manifestPath = resolveManifest(manifestArg);
  const manifest = readManifest(manifestPath);
  const tasks = (manifest.tasks || []).filter(t => t.status === 'open');

  if (tasks.length === 0) {
    console.log(`\n${C.green}No open tasks.${C.reset}\n`);
    return;
  }

  console.log(`\n${C.bold}Open Tasks (${tasks.length})${C.reset}\n`);

  const groups: Record<string, typeof tasks> = {
    critical: [],
    high: [],
    medium: [],
    low: [],
  };

  for (const t of tasks) {
    groups[t.priority] = groups[t.priority] || [];
    groups[t.priority].push(t);
  }

  const colors: Record<string, string> = {
    critical: C.red,
    high: C.yellow,
    medium: C.cyan,
    low: C.dim,
  };

  for (const [pri, items] of Object.entries(groups)) {
    if (items.length === 0) continue;
    const color = colors[pri] || C.dim;
    console.log(`${color}${pri.toUpperCase()}${C.reset}`);
    for (const t of items) {
      console.log(`  ${t.title} ${C.dim}(${t.block})${C.reset}`);
    }
    console.log();
  }
}

// ─── HISTORY ────────────────────────────────────
function runHistory(manifestArg?: string) {
  const manifestPath = resolveManifest(manifestArg);
  const archive = listArchive(manifestPath);

  if (archive.length === 0) {
    console.log(`\n${C.dim}No archive history yet. Run a scan first.${C.reset}\n`);
    return;
  }

  console.log(`\n${C.bold}Version History${C.reset}\n`);

  for (const snap of archive) {
    const s = snap.stats;
    console.log(
      `  ${C.bold}v${snap.version}${C.reset} ${C.dim}${snap.timestamp}${C.reset}`
    );
    console.log(
      `     ${C.green}${s.green} green${C.reset}  ` +
        `${C.yellow}${s.yellow} yellow${C.reset}  ` +
        `${C.red}${s.red} red${C.reset}  ` +
        `${C.dim}${s.planned} planned${C.reset}  ` +
        `(${s.totalBlocks} total)`
    );
  }
  console.log();
}

// ─── HELPERS ────────────────────────────────────
function timeSince(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function printUsage() {
  console.log(`
${C.bold}codebase-map${C.reset} -- Living architecture dashboard

${C.bold}Commands:${C.reset}
  scan [path]     Scan codebase and update manifest
  init [path]     Create a new manifest for a project
  status [path]   Quick status summary
  tasks [path]    Show open tasks by priority
  history [path]  Show version archive

${C.bold}Examples:${C.reset}
  codebase-map init                   Create manifest in current directory
  codebase-map scan                   Scan and update
  codebase-map scan ./my-project/codebase-map.json
  codebase-map tasks                  Show what needs doing
`);
}

main();
