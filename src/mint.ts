import {
  Transaction,
  SystemProgram,
  type Connection,
  PublicKey
} from '@solana/web3.js'
import { createInitializeMintInstruction, MINT_SIZE } from '@solana/spl-token'
import type { MintParams, CreateMintResult, SignAndSendTransactionFn } from './types.js'
import { InstructionBuildError, TransactionSendError, RpcConnectionError } from './errors.js'
import { validateMintParams } from './validation.js'

export async function buildMintTransaction (
  connection: Connection,
  payer: PublicKey,
  params: MintParams
): Promise<{ tx: Transaction, mintAddress: PublicKey }> {
  validateMintParams(params)

  try {
    // Derive a deterministic address for the mint using createWithSeed (base = payer)
    const seed = ['clearmint', params.name, params.symbol, params.totalSupply.toString()].join('-')
    const { TOKEN_PROGRAM_ID } = await import('@solana/spl-token')
    const mintPubkey = await PublicKey.createWithSeed(payer, seed.slice(0, 32), TOKEN_PROGRAM_ID)

    const rent = await connection.getMinimumBalanceForRentExemption(MINT_SIZE)

    const tx = new Transaction()

    tx.add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: payer,
        basePubkey: payer,
        newAccountPubkey: mintPubkey,
        seed: seed.slice(0, 32),
        lamports: rent,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID
      })
    )

    tx.add(
      createInitializeMintInstruction(
        mintPubkey,
        params.decimals,
        params.mintAuthority,
        params.immutable ? null : params.freezeAuthority ?? null,
        TOKEN_PROGRAM_ID
      )
    )

    return { tx, mintAddress: mintPubkey }
  } catch (err) {
    const msg = (err as any)?.message
    if (typeof msg === 'string' && msg.includes('connection')) {
      throw new RpcConnectionError(msg)
    }
    throw new InstructionBuildError(msg ?? 'Instruction build failed')
  }
}

export async function createMint (
  params: MintParams,
  context: { payer: PublicKey, signAndSendTransaction: SignAndSendTransactionFn },
  connection: Connection
): Promise<CreateMintResult> {
  const { tx, mintAddress } = await buildMintTransaction(connection, context.payer, params)

  try {
    const signature = await context.signAndSendTransaction(tx)
    return { mintAddress, transactionSignature: signature }
  } catch (err) {
    throw new TransactionSendError((err as Error).message)
  }
}
