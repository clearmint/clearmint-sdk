import { Connection, type Commitment, type PublicKey } from '@solana/web3.js'
import { DEFAULT_RPC } from './constants.js'
import { type MintParams, type MintPreview, type CreateMintResult } from './types.js'
import { previewMint } from './preview.js'
import { createMint as createMintOp } from './mint.js'
import { RpcConnectionError } from './errors.js'

export class ClearMintClient {
  private readonly connection: Connection

  constructor (options?: { rpcUrl?: string, commitment?: Commitment }) {
    const rpc = options?.rpcUrl ?? DEFAULT_RPC
    try {
      this.connection = new Connection(rpc, options?.commitment)
    } catch (err) {
      throw new RpcConnectionError((err as Error).message)
    }
  }

  previewMint (params: MintParams): MintPreview {
    return previewMint(params)
  }

  async createMint (
    params: MintParams,
    context: { payer: PublicKey, signAndSendTransaction: (tx: any) => Promise<string> }
  ): Promise<CreateMintResult> {
    // build the transaction then use the injected signing function
    return await createMintOp(params, context, this.connection)
  }
}
