# Clearmint SDK

Clearmint SDK is a Node.js-only, TypeScript-first SDK for deterministic, infrastructure-grade mint creation on Solana.

---

## Overview ✅

Clearmint SDK provides a minimal, auditable API surface for backend services that need deterministic mint creation and safe, auditable transaction assembly. The library is designed for infrastructure teams, indexers, and automated minting pipelines that require clear trust boundaries and deterministic behavior.

Key guarantees:
- Deterministic address derivation and instruction assembly
- No private key custody — signing is injected by the host
- Explicit validation and exhaustive error types for programmatic handling
- Node.js-only runtime compatibility (Node 18+)

---

## Why Node.js only ⚙️

This SDK is intentionally backend-focused:
- Avoids browser, DOM, React, or wallet assumptions
- Enables integration with KMS/HSMs and server-side signing services
- Keeps the bundle minimal and tree-shakeable for server environments

---

## Installation

Install with pnpm (recommended):

pnpm add clearmint-sdk

Requirements:
- Node.js >= 18
- TypeScript in consuming projects recommended for type-safety

---

## Quickstart — Backend example (Node.js)

```ts
import { ClearMintClient, type MintParams } from 'clearmint-sdk'
import { Keypair, Transaction } from '@solana/web3.js'

const client = new ClearMintClient({ rpcUrl: 'https://api.devnet.solana.com' })

const payer = Keypair.generate()

const params: MintParams = {
  name: 'InfraToken',
  symbol: 'INF',
  decimals: 2,
  totalSupply: 1_000_000n,
  mintAuthority: payer.publicKey,
  immutable: true
}

// Preview deterministically (no RPC call required)
const preview = client.previewMint(params)
console.log('Preview address:', preview.estimatedMintAddress.toBase58())

// signAndSendTransaction should be provided by your signing boundary (KMS/HSM/remote-signer)
const signAndSendTransaction = async (tx: Transaction): Promise<string> => {
  // Implement RPC + signing call to your signer service (this is injected)
  throw new Error('Replace with your signer implementation')
}

try {
  const result = await client.createMint(params, { payer: payer.publicKey, signAndSendTransaction })
  console.log('Created mint:', result.mintAddress.toBase58(), 'sig:', result.transactionSignature)
} catch (err) {
  // Handle typed errors programmatically
  console.error('Failed to create mint:', err)
}
```

> Note: The SDK never stores private keys and will throw typed errors for validation, instruction building, RPC, and signer failures.

---

## Public API Reference

### ClearMintClient

- constructor(options?: { rpcUrl?: string; commitment?: Commitment })
  - `rpcUrl` (optional): Explicit RPC endpoint. Default: Devnet.
  - `commitment` (optional): Solana commitment level used by internal `Connection`.

- previewMint(params: MintParams): MintPreview
  - Deterministic, synchronous preview of where the mint will exist and gas/insight counts.

- createMint(params: MintParams, context: { payer: PublicKey; signAndSendTransaction: (tx: Transaction) => Promise<string> }): Promise<CreateMintResult>
  - Builds the transaction deterministically and delegates signing to the injected function.

Types (high-level)
- MintParams: { name, symbol, decimals, totalSupply: bigint, mintAuthority: PublicKey, freezeAuthority?: PublicKey, immutable: boolean }
- MintPreview: { estimatedMintAddress: PublicKey, totalSupply: bigint, decimals: number, instructionsCount: number, estimatedFeeLamports: number }
- CreateMintResult: { mintAddress: PublicKey, transactionSignature: string }

---

## Errors — Typed & Exported

All SDK errors extend `ClearmintError` and contain stable `code` values:

- `InvalidMintParamsError` — validation failures (bad name/symbol/decimals/totalSupply)
- `InstructionBuildError` — failed to assemble instructions
- `TransactionSendError` — signer or sending failed
- `RpcConnectionError` — RPC connectivity issues

Always catch by error class (or check `error.code`) to make robust error handling decisions.

---

## Pipeline primitives (server-side)

The SDK includes a minimal FIFO pipeline useful for deterministic batch mint execution:

- `MintQueue` — enqueue params and inspect status (queued/processing/completed/failed)
- `createBatch(queue, maxSize)` — deterministic ordered batch extraction
- `MintWorker` — single-process worker that processes the next queued item with bounded retries and idempotency guarantees

This is designed for process-safe, in-memory queueing for worker processes (no threads, no cron).

---

## Security & Audit notes 🔒

See `/security` and `/audit` for auditor-facing documentation. Highlights:
- Signing is injected; SDK does not handle private keys.
- All numeric supply arithmetic uses `bigint` to avoid precision errors.
- Deterministic behavior: no randomness, stable seeds for address derivation.
- RPC is an explicit dependency; callers must choose trusted endpoints.

---

## Operational guarantees & best practices

- Explicit validation prevents malformed or ambiguous params.
- Make signer timeouts and retries part of your signing boundary.
- Treat RPC failures as retriable or escalate based on `RpcConnectionError`.

---

## When NOT to use

- In-browser or client-side applications
- Wallet UI integrations or wallet adapters
- Situations requiring direct custody of private keys by the SDK

---

## Testing & Development

Run locally:

pnpm install
pnpm lint
pnpm test
pnpm build

The repo includes CI that runs lint → test → build on each PR.

---

## Change log & Versioning

See `CHANGELOG.md` for release notes. Releases follow semantic versioning; breaking changes only occur in major versions.

---

## License

MIT — see `LICENSE`.

For detailed architecture and threat models, refer to `/docs/architecture.md`, `/security`, and `/audit` folders.
