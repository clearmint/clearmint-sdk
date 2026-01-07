import { type MintParams } from '../types.js'

export type QueueItemId = string

export type QueueStatus = 'queued' | 'processing' | 'completed' | 'failed'

export interface QueueItem {
  id: QueueItemId
  params: MintParams
  attempts: number
  status: QueueStatus
  error?: string
}
