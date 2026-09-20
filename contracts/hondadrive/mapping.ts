import type {
  DerivedTelemetry,
  GpsTelemetry,
  HondaDriveVehicleRef,
  ObdTelemetry,
  ShiftCandidate,
  StateEstimate,
  TelemetryEvent,
  TelemetryFrame,
  TelemetrySample,
  TelemetryEventType,
  VehicleState,
  ShiftCandidateDirection,
} from '../../models/hondadriveTelemetry'
import {
  decodeScaled,
  encodeScaled,
  encodeUnsignedScaled,
} from './encoding'

export interface WireGpsTelemetry {
  latitude_e7?: number
  longitude_e7?: number
  speed_kph_x10?: number
  heading_degrees_x10?: number
  accuracy_m_x100?: number
}

export interface WireObdTelemetry {
  rpm_x10?: number
  speed_kph_x10?: number
  coolant_celsius_x10?: number
  engine_load_percent_x10?: number
  map_kpa_x10?: number
  intake_air_celsius_x10?: number
  throttle_percent_x10?: number
  short_fuel_trim_percent_x10?: number
  long_fuel_trim_percent_x10?: number
  maf_g_per_s_x100?: number
  fuel_level_percent_x10?: number
  control_module_voltage_x100?: number
  timing_advance_degrees_x10?: number
  fuel_pressure_kpa_x10?: number
  runtime_since_start_seconds?: number
  barometric_pressure_kpa_x10?: number
  ambient_air_celsius_x10?: number
}

export interface WireDerivedTelemetry {
  total_fuel_trim_percent_x10?: number
  estimated_air_mass_g_per_s_x100?: number
  estimated_fuel_rate_lph_x100?: number
  estimated_fuel_economy_l_per_100km_x100?: number
  estimated_power_kw_x100?: number
  estimated_torque_nm_x100?: number
}

export interface WireVehicleRef {
  vehicle_id: string
  profile_id?: string
}

export interface WireStateEstimate {
  timestamp_ms: number
  state: VehicleState
  confidence_x1000?: number
}

export interface WireShiftCandidate {
  direction: ShiftCandidateDirection
  confidence_x1000?: number
}

export interface WireTelemetryEvent {
  sequence: number
  timestamp_ms: number
  type: TelemetryEventType
  state_from?: VehicleState
  state_to?: VehicleState
  confidence_x1000?: number
  shift_candidate?: WireShiftCandidate
  message?: string
}

export interface WireTelemetrySample {
  sequence: number
  timestamp_ms: number
  gps?: WireGpsTelemetry
  obd?: WireObdTelemetry
  derived?: WireDerivedTelemetry
}

export interface WireTelemetryFrame {
  trip_id: string
  vehicle: WireVehicleRef
  first_sequence: number
  last_sequence: number
  sent_at_ms: number
  schema_version: number
  samples: WireTelemetrySample[]
  state_estimates?: WireStateEstimate[]
  events?: WireTelemetryEvent[]
}

function requireDecoded(value: number | undefined, fieldName: string): number {
  const decoded = decodeScaled(value, 1000)
  if (decoded === undefined) {
    throw new Error(`${fieldName} is required by the domain model`)
  }
  return decoded
}

export function toWireGps(value: GpsTelemetry): WireGpsTelemetry {
  return {
    latitude_e7: encodeScaled(value.latitude, 10_000_000),
    longitude_e7: encodeScaled(value.longitude, 10_000_000),
    speed_kph_x10: encodeUnsignedScaled(value.speedKph, 10),
    heading_degrees_x10: encodeUnsignedScaled(value.headingDegrees, 10),
    accuracy_m_x100: encodeUnsignedScaled(value.accuracyMeters, 100),
  }
}

export function fromWireGps(value: WireGpsTelemetry): GpsTelemetry {
  return {
    latitude: requireDecoded(value.latitude_e7, 10_000_000, 'GPS latitude'),
    longitude: requireDecoded(value.longitude_e7, 10_000_000, 'GPS longitude'),
    speedKph: decodeScaled(value.speed_kph_x10, 10),
    headingDegrees: decodeScaled(value.heading_degrees_x10, 10),
    accuracyMeters: decodeScaled(value.accuracy_m_x100, 100),
  }
}

export function toWireObd(value: ObdTelemetry): WireObdTelemetry {
  return {
    rpm_x10: encodeUnsignedScaled(value.rpm, 10),
    speed_kph_x10: encodeUnsignedScaled(value.speedKph, 10),
    coolant_celsius_x10: encodeScaled(value.coolantCelsius, 10),
    engine_load_percent_x10: encodeUnsignedScaled(value.engineLoadPercent, 10),
    map_kpa_x10: encodeUnsignedScaled(value.mapKpa, 10),
    intake_air_celsius_x10: encodeScaled(value.intakeAirCelsius, 10),
    throttle_percent_x10: encodeUnsignedScaled(value.throttlePercent, 10),
    short_fuel_trim_percent_x10: encodeScaled(value.shortFuelTrimPercent, 10),
    long_fuel_trim_percent_x10: encodeScaled(value.longFuelTrimPercent, 10),
    maf_g_per_s_x100: encodeUnsignedScaled(value.mafGPerS, 100),
    fuel_level_percent_x10: encodeUnsignedScaled(value.fuelLevelPercent, 10),
    control_module_voltage_x100: encodeUnsignedScaled(value.controlModuleVoltage, 100),
    timing_advance_degrees_x10: encodeScaled(value.timingAdvanceDegrees, 10),
    fuel_pressure_kpa_x10: encodeUnsignedScaled(value.fuelPressureKpa, 10),
    runtime_since_start_seconds: encodeUnsignedScaled(value.runtimeSinceStartSeconds, 1),
    barometric_pressure_kpa_x10: encodeUnsignedScaled(value.barometricPressureKpa, 10),
    ambient_air_celsius_x10: encodeScaled(value.ambientAirCelsius, 10),
  }
}

export function fromWireObd(value: WireObdTelemetry): ObdTelemetry {
  return {
    rpm: decodeScaled(value.rpm_x10, 10),
    speedKph: decodeScaled(value.speed_kph_x10, 10),
    coolantCelsius: decodeScaled(value.coolant_celsius_x10, 10),
    engineLoadPercent: decodeScaled(value.engine_load_percent_x10, 10),
    mapKpa: decodeScaled(value.map_kpa_x10, 10),
    intakeAirCelsius: decodeScaled(value.intake_air_celsius_x10, 10),
    throttlePercent: decodeScaled(value.throttle_percent_x10, 10),
    shortFuelTrimPercent: decodeScaled(value.short_fuel_trim_percent_x10, 10),
    longFuelTrimPercent: decodeScaled(value.long_fuel_trim_percent_x10, 10),
    mafGPerS: decodeScaled(value.maf_g_per_s_x100, 100),
    fuelLevelPercent: decodeScaled(value.fuel_level_percent_x10, 10),
    controlModuleVoltage: decodeScaled(value.control_module_voltage_x100, 100),
    timingAdvanceDegrees: decodeScaled(value.timing_advance_degrees_x10, 10),
    fuelPressureKpa: decodeScaled(value.fuel_pressure_kpa_x10, 10),
    runtimeSinceStartSeconds: decodeScaled(value.runtime_since_start_seconds, 1),
    barometricPressureKpa: decodeScaled(value.barometric_pressure_kpa_x10, 10),
    ambientAirCelsius: decodeScaled(value.ambient_air_celsius_x10, 10),
  }
}

export function toWireDerived(value: DerivedTelemetry): WireDerivedTelemetry {
  return {
    total_fuel_trim_percent_x10: encodeScaled(value.totalFuelTrimPercent, 10),
    estimated_air_mass_g_per_s_x100: encodeUnsignedScaled(value.estimatedAirMassGPerS, 100),
    estimated_fuel_rate_lph_x100: encodeUnsignedScaled(value.estimatedFuelRateLph, 100),
    estimated_fuel_economy_l_per_100km_x100: encodeUnsignedScaled(value.estimatedFuelEconomyLPer100Km, 100),
    estimated_power_kw_x100: encodeUnsignedScaled(value.estimatedPowerKw, 100),
    estimated_torque_nm_x100: encodeUnsignedScaled(value.estimatedTorqueNm, 100),
  }
}

export function fromWireDerived(value: WireDerivedTelemetry): DerivedTelemetry {
  return {
    totalFuelTrimPercent: decodeScaled(value.total_fuel_trim_percent_x10, 10),
    estimatedAirMassGPerS: decodeScaled(value.estimated_air_mass_g_per_s_x100, 100),
    estimatedFuelRateLph: decodeScaled(value.estimated_fuel_rate_lph_x100, 100),
    estimatedFuelEconomyLPer100Km: decodeScaled(value.estimated_fuel_economy_l_per_100km_x100, 100),
    estimatedPowerKw: decodeScaled(value.estimated_power_kw_x100, 100),
    estimatedTorqueNm: decodeScaled(value.estimated_torque_nm_x100, 100),
  }
}

export function toWireVehicleRef(value: HondaDriveVehicleRef): WireVehicleRef {
  return {
    vehicle_id: value.vehicleId,
    profile_id: value.profileId,
  }
}

export function fromWireVehicleRef(value: WireVehicleRef): HondaDriveVehicleRef {
  return {
    vehicleId: value.vehicle_id,
    profileId: value.profile_id,
  }
}

export function toWireStateEstimate(value: StateEstimate): WireStateEstimate {
  return {
    timestamp_ms: value.timestampMs,
    state: value.state,
    confidence_x1000: encodeUnsignedScaled(value.confidence, 1000),
  }
}

export function fromWireStateEstimate(value: WireStateEstimate): StateEstimate {
  return {
    timestampMs: value.timestamp_ms,
    state: value.state,
    confidence: requireDecoded(value.confidence_x1000, 1000, 'StateEstimate confidence'),
  }
}

export function toWireShiftCandidate(value: ShiftCandidate): WireShiftCandidate {
  return {
    direction: value.direction,
    confidence_x1000: encodeUnsignedScaled(value.confidence, 1000),
  }
}

export function fromWireShiftCandidate(value: WireShiftCandidate): ShiftCandidate {
  return {
    direction: value.direction,
    confidence: requireDecoded(value.confidence_x1000, 1000, 'ShiftCandidate confidence'),
  }
}

export function toWireEvent(value: TelemetryEvent): WireTelemetryEvent {
  return {
    sequence: value.sequence,
    timestamp_ms: value.timestampMs,
    type: value.type,
    state_from: value.stateFrom,
    state_to: value.stateTo,
    confidence_x1000: encodeUnsignedScaled(value.confidence, 1000),
    shift_candidate: value.shiftCandidate
      ? toWireShiftCandidate(value.shiftCandidate)
      : undefined,
    message: value.message,
  }
}

export function fromWireEvent(value: WireTelemetryEvent): TelemetryEvent {
  return {
    sequence: value.sequence,
    timestampMs: value.timestamp_ms,
    type: value.type,
    stateFrom: value.state_from,
    stateTo: value.state_to,
    confidence: decodeScaled(value.confidence_x1000, 1000),
    shiftCandidate: value.shift_candidate
      ? fromWireShiftCandidate(value.shift_candidate)
      : undefined,
    message: value.message,
  }
}

export function toWireSample(value: TelemetrySample): WireTelemetrySample {
  return {
    sequence: value.sequence,
    timestamp_ms: value.timestampMs,
    gps: value.gps ? toWireGps(value.gps) : undefined,
    obd: value.obd ? toWireObd(value.obd) : undefined,
    derived: value.derived ? toWireDerived(value.derived) : undefined,
  }
}

export function fromWireSample(value: WireTelemetrySample): TelemetrySample {
  return {
    sequence: value.sequence,
    timestampMs: value.timestamp_ms,
    gps: value.gps ? fromWireGps(value.gps) : undefined,
    obd: value.obd ? fromWireObd(value.obd) : undefined,
    derived: value.derived ? fromWireDerived(value.derived) : undefined,
  }
}

export function toWireFrame(value: TelemetryFrame): WireTelemetryFrame {
  return {
    trip_id: value.tripId,
    vehicle: toWireVehicleRef(value.vehicle),
    first_sequence: value.firstSequence,
    last_sequence: value.lastSequence,
    sent_at_ms: value.sentAtMs,
    schema_version: value.schemaVersion,
    samples: value.samples.map(toWireSample),
    state_estimates: value.stateEstimates?.map(toWireStateEstimate),
    events: value.events?.map(toWireEvent),
  }
}

export function fromWireFrame(value: WireTelemetryFrame): TelemetryFrame {
  return {
    tripId: value.trip_id,
    vehicle: fromWireVehicleRef(value.vehicle),
    firstSequence: value.first_sequence,
    lastSequence: value.last_sequence,
    sentAtMs: value.sent_at_ms,
    schemaVersion: value.schema_version,
    samples: value.samples.map(fromWireSample),
    stateEstimates: value.state_estimates?.map(fromWireStateEstimate),
    events: value.events?.map(fromWireEvent),
  }
}
