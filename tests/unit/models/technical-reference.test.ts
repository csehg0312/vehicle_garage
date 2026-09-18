import { describe, expect, it } from 'vitest'
import {
  type VehicleTechnicalReference,
  validateElectricalSpecification,
  validateFastenerSpecification,
  validateFluidSpecification,
  validateMaintenanceSpecification,
  validateTechnicalReference,
  validateTireSpecification,
  validateTorqueSpecification,
} from '../../../models/technicalReference'

describe('technical reference domain', () => {
  describe('torque specifications', () => {
    it('accepts a simple torque value', () => {
      const spec = {
        id: 'front-caliper-bracket',
        system: 'brakes',
        component: 'Front brake caliper',
        fastener: 'Caliper bracket bolt',
        torque: { value: 108, unit: 'Nm' },
      } as const

      expect(validateTorqueSpecification(spec)).toEqual([])
    })

    it('accepts staged torque plus angle tightening', () => {
      const spec = {
        id: 'cylinder-head',
        system: 'engine',
        component: 'Cylinder head',
        fastener: 'Cylinder head bolts',
        torque: { value: 29, unit: 'Nm' },
        stages: [
          { step: 1, torque: { value: 29, unit: 'Nm' } },
          { step: 2, torque: { value: 49, unit: 'Nm' } },
          { step: 3, angleDeg: 90 },
        ],
        sequence: ['1', '5', '3', '7', '2', '6', '4', '8'],
        conditions: ['Clean and dry threads'],
        fastenerRequirement: { replace: true, lubrication: 'Engine oil' },
      } as const

      expect(validateTorqueSpecification(spec)).toEqual([])
    })

    it('rejects invalid torque and angle values', () => {
      const errors = validateTorqueSpecification({
        id: 'bad',
        system: 'engine',
        component: 'Head',
        fastener: 'Bolt',
        torque: { value: 0, unit: 'Nm' },
        finalAngleDeg: -10,
      })

      expect(errors).toContain('torque value must be positive')
      expect(errors).toContain('final angle must be positive')
    })

    it('rejects duplicate or invalid tightening stages', () => {
      const errors = validateTorqueSpecification({
        id: 'head',
        system: 'engine',
        component: 'Head',
        fastener: 'Bolt',
        stages: [
          { step: 1, torque: { value: 20, unit: 'Nm' } },
          { step: 1, torque: { value: 30, unit: 'Nm' } },
          { step: 0, angleDeg: 90 },
        ],
      })

      expect(errors).toContain('stage steps must be unique')
      expect(errors).toContain('stage steps must be positive integers')
    })

    it('supports a sequence-only tightening instruction when no numeric torque exists', () => {
      const errors = validateTorqueSpecification({
        id: 'special',
        system: 'body',
        component: 'Panel',
        fastener: 'Clip',
        sequence: ['A', 'B'],
      })

      expect(errors).toEqual([])
    })
  })

  it('validates fluid capacities and ranges', () => {
    expect(validateFluidSpecification({
      id: 'coolant',
      system: 'cooling',
      fluid: 'Coolant',
      specification: 'Honda Type 2',
      capacityRangeLitres: { min: 5.2, max: 5.8 },
    })).toEqual([])

    expect(validateFluidSpecification({
      id: 'bad',
      system: 'cooling',
      fluid: '',
      specification: '',
      capacityRangeLitres: { min: 6, max: 5 },
    })).toEqual([
      'fluid is required',
      'specification is required',
      'capacity range min must not exceed max',
    ])
  })

  it('requires an interval for maintenance specifications', () => {
    expect(validateMaintenanceSpecification({
      id: 'oil',
      system: 'engine',
      item: 'Engine oil',
      intervalKm: 15000,
    })).toEqual([])

    expect(validateMaintenanceSpecification({
      id: 'oil',
      system: 'engine',
      item: 'Engine oil',
    })).toContain('at least one maintenance interval is required')
  })

  it('requires tire pressure data', () => {
    expect(validateTireSpecification({
      id: 'front',
      position: 'front',
      size: '205/55 R16',
      pressureKpa: 230,
    })).toEqual([])

    expect(validateTireSpecification({
      id: 'front',
      size: '205/55 R16',
    })).toContain('at least one pressure value is required')
  })

  it('validates electrical pinouts and fuse ratings', () => {
    expect(validateElectricalSpecification({
      id: 'ecu',
      system: 'electrical',
      circuit: 'ECU',
      fuse: 'F15',
      ratingAmps: 15,
      pinout: { 'A1': '12V', 'A2': 'Ground' },
    })).toEqual([])

    expect(validateElectricalSpecification({
      id: 'bad',
      system: 'electrical',
      circuit: 'ECU',
      ratingAmps: 0,
      pinout: { '': '12V' },
    })).toEqual([
      'ratingAmps must be positive',
      'pinout entries must not be empty',
    ])
  })

  it('validates fastener quantity', () => {
    expect(validateFastenerSpecification({
      id: 'wheel',
      system: 'wheels',
      component: 'Wheel',
      fastener: 'Wheel nut',
      quantity: 5,
    })).toEqual([])

    expect(validateFastenerSpecification({
      id: 'wheel',
      system: 'wheels',
      component: 'Wheel',
      fastener: 'Wheel nut',
      quantity: 0,
    })).toContain('quantity must be a positive integer')
  })

  it('aggregates validation errors across the whole technical reference', () => {
    const reference: VehicleTechnicalReference = {
      torqueSpecifications: [{
        id: 'bad-torque',
        system: 'brakes',
        component: '',
        fastener: 'Bolt',
        torque: { value: 0, unit: 'Nm' },
      }],
      fluidSpecifications: [{
        id: 'bad-fluid',
        system: 'cooling',
        fluid: 'Coolant',
        specification: '',
      }],
      maintenanceSpecifications: [{
        id: 'bad-maintenance',
        system: 'engine',
        item: 'Oil',
      }],
      tireSpecifications: [],
      electricalSpecifications: [],
      fastenerSpecifications: [],
    }

    const errors = validateTechnicalReference(reference)

    expect(errors).toContain('torque[bad-torque]: component is required')
    expect(errors).toContain('torque[bad-torque]: torque value must be positive')
    expect(errors).toContain('fluid[bad-fluid]: specification is required')
    expect(errors).toContain(
      'maintenance[bad-maintenance]: at least one maintenance interval is required',
    )
  })
})
