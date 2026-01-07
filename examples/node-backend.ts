import { ClearMintClient } from '../dist/index.mjs';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';

async function main() {
  const client = new ClearMintClient();

  const payer = Keypair.generate();

  const params = {
    name: 'InfraToken',
    symbol: 'INFRA',
    decimals: 2,
    totalSupply: 1000000n,
    mintAuthority: payer.publicKey,
    immutable: true
  } as const;

  try {
    const preview = client.previewMint(params as any);
    console.log('Preview mint address:', preview.estimatedMintAddress.toBase58());

    // Example signAndSendTransaction implementation that sends to a remote signer
    const signAndSendTransaction = async (tx: Transaction): Promise<string> => {
      // Implementation depends on your signing boundary: offline-signer, KMS call etc.
      // This example rejects because this code runs in examples only.
      throw new Error('Example signAndSendTransaction should be implemented in your backend');
    };

    // Create mint would normally be called with a real signer and payer
    // const result = await client.createMint(params as any, { payer: payer.publicKey, signAndSendTransaction });
    // console.log('Created mint:', result.mintAddress.toBase58(), 'sig:', result.transactionSignature);
  } catch (err) {
    console.error('Error creating mint:', err);
  }
}

main();