import { describe, expect, it, vi } from 'vitest'
import type { TelemetryFrame } from '../../../models/hondadriveTelemetry'
import { HondaDriveTelemetryIngestionService } from '../../../contracts/hondadrive/ingestion'
import { InMemoryTelemetryFrameRepository } from '../../../contracts/hondadrive/repository'
import { HondaDriveWebSocketAdapter } from '../../../contracts/hondadrive/websocket'

const frame: TelemetryFrame = {
  tripId: 'trip-001',
  vehicle: { vehicleId: 'civic-eu8' },
  firstSequence: 0,
  lastSequence: 1,
  sentAtMs: 1_757_000_000_000,
  schemaVersion: 1,
  samples: [
    { sequence: 0, timestampMs: 1_757_000_000_000, obd: { rpm: 850 } },
    { sequence: 1, timestampMs: 1_757_000_001_000, obd: { rpm: 1200 } },
  ],
}

const message = JSON.stringify({ type: 'TELEMETRY_FRAME', frame })

function createAdapter() {
  return new HondaDriveWebSocketAdapter(
    new HondaDriveTelemetryIngestionService(new InMemoryTelemetryFrameRepository()),
    () => 1_757_000_010_000,
  )
}

function createSocket() {
  return { send: vi.fn() }
}

describe('HondaDrive WebSocket adapter', () => {
  it('ingests a telemetry frame and sends an ACK', async () => {
    const adapter = createAdapter()
    const socket = createSocket()

    await adapter.handleMessage(socket, message)

    expect(socket.send).toHaveBeenCalledTimes(1)
    expect(JSON.parse(socket.send.mock.calls[0][0])).toEqual({
      type: 'TELEMETRY_ACK',
      tripId: 'trip-001',
      acknowledgedSequence: 1,
      missingRanges: [],
    })
  })

  it('returns a missing range in the ACK for an out-of-order frame', async () => {
    const adapter = createAdapter()
    const socket = createSocket()

    const laterFrame = {
      ...frame,
      firstSequence: 4,
      lastSequence: 5,
      samples: [
        { sequence: 4, timestampMs: 1_757_000_004_000 },
        { sequence: 5, timestampMs: 1_757_000_005_000 },
      ],
    }

    await adapter.handleMessage(socket, JSON.stringify({
      type: 'TELEMETRY_FRAME',
      frame: laterFrame,
    }))

    expect(JSON.parse(socket.send.mock.calls[0][0])).toEqual({
      type: 'TELEMETRY_ACK',
      tripId: 'trip-001',
      acknowledgedSequence: -1,
      missingRanges: [{ fromSequence: 0, toSequence: 3 }],
    })
  })

  it('sends a protocol error for malformed JSON', async () => {
    const adapter = createAdapter()
    const socket = createSocket()

    await adapter.handleMessage(socket, '{not-json')

    expect(JSON.parse(socket.send.mock.calls[0][0])).toEqual({
      type: 'TELEMETRY_ERROR',
      message: 'Invalid WebSocket message: expected JSON',
    })
  })

  it('sends a protocol error for an invalid telemetry frame', async () => {
    const adapter = createAdapter()
    const socket = createSocket()

    const invalidFrame = { ...frame, firstSequence: 1 }

    await adapter.handleMessage(socket, JSON.stringify({
      type: 'TELEMETRY_FRAME',
      frame: invalidFrame,
    }))

    const response = JSON.parse(socket.send.mock.calls[0][0])
    expect(response.type).toBe('TELEMETRY_ERROR')
    expect(response.tripId).toBe('trip-001')
    expect(response.message).toContain('Invalid HondaDrive telemetry frame')
  })

  it('decodes a valid frame envelope without touching the socket', () => {
    const decoded = HondaDriveWebSocketAdapter.decode(message)

    expect(decoded.type).toBe('TELEMETRY_FRAME')
    expect(decoded.frame).toEqual(frame)
  })
})
