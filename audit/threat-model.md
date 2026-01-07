# Threat Model

High-level threat model for clearmint-sdk. See security documents for detailed mitigation.

- Key compromise: mitigated by injected signing boundary.
- RPC compromise: treated as untrusted, surfaced errors.
- Parameter abuse: validated inputs to prevent malformed mints.
