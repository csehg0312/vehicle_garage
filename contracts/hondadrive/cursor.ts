import type { TelemetryFrame } from '../../models/hondadriveTelemetry'

export interface TelemetryCursor {
  tripId: string
  nextSequence: number
  acknowledgedSequence: number
}

export interface TelemetryGap {
  fromSequence: number
  toSequence: number
}

export interface TelemetryCursorState {
  cursor: TelemetryCursor
  gaps: TelemetryGap[]
}

export function createTelemetryCursor(tripId: string): TelemetryCursor {
  return { tripId, nextSequence: 0, acknowledgedSequence: -1 }
}

export function applyTelemetryFrame(
  state: TelemetryCursorState,
  frame: TelemetryFrame,
): TelemetryCursorState {
  if (state.cursor.tripId !== frame.tripId) {
    throw new Error('Telemetry frame belongs to a different trip')
  }

  const gaps = [...state.gaps]
  const receivedFrom = frame.firstSequence
  const receivedTo = frame.lastSequence

  if (receivedTo < state.cursor.nextSequence) {
    return state
  }

  if (receivedFrom > state.cursor.nextSequence) {
    gaps.push({ fromSequence: state.cursor.nextSequence, toSequence: receivedFrom - 1 })
    return {
      cursor: {
        ...state.cursor,
        nextSequence: Math.max(state.cursor.nextSequence, receivedTo + 1),
      },
      gaps: mergeGaps(gaps),
    }
  }

  let nextSequence = state.cursor.nextSequence
  while (nextSequence <= receivedTo) nextSequence += 1

  const remainingGaps = subtractRange(gaps, receivedFrom, receivedTo)
  const contiguousAcknowledged = remainingGaps.length === 0
    ? nextSequence - 1
    : Math.min(
        nextSequence - 1,
        Math.max(
          -1,
          ...remainingGaps.map((gap) => gap.fromSequence - 1),
        ),
      )

  return {
    cursor: {
      ...state.cursor,
      nextSequence: nextSequence,
      acknowledgedSequence: Math.max(state.cursor.acknowledgedSequence, contiguousAcknowledged),
    },
    gaps: remainingGaps,
  }
}

function subtractRange(gaps: TelemetryGap[], from: number, to: number): TelemetryGap[] {
  return gaps.flatMap((gap) => {
    if (to < gap.fromSequence || from > gap.toSequence) return [gap]
    const result: TelemetryGap[] = []
    if (from > gap.fromSequence) result.push({ fromSequence: gap.fromSequence, toSequence: from - 1 })
    if (to < gap.toSequence) result.push({ fromSequence: to + 1, toSequence: gap.toSequence })
    return result
  })
}

function mergeGaps(gaps: TelemetryGap[]): TelemetryGap[] {
  return gaps
    .sort((a, b) => a.fromSequence - b.fromSequence)
    .reduce<TelemetryGap[]>((merged, gap) => {
      const previous = merged[merged.length - 1]
      if (!previous || gap.fromSequence > previous.toSequence + 1) {
        merged.push({ ...gap })
      } else {
        previous.toSequence = Math.max(previous.toSequence, gap.toSequence)
      }
      return merged
    }, [])
}
