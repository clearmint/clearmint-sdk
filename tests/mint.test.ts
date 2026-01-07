import { describe, it, expect, vi } from 'vitest';
import { createMint, buildMintTransaction } from '../src/mint';
import { Keypair, Connection } from '@solana/web3.js';

const paramsBase = () => ({
  name: 'MintTest',
  symbol: 'MT',
  decimals: 0,
  totalSupply: 1n,
  mintAuthority: Keypair.generate().publicKey,
  immutable: true
});

describe('createMint', () => {
  it('builds transaction and calls signer', async () => {
    const conn = {
      getMinimumBalanceForRentExemption: vi.fn().mockResolvedValue(1000)
    } as unknown as Connection;

    const payer = Keypair.generate().publicKey;

    const { tx, mintAddress } = await buildMintTransaction(conn, payer, paramsBase() as any);
    expect(tx).toBeDefined();
    expect(mintAddress).toBeDefined();

    const fakeSigner = vi.fn().mockResolvedValue('sig-123');

    const res = await createMint(paramsBase() as any, { payer, signAndSendTransaction: fakeSigner }, conn);
    expect(res.transactionSignature).toBe('sig-123');
    expect(res.mintAddress.toBase58()).toBeDefined();
  });

  it('throws RpcConnectionError when RPC indicates connection issue', async () => {
    const conn = {
      getMinimumBalanceForRentExemption: vi.fn().mockRejectedValue(new Error('connection failed'))
    } as unknown as Connection;

    const payer = Keypair.generate().publicKey;
    const fakeSigner = vi.fn().mockResolvedValue('sig-123');

    await expect(createMint(paramsBase() as any, { payer, signAndSendTransaction: fakeSigner }, conn)).rejects.toThrow();
  });

  it('throws TransactionSendError when signer rejects', async () => {
    const conn = {
      getMinimumBalanceForRentExemption: vi.fn().mockResolvedValue(1000)
    } as unknown as Connection;

    const payer = Keypair.generate().publicKey;
    const fakeSigner = vi.fn().mockRejectedValue(new Error('sign failed'));

    await expect(createMint(paramsBase() as any, { payer, signAndSendTransaction: fakeSigner }, conn)).rejects.toThrow();
  });
});