import { describe, it, expect, vi } from 'vitest'
import { ClearMintClient } from '../src/client'
import { previewMint } from '../src/preview'
import { Keypair, Connection } from '@solana/web3.js'

const params = {
  name: 'ClientToken',
  symbol: 'CT',
  decimals: 2,
  totalSupply: 1000n,
  mintAuthority: Keypair.generate().publicKey,
  immutable: true
} as any

describe('ClearMintClient', () => {
  it('previewMint delegates and returns deterministic preview', () => {
    const c = new ClearMintClient()
    const p1 = c.previewMint(params)
    const p2 = previewMint(params)
    expect(p1.estimatedMintAddress.toBase58()).toBe(p2.estimatedMintAddress.toBase58())
  })

  it('createMint uses injected signer and returns result', async () => {
    const c = new ClearMintClient()

    // override internal connection with a mock
    ;(c as any).connection = { getMinimumBalanceForRentExemption: vi.fn().mockResolvedValue(1000) } as unknown as Connection

    const payer = Keypair.generate().publicKey
    const fakeSigner = vi.fn().mockResolvedValue('sig-xyz')

    const res = await c.createMint(params, { payer, signAndSendTransaction: fakeSigner })
    expect(res.transactionSignature).toBe('sig-xyz')
  })

  it('createMint surfaces signer errors', async () => {
    const c = new ClearMintClient()
    ;(c as any).connection = { getMinimumBalanceForRentExemption: vi.fn().mockResolvedValue(1000) } as unknown as Connection

    const payer = Keypair.generate().publicKey
    const fakeSigner = vi.fn().mockRejectedValue(new Error('signer failed'))

    await expect(c.createMint(params, { payer, signAndSendTransaction: fakeSigner })).rejects.toThrow()
  })
})
