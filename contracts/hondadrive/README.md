# HondaDrive realtime telemetry contract

This directory defines the Vehicle Garage-side wire contract for telemetry produced by HondaDrive.

## Boundaries

- HondaDrive owns measurement, realtime state interpretation, behavior metrics, and the live dashboard.
- Vehicle Garage consumes the compact protobuf stream for persistence and historical analysis.
- HondaDriveDashboardState is a HondaDrive UI model and is not part of the wire contract.
- Raw GPS/OBD measurements are separated from derived values and state/events.

## Sampling

The reference trip showed approximately 1 Hz GPS samples and a median OBD interval of about 3.6 seconds. The contract therefore preserves source availability rather than interpolating OBD data into GPS cadence.

## Encoding

- Latitude/longitude use signed integer E7 encoding.
- Physical values use integer scaling (x10, x100, or x1000) where appropriate.
- uint64 sequence/timestamp fields prevent the wire contract from imposing a 32-bit sequence limit.
- Nested GPS/OBD/derived messages preserve field presence, including valid zero values.

## Privacy

Bluetooth MAC/session attachment information is intentionally excluded from the transport contract. It remains local diagnostic metadata in HondaDrive.

## Evolution

schema_version is carried at frame level. Protobuf field numbers are stable and new optional fields should be added without reusing existing field numbers.

The TypeScript model in models/hondadriveTelemetry.ts is the Vehicle Garage domain-facing representation. The protobuf schema is the wire-format contract for the HondaDrive -> Vehicle Garage realtime channel.
