# Supply Determinism

- Total supply is enforced as a bigint type and validated to be > 0.
- All arithmetic uses bigint to avoid overflow and floating point errors.
- Address derivation is deterministic based on `name`, `symbol`, and `totalSupply` seeds.
- The SDK does not mint tokens on behalf of users without explicit signature.
