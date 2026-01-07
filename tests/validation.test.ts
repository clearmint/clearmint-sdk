import { describe, it, expect } from 'vitest';
import { validateMintParams } from '../src/validation';
import { MintParams } from '../src/types';
import { InvalidMintParamsError } from '../src/errors';
import { Keypair } from '@solana/web3.js';

const baseParams = (overrides?: Partial<MintParams>): MintParams => ({
  name: 'TokenName',
  symbol: 'TN',
  decimals: 2,
  totalSupply: 1000n,
  mintAuthority: Keypair.generate().publicKey,
  immutable: false,
  ...overrides
});

describe('validateMintParams', () => {
  it('accepts valid params', () => {
    expect(() => validateMintParams(baseParams())).not.toThrow();
  });

  it('rejects long name', () => {
    expect(() => validateMintParams(baseParams({ name: 'x'.repeat(33) }))).toThrow(InvalidMintParamsError);
  });

  it('rejects long symbol', () => {
    expect(() => validateMintParams(baseParams({ symbol: 'x'.repeat(11) }))).toThrow(InvalidMintParamsError);
  });

  it('rejects invalid decimals', () => {
    expect(() => validateMintParams(baseParams({ decimals: 10 }))).toThrow(InvalidMintParamsError);
  });

  it('rejects totalSupply <= 0', () => {
    expect(() => validateMintParams(baseParams({ totalSupply: 0n }))).toThrow(InvalidMintParamsError);
  });
});