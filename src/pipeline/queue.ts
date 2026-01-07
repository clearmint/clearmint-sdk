import { type QueueItem, type QueueItemId, type QueueStatus } from './types.js'

export class MintQueue {
  private readonly items: QueueItem[] = []
  private counter = 0

  enqueue (params: QueueItem['params']): QueueItemId {
    const id = `${Date.now().toString(36)}-${this.counter++}`
    const item: QueueItem = { id, params, attempts: 0, status: 'queued' }
    this.items.push(item)
    return id
  }

  getStatus (id: QueueItemId): QueueStatus | null {
    const it = this.items.find((i) => i.id === id)
    return (it != null) ? it.status : null
  }

  dequeue (): QueueItem | undefined {
    return this.items.find((i) => i.status === 'queued')
  }

  markProcessing (id: QueueItemId): void {
    const it = this.items.find((i) => i.id === id)
    if (it == null) return
    it.status = 'processing'
    it.attempts += 1
  }

  markCompleted (id: QueueItemId): void {
    const it = this.items.find((i) => i.id === id)
    if (it == null) return
    it.status = 'completed'
  }

  markFailed (id: QueueItemId, err: string): void {
    const it = this.items.find((i) => i.id === id)
    if (it == null) return
    it.status = 'failed'
    it.error = err
  }

  getAll (): QueueItem[] {
    return [...this.items]
  }
}
