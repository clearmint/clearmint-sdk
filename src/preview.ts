import { PublicKey } from '@solana/web3.js'
import { type MintParams, type MintPreview } from './types.js'
import { SDK_SEED, ESTIMATED_INSTRUCTIONS_COUNT, ESTIMATED_FEE_LAMPORTS } from './constants.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

export function previewMint (params: MintParams): MintPreview {
  // Deterministic address using PDA with well-known program id (token program)
  const seeds: Uint8Array[] = [
    Buffer.from(SDK_SEED, 'utf8'),
    Buffer.from(params.name, 'utf8'),
    Buffer.from(params.symbol, 'utf8'),
    Buffer.from(params.totalSupply.toString(), 'utf8')
  ]

  // Use the token program as the deterministic program id for address derivation
  const [pda] = PublicKey.findProgramAddressSync(seeds, TOKEN_PROGRAM_ID)

  const preview: MintPreview = {
    estimatedMintAddress: pda,
    totalSupply: params.totalSupply,
    decimals: params.decimals,
    instructionsCount: ESTIMATED_INSTRUCTIONS_COUNT,
    estimatedFeeLamports: ESTIMATED_FEE_LAMPORTS
  }

  return preview
}
