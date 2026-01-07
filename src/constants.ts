import { PublicKey } from '@solana/web3.js'

export const DEFAULT_RPC = 'https://api.devnet.solana.com'
export const SDK_SEED = 'clearmint-sdk'
export const ZERO_PUBLIC_KEY = new PublicKey('11111111111111111111111111111111')
export const ESTIMATED_INSTRUCTIONS_COUNT = 2 // create account + initialize mint
export const ESTIMATED_FEE_LAMPORTS = 5000
