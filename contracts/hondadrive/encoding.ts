export function encodeScaled(value: number | undefined, scale: number): number | undefined {
  if (value === undefined) return undefined
  if (!Number.isFinite(value)) {
    throw new RangeError('Telemetry value must be finite')
  }
  return Math.round(value * scale)
}

export function decodeScaled(value: number | undefined, scale: number): number | undefined {
  if (value === undefined) return undefined
  if (!Number.isFinite(value)) {
    throw new RangeError('Wire value must be finite')
  }
  return value / scale
}

export function encodeUnsignedScaled(
  value: number | undefined,
  scale: number,
): number | undefined {
  const encoded = encodeScaled(value, scale)
  if (encoded === undefined) return undefined
  if (encoded < 0) {
    throw new RangeError('Unsigned telemetry value cannot be negative')
  }
  return encoded
}
