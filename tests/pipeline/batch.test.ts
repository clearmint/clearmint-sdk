import { describe, it, expect } from 'vitest';
import { MintQueue } from '../../src/pipeline/queue';
import { createBatch } from '../../src/pipeline/batch';

describe('createBatch', () => {
  it('returns up to maxSize queued items', () => {
    const q = new MintQueue();
    for (let i = 0; i < 5; i++) q.enqueue({ name: `T${i}`, symbol: `T${i}`, decimals: 0, totalSupply: 1n, mintAuthority: { toBase58: () => '' } as any, immutable: true } as any);
    const batch = createBatch(q, 3);
    expect(batch.length).toBe(3);
  });
});