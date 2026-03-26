import type { Block, Manifest, Priority, ProtocolState, Task } from './types.js';

export function generateTasks(manifest: Manifest): Task[] {
  const existing = manifest.tasks || [];
  const existingIds = new Set(existing.map(t => t.id));
  const result: Task[] = [...existing];

  for (const block of manifest.blocks) {
    for (const step of manifest.protocol.steps) {
      const key = step as keyof ProtocolState;
      const taskId = `${block.id}--${step}`;

      if (!block.protocol[key]) {
        // Protocol step is incomplete — ensure a task exists
        if (!existingIds.has(taskId)) {
          result.push({
            id: taskId,
            priority: inferPriority(step, block),
            title: `${manifest.protocol.labels[step]} for ${block.name}`,
            block: block.id,
            source: 'protocol',
            status: 'open',
            createdAt: new Date().toISOString(),
          });
          existingIds.add(taskId);
        }
      } else {
        // Protocol step is now complete — archive the task if it exists
        const idx = result.findIndex(t => t.id === taskId && t.status === 'open');
        if (idx !== -1) {
          result[idx].status = 'archived';
        }
      }
    }
  }

  return result;
}

function inferPriority(step: string, block: Block): Priority {
  // Wiring a block that exists but isn't connected is critical
  if (step === 'wired' && block.protocol.created) return 'critical';

  // Integration is high priority once wired
  if (step === 'integrated' && block.protocol.wired) return 'high';

  // Creating a planned block is high priority
  if (step === 'created') return 'high';

  // Testing is medium
  if (step === 'tested') return 'medium';

  // Documentation is low
  if (step === 'documented') return 'low';

  return 'medium';
}
