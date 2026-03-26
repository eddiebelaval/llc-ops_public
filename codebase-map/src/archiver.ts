import fs from 'node:fs';
import path from 'node:path';
import type { Manifest, VersionSnapshot } from './types.js';

export function archiveManifest(
  manifest: Manifest,
  manifestPath: string
): VersionSnapshot | null {
  const version = manifest.heartbeat?.version || 0;
  if (version === 0) return null;

  const archiveDir = path.join(
    path.dirname(manifestPath),
    '.codebase-map',
    'archive'
  );
  fs.mkdirSync(archiveDir, { recursive: true });

  const snapshot: VersionSnapshot = {
    version,
    timestamp: manifest.heartbeat?.lastScan || new Date().toISOString(),
    stats: {
      totalBlocks: manifest.blocks.length,
      green: manifest.blocks.filter(b => b.status === 'green').length,
      yellow: manifest.blocks.filter(b => b.status === 'yellow').length,
      red: manifest.blocks.filter(b => b.status === 'red').length,
      planned: manifest.blocks.filter(b => b.status === 'none').length,
    },
    changes: [],
  };

  const snapshotPath = path.join(archiveDir, `v${version}.json`);
  fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));

  return snapshot;
}

export function listArchive(manifestPath: string): VersionSnapshot[] {
  const archiveDir = path.join(
    path.dirname(manifestPath),
    '.codebase-map',
    'archive'
  );

  try {
    const files = fs
      .readdirSync(archiveDir)
      .filter(f => f.startsWith('v') && f.endsWith('.json'))
      .sort((a, b) => {
        const numA = parseInt(a.replace('v', '').replace('.json', ''), 10);
        const numB = parseInt(b.replace('v', '').replace('.json', ''), 10);
        return numA - numB;
      });

    return files.map(f =>
      JSON.parse(fs.readFileSync(path.join(archiveDir, f), 'utf-8'))
    );
  } catch {
    return [];
  }
}
