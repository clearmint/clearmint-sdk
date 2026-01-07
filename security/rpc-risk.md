# RPC Risk

- RPC endpoints are treated as untrusted and callers should choose providers accordingly (e.g. private RPC endpoints, guarded endpoints).
- Mitigations:
  - Explicit RPC URL configuration (no environment variable implicitness)
  - Short RPC timeouts should be enforced by calling code
  - All RPC errors are surfaced as typed `RpcConnectionError` for deterministic handling

- Failure modes:
  - Network partitioning
  - RPC node returning stale or malformed data

