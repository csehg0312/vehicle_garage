import { describe, expect, it } from 'vitest'
import { coolingComponents, coolantReplacementProcedure, overheatingDiagnostic } from './cooling'
import { d16v1Variant } from './variants'

const variantId = d16v1Variant.id

describe('Honda Civic D16V1 cooling data', () => {
  it('identifies the D16V1 variant and model-year scope', () => {
    expect(d16v1Variant.engineCodes).toContain('D16V1')
    expect(d16v1Variant.modelYears).toEqual([2001, 2002, 2003, 2004, 2005])
  })

  it('contains source-backed cooling components for the variant', () => {
    expect(coolingComponents.length).toBeGreaterThanOrEqual(4)
    expect(coolingComponents.every((component) => component.references.length > 0)).toBe(true)
    expect(coolingComponents.every((component) => component.references.some((reference) => reference.engineCodes?.includes('D16V1')))).toBe(true)
  })

  it('defines an ordered, safety-aware coolant procedure', () => {
    expect(coolantReplacementProcedure.applicableVariants).toContain(variantId)
    expect(coolantReplacementProcedure.warnings?.length).toBeGreaterThan(0)
    expect(coolantReplacementProcedure.steps.map((step) => step.order)).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(coolantReplacementProcedure.references.length).toBeGreaterThan(0)
  })

  it('defines an overheating diagnostic flow for the variant', () => {
    expect(overheatingDiagnostic.applicableVariants).toContain(variantId)
    expect(overheatingDiagnostic.nodes.length).toBeGreaterThanOrEqual(4)
    expect(overheatingDiagnostic.references.length).toBeGreaterThan(0)
  })
})
