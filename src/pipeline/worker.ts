import { type MintQueue } from './queue.js'

export class MintWorker {
  constructor (private readonly queue: MintQueue, private readonly execute: (params: any) => Promise<void>, private readonly maxAttempts = 3) {}

  async processNext (): Promise<void> {
    const item = this.queue.dequeue()
    if (item == null) return

    this.queue.markProcessing(item.id)

    try {
      await this.execute(item.params)
      this.queue.markCompleted(item.id)
    } catch (err) {
      if (item.attempts >= this.maxAttempts) {
        this.queue.markFailed(item.id, (err as Error).message)
      } else {
        // leave it queued to be retried - we use attempts count to cap retries
        item.status = 'queued'
      }
    }
  }
}
