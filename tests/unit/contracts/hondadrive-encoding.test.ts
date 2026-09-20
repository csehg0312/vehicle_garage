import { describe, expect, it } from 'vitest'
import {
  decodeScaled,
  encodeScaled,
  encodeUnsignedScaled,
} from '../../../contracts/hondadrive/encoding'

describe('HondaDrive telemetry numeric encoding', () => {
  it('round-trips positive scaled values within wire precision', () => {
    const encoded = encodeScaled(2430.7, 10)

    expect(encoded).toBe(24307)
    expect(decodeScaled(encoded, 10)).toBe(2430.7)
  })

  it('round-trips negative signed values', () => {
    const encoded = encodeScaled(-10.94, 10)

    expect(encoded).toBe(-109)
    expect(decodeScaled(encoded, 10)).toBe(-10.9)
  })

  it('preserves exact zero', () => {
    expect(encodeScaled(0, 10)).toBe(0)
    expect(decodeScaled(0, 10)).toBe(0)
    expect(encodeUnsignedScaled(0, 100)).toBe(0)
  })

  it('preserves missing values as undefined', () => {
    expect(encodeScaled(undefined, 10)).toBeUndefined()
    expect(decodeScaled(undefined, 10)).toBeUndefined()
    expect(encodeUnsignedScaled(undefined, 100)).toBeUndefined()
  })

  it('rounds to the declared wire precision', () => {
    expect(encodeScaled(91.234, 10)).toBe(912)
    expect(encodeScaled(7.777, 100)).toBe(778)
  })

  it('rejects non-finite values', () => {
    expect(() => encodeScaled(Number.NaN, 10)).toThrow(RangeError)
    expect(() => encodeScaled(Number.POSITIVE_INFINITY, 10)).toThrow(RangeError)
    expect(() => decodeScaled(Number.NaN, 10)).toThrow(RangeError)
  })

  it('rejects negative values for unsigned wire fields', () => {
    expect(() => encodeUnsignedScaled(-0.1, 10)).toThrow(RangeError)
  })
})
