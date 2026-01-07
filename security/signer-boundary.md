# Signer Boundary

- The SDK never touches private keys.
- Signing is provided as an injected function (dependency injection) with the signature `(tx: Transaction) => Promise<string>`.
- The SDK only builds transactions and returns them to the caller via the `createMint` flow.
- Replay prevention is the responsibility of calling services—SDK ensures deterministic assembly but does not manage anti-replay nonces.
