import { type PublicKey, type Commitment, type Transaction } from '@solana/web3.js'

export type CommitmentType = Commitment

export interface MintParams {
  name: string
  symbol: string
  decimals: number
  totalSupply: bigint
  mintAuthority: PublicKey
  freezeAuthority?: PublicKey
  immutable: boolean
}

export interface MintPreview {
  estimatedMintAddress: PublicKey
  totalSupply: bigint
  decimals: number
  instructionsCount: number
  estimatedFeeLamports: number
}

export interface CreateMintResult {
  mintAddress: PublicKey
  transactionSignature: string
}

export type SignAndSendTransactionFn = (tx: Transaction) => Promise<string>
