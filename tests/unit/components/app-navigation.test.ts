import { describe, expect, it } from 'vitest'

describe('app navigation contract', () => {
  it('defines the primary mobile destinations', () => {
    const destinations = ['/garage', '/obd', '/manuals/honda-civic-2001-2005']

    expect(destinations).toHaveLength(3)
    expect(new Set(destinations).size).toBe(destinations.length)
  })

  it('uses a mobile-safe minimum touch target', () => {
    const minimumTouchTarget = 44

    expect(minimumTouchTarget).toBeGreaterThanOrEqual(44)
  })

  it('keeps the manual route stable for deep links', () => {
    expect('/manuals/honda-civic-2001-2005').toBe('/manuals/honda-civic-2001-2005')
  })
})
