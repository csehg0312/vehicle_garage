export const VEHICLE_STATES = [
  'UNKNOWN',
  'IDLE',
  'ACCELERATION',
  'CRUISING',
  'DECELERATION',
  'COASTING_NEUTRAL',
  'HIGH_LOAD',
  'SHIFTING',
] as const

export type VehicleState = (typeof VEHICLE_STATES)[number]

export const TELEMETRY_EVENT_TYPES = [
  'STATE_TRANSITION',
  'VALIDATION',
  'ANOMALY',
  'SHIFT_CANDIDATE',
] as const

export type TelemetryEventType = (typeof TELEMETRY_EVENT_TYPES)[number]

export const SHIFT_CANDIDATE_DIRECTIONS = ['UP', 'DOWN'] as const
export type ShiftCandidateDirection = (typeof SHIFT_CANDIDATE_DIRECTIONS)[number]

export interface HondaDriveVehicleRef {
  vehicleId: string
  profileId?: string
}

export interface GpsTelemetry {
  latitude: number
  longitude: number
  speedKph?: number
  headingDegrees?: number
  accuracyMeters?: number
}

export interface ObdTelemetry {
  rpm?: number
  speedKph?: number
  coolantCelsius?: number
  engineLoadPercent?: number
  mapKpa?: number
  intakeAirCelsius?: number
  throttlePercent?: number
  shortFuelTrimPercent?: number
  longFuelTrimPercent?: number
  mafGPerS?: number
  fuelLevelPercent?: number
  controlModuleVoltage?: number
  timingAdvanceDegrees?: number
  fuelPressureKpa?: number
  runtimeSinceStartSeconds?: number
  barometricPressureKpa?: number
  ambientAirCelsius?: number
}

export interface DerivedTelemetry {
  totalFuelTrimPercent?: number
  estimatedAirMassGPerS?: number
  estimatedFuelRateLph?: number
  estimatedFuelEconomyLPer100Km?: number
  estimatedPowerKw?: number
  estimatedTorqueNm?: number
}

export interface TelemetrySample {
  sequence: number
  timestampMs: number
  gps?: GpsTelemetry
  obd?: ObdTelemetry
  derived?: DerivedTelemetry
}

export interface StateEstimate {
  timestampMs: number
  state: VehicleState
  confidence: number
}

export interface BehaviorMetrics {
  responsiveness?: number
  stability?: number
  selfCorrection?: number
  oscillationRate?: number
  transitionRate?: number
  confidenceVolatility?: number
}

export interface ShiftCandidate {
  direction: ShiftCandidateDirection
  confidence: number
}

export interface TelemetryEvent {
  sequence: number
  timestampMs: number
  type: TelemetryEventType
  stateFrom?: VehicleState
  stateTo?: VehicleState
  confidence?: number
  shiftCandidate?: ShiftCandidate
  message?: string
}

export interface HondaDriveTrip {
  tripId: string
  vehicle: HondaDriveVehicleRef
  startedAtMs: number
  endedAtMs?: number
  schemaVersion: number
  sampleCount: number
}

export interface TelemetryFrame {
  tripId: string
  vehicle: HondaDriveVehicleRef
  firstSequence: number
  lastSequence: number
  sentAtMs: number
  schemaVersion: number
  samples: TelemetrySample[]
  stateEstimates?: StateEstimate[]
  events?: TelemetryEvent[]
}

export interface TelemetryCursor {
  tripId: string
  nextSequence: number
  acknowledgedSequence: number
}

export interface MetricAggregate {
  current?: number
  average?: number
  min?: number
  max?: number
  delta?: number
  rateOfChange?: number
  variability?: number
}

export interface TelemetryWindow {
  durationMs: number
  sampleCount: number
  metrics: Record<string, MetricAggregate>
}

export interface HondaDriveDashboardState {
  connection: {
    connected: boolean
    obdConnected: boolean
    gpsAvailable: boolean
    lastSampleTimestampMs?: number
    aggregateSampleRateHz?: number
    obdSampleRateHz?: number
    gpsSampleRateHz?: number
  }
  vehicle: {
    speedKph?: number
    rpm?: number
    engineLoadPercent?: number
    throttlePercent?: number
    mapKpa?: number
    coolantCelsius?: number
  }
  output: {
    powerKw?: number
    torqueNm?: number
  }
  state: StateEstimate
  behavior: BehaviorMetrics
  windows: {
    short: TelemetryWindow
    medium: TelemetryWindow
    long: TelemetryWindow
  }
  recentEvents: TelemetryEvent[]
}

export function isVehicleState(value: string): value is VehicleState {
  return (VEHICLE_STATES as readonly string[]).includes(value)
}

export function isTelemetryEventType(value: string): value is TelemetryEventType {
  return (TELEMETRY_EVENT_TYPES as readonly string[]).includes(value)
}

export function isShiftCandidateDirection(value: string): value is ShiftCandidateDirection {
  return (SHIFT_CANDIDATE_DIRECTIONS as readonly string[]).includes(value)
}
