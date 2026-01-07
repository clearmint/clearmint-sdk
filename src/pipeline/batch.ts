import { type MintQueue } from './queue.js'
import { type QueueItem } from './types.js'

export function createBatch (queue: MintQueue, maxSize = 10): QueueItem[] {
  const all = queue.getAll()
  const batch = all.filter((i) => i.status === 'queued').slice(0, maxSize)
  return batch
}
