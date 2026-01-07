# Deterministic Behavior

- All address derivation uses fixed seeds including `name`, `symbol`, and `totalSupply` and a stable SDK seed.
- No random numbers are used in address derivation or transaction assembly.
- Tests assert determinism for preview and pipeline ordering.
