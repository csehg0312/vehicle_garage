import { describe, expect, it } from 'vitest'
import { migrateTechnicalReference } from '../../../models/technicalReferenceMigration'

describe('technical reference migration', () => {
  it('keeps an already structured reference unchanged', () => {
    const reference = {
      torqueSpecifications: [{
        id: 'brake',
        system: 'brakes',
        component: 'Caliper',
        fastener: 'Bracket bolt',
        torque: { value: 108, unit: 'Nm' },
      }],
      fluidSpecifications: [],
      maintenanceSpecifications: [],
      tireSpecifications: [],
      electricalSpecifications: [],
      fastenerSpecifications: [],
    }

    expect(migrateTechnicalReference(reference)).toBe(reference)
  })

  it('migrates legacy torque text without inventing numeric values', () => {
    const result = migrateTechnicalReference({
      torqueValues: 'Front caliper: 108 Nm; rear caliper: 49 Nm',
    })

    expect(result?.torqueSpecifications).toEqual([{
      id: 'legacy-torque-values',
      system: 'other',
      component: 'Legacy torque values',
      fastener: 'Legacy text',
      stages: [{
        step: 1,
        description: 'Front caliper: 108 Nm; rear caliper: 49 Nm',
      }],
      source: {
        kind: 'other',
        title: 'Migrated legacy technical reference',
      },
    }])
  })

  it('maps legacy fluids and preserves oil capacity', () => {
    const result = migrateTechnicalReference({
      engineOil: '5W-30',
      oilCapacityLitres: 3.7,
      coolantType: 'Honda Type 2',
      brakeFluid: 'DOT 4',
    })

    expect(result?.fluidSpecifications).toHaveLength(3)
    expect(result?.fluidSpecifications.find(item => item.id === 'legacy-engine-oil')).toMatchObject({
      fluid: 'Engine oil',
      specification: '5W-30',
      capacityLitres: 3.7,
    })
    expect(result?.fluidSpecifications.find(item => item.id === 'legacy-coolant')?.specification).toBe('Honda Type 2')
    expect(result?.fluidSpecifications.find(item => item.id === 'legacy-brake-fluid')?.specification).toBe('DOT 4')
  })

  it('maps legacy maintenance, tire, electrical and generic fluid text', () => {
    const result = migrateTechnicalReference({
      sparkPlugs: 'Replace every 40,000 km',
      filters: 'Oil and air filters',
      beltChainIntervals: 'Inspect at 100,000 km',
      tireSizesPressures: '205/55 R16, 2.2 bar',
      fuseLocations: 'Under-dash fuse box',
      fluidSpecifications: 'Transmission fluid: Honda MTF',
    })

    expect(result?.maintenanceSpecifications.map(item => item.item)).toEqual([
      'Spark plugs',
      'Filters',
      'Belts / chains',
    ])
    expect(result?.tireSpecifications[0]).toMatchObject({
      size: '205/55 R16, 2.2 bar',
      notes: 'Legacy value; review and split size/pressure data.',
    })
    expect(result?.electricalSpecifications[0].notes).toBe('Under-dash fuse box')
    expect(result?.fluidSpecifications[0].specification).toBe('Honda MTF')
  })

  it('returns undefined when no reference exists', () => {
    expect(migrateTechnicalReference(undefined)).toBeUndefined()
  })
})
