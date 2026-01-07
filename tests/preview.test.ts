import { describe, it, expect } from 'vitest';
import { previewMint } from '../src/preview';
import { Keypair } from '@solana/web3.js';

const params = {
  name: 'BatchToken',
  symbol: 'BTK',
  decimals: 2,
  totalSupply: 1000000n,
  mintAuthority: Keypair.generate().publicKey,
  immutable: true
};

describe('previewMint', () => {
  it('produces deterministic preview', () => {
    const p1 = previewMint(params as any);
    const p2 = previewMint(params as any);
    expect(p1.estimatedMintAddress.toBase58()).toBe(p2.estimatedMintAddress.toBase58());
    expect(p1.instructionsCount).toBeGreaterThan(0);
    expect(p1.estimatedFeeLamports).toBeGreaterThan(0);
  });
});