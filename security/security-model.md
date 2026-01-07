# Security Model

Threat model, attack surfaces, and assumptions for clearmint-sdk.

- Threats:
  - Malicious signer: signing boundary ensures SDK doesn't accept private keys directly.
  - RPC compromise: SDK treats RPC as untrusted; callers must supply trusted endpoints.
  - Parameter tampering: strict validation prevents malformed mint parameters.

- Attack surfaces:
  - RPC requests
  - Signing callback
  - Transaction assembly

- Assumptions:
  - Caller controls pays and signing keys.
  - Network-level protections (TLS) are in place for RPC endpoints.

Out-of-scope:
- Wallet UI
- Browser usage

