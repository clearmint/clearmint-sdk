import { type MintParams } from './types.js'
import { InvalidMintParamsError } from './errors.js'

export function validateMintParams (params: MintParams): void {
  if (typeof params.name !== 'string' || params.name.length < 1 || params.name.length > 32) {
    throw new InvalidMintParamsError('`name` must be 1-32 characters')
  }

  if (typeof params.symbol !== 'string' || params.symbol.length < 1 || params.symbol.length > 10) {
    throw new InvalidMintParamsError('`symbol` must be 1-10 characters')
  }

  if (!Number.isInteger(params.decimals) || params.decimals < 0 || params.decimals > 9) {
    throw new InvalidMintParamsError('`decimals` must be integer between 0 and 9')
  }

  if (typeof params.totalSupply !== 'bigint' || params.totalSupply <= 0n) {
    throw new InvalidMintParamsError('`totalSupply` must be bigint > 0')
  }

  // mintAuthority is PublicKey checked via duck-typing (has toBase58)
  // Avoid importing heavy solana types here to remain framework-agnostic in validation.
  if (!('toBase58' in (params.mintAuthority as unknown as object))) {
    throw new InvalidMintParamsError('`mintAuthority` must be a PublicKey')
  }
}
