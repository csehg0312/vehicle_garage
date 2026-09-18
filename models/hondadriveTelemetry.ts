export type VehicleState =
  | 'UNKNOWN'
  | 'IDLE'
  | 'ACCELERATION'
  | 'CRUISING'
  | 'DECELERATION'
  | 'COASTING_NEUTRAL'
  | 'HIGH_LOAD'

export interface HondaDriveVehicleRef {
  vehicleId: string
  profileId?: string
}

export interface TelemetrySample {
  sequence: number
  timestampMs: number
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

export type TelemetryEventType =
  | 'STATE_TRANSITION'
  | 'VALIDATION'
  | 'ANOMALY'
  | 'SHIFT_CANDIDATE'

export interface TelemetryEvent {
  sequence: number
  timestampMs: number
  type: TelemetryEventType
  stateFrom?: VehicleState
  stateTo?: VehicleState
  confidence?: number
  message?: string
  data?: Record<string, number | string | boolean>
}

export interface HondaDriveTrip {
  tripId: string
  vehicle: HondaDriveVehicleRef
  startedAtMs: number
  endedAtMs?: number
  sampleCount: number
  telemetry: TelemetrySample[]
  stateEstimates?: StateEstimate[]
  behavior?: BehaviorMetrics
  events?: TelemetryEvent[]
}

export interface TelemetryFrame {
  tripId: string
  vehicle: HondaDriveVehicleRef
  firstSequence: number
  lastSequence: number
  sentAtMs: number
  samples: TelemetrySample[]
  stateEstimates?: StateEstimate[]
  events?: TelemetryEvent[]
}

export interface TelemetryCursor {
  tripId: string
  nextSequence: number
  acknowledgedSequence: number
}
