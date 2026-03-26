import fs from 'node:fs';
import path from 'node:path';
import type { Block, Connection, Flow, Phase, ProtocolState, Status } from './types.js';

export interface ScanResult {
  blockId: string;
  protocol: ProtocolState;
  phase: Phase;
  status: Status;
  changes: string[];
}

export function scanBlock(
  block: Block,
  projectRoot: string,
  allBlocks: Block[],
  connections: Connection[]
): ScanResult {
  const changes: string[] = [];
  const prev = { ...block.protocol };

  const created = checkCreated(block.files, projectRoot);
  const wired = created && checkWired(block, projectRoot, allBlocks, connections);
  const integrated = wired && checkIntegrated(block, projectRoot, allBlocks, connections);
  const tested = created && checkTested(block, projectRoot);
  const documented = created && checkDocumented(block, projectRoot);

  const protocol: ProtocolState = { created, wired, integrated, tested, documented };

  for (const key of Object.keys(protocol) as (keyof ProtocolState)[]) {
    if (protocol[key] !== prev[key]) {
      changes.push(`${key}: ${prev[key]} -> ${protocol[key]}`);
    }
  }

  const phase = derivePhase(protocol);
  const status = deriveStatus(protocol);

  if (phase !== block.phase) changes.push(`phase: ${block.phase} -> ${phase}`);
  if (status !== block.status) changes.push(`status: ${block.status} -> ${status}`);

  return { blockId: block.id, protocol, phase, status, changes };
}

function checkCreated(files: string[], root: string): boolean {
  if (files.length === 0) return false;

  return files.every(f => {
    const full = path.join(root, f);
    try {
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        return fs.readdirSync(full).length > 0;
      }
      return stat.isFile();
    } catch {
      return false;
    }
  });
}

function checkWired(
  block: Block,
  _root: string,
  allBlocks: Block[],
  connections: Connection[]
): boolean {
  const related = connections.filter(c => c.from === block.id || c.to === block.id);
  if (related.length === 0) return true;

  const blockMap = new Map(allBlocks.map(b => [b.id, b]));
  let connectedExists = 0;

  for (const conn of related) {
    const otherId = conn.from === block.id ? conn.to : conn.from;
    const other = blockMap.get(otherId);
    if (!other || other.files.length === 0) continue;

    const exists = other.files.some(f => {
      try {
        fs.statSync(path.join(_root, f));
        return true;
      } catch {
        return false;
      }
    });

    if (exists) connectedExists++;
  }

  return connectedExists > 0;
}

function checkIntegrated(
  block: Block,
  root: string,
  allBlocks: Block[],
  connections: Connection[]
): boolean {
  const related = connections.filter(c => c.from === block.id || c.to === block.id);
  const blockMap = new Map(allBlocks.map(b => [b.id, b]));

  for (const file of block.files) {
    const fullPath = path.join(root, file);
    let content: string;

    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) continue;
      content = fs.readFileSync(fullPath, 'utf-8');
    } catch {
      continue;
    }

    for (const conn of related) {
      const otherId = conn.from === block.id ? conn.to : conn.from;
      const other = blockMap.get(otherId);
      if (!other) continue;

      for (const otherFile of other.files) {
        const otherBase = path.basename(otherFile, path.extname(otherFile));
        const otherDir = path.dirname(otherFile);

        // Check for import/reference patterns
        if (
          content.includes(otherBase) ||
          content.includes(otherDir) ||
          // API route pattern: /api/books -> matches src/app/api/books/route.ts
          (otherFile.includes('/api/') &&
            content.includes(
              otherFile
                .replace(/.*\/api/, '/api')
                .replace(/\/route\.ts$/, '')
                .replace(/\/route\.js$/, '')
            ))
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

function checkTested(block: Block, root: string): boolean {
  for (const file of block.files) {
    const fullPath = path.join(root, file);
    const dir = path.dirname(fullPath);
    const ext = path.extname(file);
    const base = path.basename(file, ext);

    const testPatterns = [
      path.join(dir, `${base}.test${ext}`),
      path.join(dir, `${base}.test.ts`),
      path.join(dir, `${base}.test.tsx`),
      path.join(dir, `${base}.spec${ext}`),
      path.join(dir, `${base}.spec.ts`),
      path.join(dir, '__tests__', `${base}.test.ts`),
      path.join(dir, '__tests__', `${base}.test.tsx`),
    ];

    for (const tp of testPatterns) {
      try {
        if (fs.statSync(tp).isFile()) return true;
      } catch {
        // File doesn't exist, try next pattern
      }
    }
  }

  return false;
}

function checkDocumented(block: Block, root: string): boolean {
  for (const file of block.files) {
    const fullPath = path.join(root, file);

    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (fs.existsSync(path.join(fullPath, 'README.md'))) return true;
        continue;
      }

      const content = fs.readFileSync(fullPath, 'utf-8');
      if (content.includes('/**') && content.includes('*/')) return true;

      const dir = path.dirname(fullPath);
      if (fs.existsSync(path.join(dir, 'README.md'))) return true;
    } catch {
      // Skip files that can't be read
    }
  }

  return false;
}

function derivePhase(protocol: ProtocolState): Phase {
  if (!protocol.created) return 'planned';
  if (protocol.created && protocol.wired && protocol.integrated) return 'built';
  return 'building';
}

function deriveStatus(protocol: ProtocolState): Status {
  if (!protocol.created) return 'none';
  const checks = [
    protocol.created,
    protocol.wired,
    protocol.integrated,
    protocol.tested,
    protocol.documented,
  ];
  const trueCount = checks.filter(Boolean).length;
  if (trueCount >= 4) return 'green';
  if (trueCount >= 2) return 'yellow';
  return 'red';
}

export function determineConnectionFlow(
  conn: Connection,
  blocks: Block[]
): Flow {
  const blockMap = new Map(blocks.map(b => [b.id, b]));
  const from = blockMap.get(conn.from);
  const to = blockMap.get(conn.to);

  if (!from || !to) return 'planned';
  if (from.phase === 'planned' || to.phase === 'planned') return 'planned';
  if (from.protocol.integrated && to.protocol.created) return 'active';
  if (from.protocol.created && to.protocol.created) return 'wired';
  return 'planned';
}
