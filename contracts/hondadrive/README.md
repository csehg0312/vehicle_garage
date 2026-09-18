# HondaDrive realtime telemetry contract

This directory defines the first Vehicle Garage-side contract for telemetry produced by HondaDrive.

Design goals:
- keep the realtime payload compact;
- preserve sequence-based recovery after connection loss;
- separate raw telemetry from derived state and validation events;
- keep the contract transport/storage agnostic;
- allow the binary transport to evolve independently from the domain model.

The TypeScript model is the Vehicle Garage domain-facing representation. The protobuf schema is the wire-format contract for the future HondaDrive -> Vehicle Garage realtime channel.

The current schema intentionally does not define persistence or encryption. Those are separate boundaries: transport security (WSS/TLS), storage protection, and optional application-level payload encryption.
