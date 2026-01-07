import { describe, it, expect, vi } from 'vitest';
import { MintQueue } from '../../src/pipeline/queue';
import { MintWorker } from '../../src/pipeline/worker';

describe('MintWorker', () => {
  it('processes next item and marks completed on success', async () => {
    const q = new MintQueue();
    const id = q.enqueue({ name: 'X', symbol: 'X', decimals: 0, totalSupply: 1n, mintAuthority: { toBase58: () => '' } as any, immutable: true } as any);
    const exec = vi.fn().mockResolvedValue(undefined);
    const w = new MintWorker(q, exec, 3);
    await w.processNext();
    expect(q.getStatus(id)).toBe('completed');
  });

  it('retries on failure and marks failed after max attempts', async () => {
    const q = new MintQueue();
    const id = q.enqueue({ name: 'Y', symbol: 'Y', decimals: 0, totalSupply: 1n, mintAuthority: { toBase58: () => '' } as any, immutable: true } as any);

    const failing = vi.fn().mockRejectedValue(new Error('boom'));
    const w = new MintWorker(q, failing, 2);

    await w.processNext();
    // first attempt -> queued again
    expect(q.getStatus(id)).toBe('queued');

    await w.processNext();
    // second attempt -> should be marked failed
    expect(q.getStatus(id)).toBe('failed');
  });
});