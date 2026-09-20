import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const proto = readFileSync(
  new URL('../../../contracts/hondadrive/telemetry.proto', import.meta.url),
  'utf8',
)

describe('HondaDrive protobuf contract', () => {
  it('models the transport boundary as separate GPS, OBD and derived messages', () => {
    expect(proto).toContain('message GpsTelemetry {')
    expect(proto).toContain('message ObdTelemetry {')
    expect(proto).toContain('message DerivedTelemetry {')
    expect(proto).toContain('message TelemetrySample {')
    expect(proto).toContain('GpsTelemetry gps = 3;')
    expect(proto).toContain('ObdTelemetry obd = 4;')
    expect(proto).toContain('DerivedTelemetry derived = 5;')
  })

  it('preserves the state and event enums', () => {
    expect(proto).toContain('CRUISING = 4;')
    expect(proto).toContain('HIGH_LOAD = 7;')
    expect(proto).toContain('SHIFT_CANDIDATE = 4;')
    expect(proto).toContain('enum ShiftCandidateDirection {')
  })

  it('uses integer scaling for compact numeric wire fields', () => {
    expect(proto).toContain('sint32 latitude_e7 = 1;')
    expect(proto).toContain('sint32 longitude_e7 = 2;')
    expect(proto).toContain('uint32 rpm_x10 = 1;')
    expect(proto).toContain('sint32 short_fuel_trim_percent_x10 = 8;')
    expect(proto).toContain('uint32 estimated_power_kw_x100 = 5;')
    expect(proto).toContain('uint32 estimated_torque_nm_x100 = 6;')
  })

  it('uses uint64 sequence values and carries a schema version', () => {
    expect(proto).toContain('uint64 sequence = 1;')
    expect(proto).toContain('uint64 first_sequence = 3;')
    expect(proto).toContain('uint64 last_sequence = 4;')
    expect(proto).toContain('uint32 schema_version = 9;')
  })

  it('keeps Bluetooth MAC/session diagnostics out of the wire contract', () => {
    expect(proto).not.toContain('obd_attached_mac')
    expect(proto).not.toContain('obdAttachedMacAddress')
  })
})
