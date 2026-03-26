export interface Manifest {
  version: string;
  project: {
    name: string;
    description: string;
    repo: string;
  };
  protocol: {
    steps: string[];
    labels: Record<string, string>;
  };
  layers: Layer[];
  blocks: Block[];
  connections: Connection[];
  heartbeat?: HeartbeatMeta;
  tasks?: Task[];
  assessments?: Assessment[];
}

export interface Layer {
  id: string;
  label: string;
  accent: string;
}

export interface Block {
  id: string;
  name: string;
  layer: string;
  phase: Phase;
  status: Status;
  x: number;
  y: number;
  files: string[];
  protocol: ProtocolState;
}

export interface ProtocolState {
  created: boolean;
  wired: boolean;
  integrated: boolean;
  tested: boolean;
  documented: boolean;
}

export interface Connection {
  from: string;
  to: string;
  type: ConnectionType;
  flow: Flow;
}

export type Phase = 'planned' | 'building' | 'built';
export type Status = 'none' | 'red' | 'yellow' | 'green';
export type Flow = 'planned' | 'wired' | 'active';
export type ConnectionType = 'navigation' | 'api' | 'data' | 'infra' | 'component';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  priority: Priority;
  title: string;
  block: string;
  source: 'protocol' | 'assessment' | 'manual';
  status: 'open' | 'archived';
  createdAt: string;
}

export interface Assessment {
  id: string;
  severity: Priority;
  block: string;
  title: string;
  desc: string;
  prompt: string;
  status: 'open' | 'dismissed';
}

export interface HeartbeatMeta {
  lastScan: string;
  version: number;
  scanDurationMs: number;
  blocksChanged: number;
}

export interface VersionSnapshot {
  version: number;
  timestamp: string;
  stats: {
    totalBlocks: number;
    green: number;
    yellow: number;
    red: number;
    planned: number;
  };
  changes: string[];
}
