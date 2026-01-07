# Architecture (Infra View)

This document explains how the clearmint-sdk fits into backend services and the separation of concerns for secure, deterministic mint creation.

Architecture (ASCII):

Client Service
  |
  |--> ClearMintClient
        |--> Validation Layer
        |--> Instruction Builder
        |--> Transaction Assembler
        |--> RPC Adapter
        |--> External Signer (Injected)
  |
Solana RPC

Trust boundaries
- The SDK never holds private keys. Signing is injected by the host service.
- RPC is a boundary; callers must provide the RPC URL or use the Devnet default.

Deterministic execution
- All address derivation uses deterministic seeds (name, symbol, totalSupply).
- No randomness, no global mutable state.

Non-custodial guarantees
- Private keys are never stored, and signing is a dependency injected callback.

Deterministic flow
1. Validate params in Validation Layer
2. Build deterministic addresses and instructions in Instruction Builder
3. Assemble transaction using Transaction Assembler
4. Serialized transaction is passed to signAndSendTransaction (External Signer)
5. RPC Adapter sends transaction and returns signature
