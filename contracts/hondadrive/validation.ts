import type { TelemetryFrame } from '../../models/hondadriveTelemetry'

export const CURRENT_TELEMETRY_SCHEMA_VERSION = 1

export interface TelemetryValidationResult {
  valid: boolean
  errors: string[]
}

export function validateTelemetryFrame(frame: TelemetryFrame): TelemetryValidationResult {
  const errors: string[] = []

  if (!frame.tripId.trim()) errors.push('tripId is required')
  if (!frame.vehicle.vehicleId.trim()) errors.push('vehicle.vehicleId is required')
  if (!Number.isInteger(frame.schemaVersion) || frame.schemaVersion < 1) {
    errors.push('schemaVersion must be a positive integer')
  }
  if (frame.schemaVersion > CURRENT_TELEMETRY_SCHEMA_VERSION) {
    errors.push(`unsupported schemaVersion: ${frame.schemaVersion}`)
  }
  if (!Number.isSafeInteger(frame.firstSequence) || frame.firstSequence < 0) {
    errors.push('firstSequence must be a non-negative safe integer')
  }
  if (!Number.isSafeInteger(frame.lastSequence) || frame.lastSequence < 0) {
    errors.push('lastSequence must be a non-negative safe integer')
  }
  if (frame.firstSequence > frame.lastSequence) {
    errors.push('firstSequence must not exceed lastSequence')
  }
  if (!Number.isSafeInteger(frame.sentAtMs) || frame.sentAtMs < 0) {
    errors.push('sentAtMs must be a non-negative safe integer')
  }
  if (frame.samples.length === 0) errors.push('samples must not be empty')

  if (frame.samples.length > 0) {
    const expectedCount = frame.lastSequence - frame.firstSequence + 1
    if (expectedCount !== frame.samples.length) {
      errors.push('sample sequence range does not match sample count')
    }

    frame.samples.forEach((sample, index) => {
      const expectedSequence = frame.firstSequence + index
      if (sample.sequence !== expectedSequence) {
        errors.push(
          `sample[${index}] sequence ${sample.sequence} does not match expected ${expectedSequence}`,
        )
      }
      if (!Number.isSafeInteger(sample.sequence) || sample.sequence < 0) {
        errors.push(`sample[${index}] sequence must be a non-negative safe integer`)
      }
      if (!Number.isSafeInteger(sample.timestampMs) || sample.timestampMs < 0) {
        errors.push(`sample[${index}] timestampMs must be a non-negative safe integer`)
      }
    })
  }

  frame.stateEstimates?.forEach((estimate, index) => {
    if (!Number.isSafeInteger(estimate.timestampMs) || estimate.timestampMs < 0) {
      errors.push(`stateEstimates[${index}] timestampMs must be a non-negative safe integer`)
    }
    if (!Number.isFinite(estimate.confidence) || estimate.confidence < 0 || estimate.confidence > 1) {
      errors.push(`stateEstimates[${index}] confidence must be between 0 and 1`)
    }
  })

  frame.events?.forEach((event, index) => {
    if (!Number.isSafeInteger(event.sequence) || event.sequence < 0) {
      errors.push(`events[${index}] sequence must be a non-negative safe integer`)
    }
    if (!Number.isSafeInteger(event.timestampMs) || event.timestampMs < 0) {
      errors.push(`events[${index}] timestampMs must be a non-negative safe integer`)
    }
    if (event.confidence !== undefined && (!Number.isFinite(event.confidence) || event.confidence < 0 || event.confidence > 1)) {
      errors.push(`events[${index}] confidence must be between 0 and 1`)
    }
    if (event.shiftCandidate && (!Number.isFinite(event.shiftCandidate.confidence) || event.shiftCandidate.confidence < 0 || event.shiftCandidate.confidence > 1)) {
      errors.push(`events[${index}] shiftCandidate confidence must be between 0 and 1`)
    }
  })

  return { valid: errors.length === 0, errors }
}

export function assertValidTelemetryFrame(frame: TelemetryFrame): void {
  const result = validateTelemetryFrame(frame)
  if (!result.valid) {
    throw new Error(`Invalid HondaDrive telemetry frame: ${result.errors.join('; ')}`)
  }
}
