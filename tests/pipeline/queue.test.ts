import { describe, it, expect } from 'vitest';
import { MintQueue } from '../../src/pipeline/queue';

describe('MintQueue', () => {
  it('enqueue and getStatus', () => {
    const q = new MintQueue();
    const id1 = q.enqueue({ name: 'A', symbol: 'A', decimals: 0, totalSupply: 1n, mintAuthority: { toBase58: () => '' } as any, immutable: true } as any);
    const id2 = q.enqueue({ name: 'B', symbol: 'B', decimals: 0, totalSupply: 1n, mintAuthority: { toBase58: () => '' } as any, immutable: true } as any);
    expect(q.getStatus(id1)).toBe('queued');
    expect(q.getStatus(id2)).toBe('queued');
  });
});