import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useVehiclesStore } from '../../../stores/vehicles'

describe('vehicles store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('exposes the seeded vehicles and total ownership cost', () => {
    const store = useVehiclesStore()

    expect(store.vehicles).toHaveLength(2)
    expect(store.totalOwnershipCost).toBe(8081)
  })

  it('finds a vehicle by id and returns undefined for unknown ids', () => {
    const store = useVehiclesStore()

    expect(store.findById('honda-civic')?.model).toBe('Civic')
    expect(store.findById('unknown')).toBeUndefined()
  })

  it('adds a vehicle with a unique id', () => {
    const store = useVehiclesStore()

    const vehicle = store.addVehicle({
      make: 'Honda',
      model: 'Civic',
      year: 2004,
      engine: '1.6 VTEC',
      fuelType: 'Petrol',
      odometer: 120000,
      color: 'Silver',
      ownershipCost: 1000,
    })

    expect(vehicle).toMatchObject({ make: 'Honda', model: 'Civic' })
    expect(vehicle.id).toBeTruthy()
    expect(store.vehicles).toContainEqual(vehicle)
    const { id, ...duplicateVehicle } = vehicle
    expect(store.addVehicle(duplicateVehicle).id).not.toBe(id)
  })

  it('replaces vehicles from a valid backup', () => {
    const store = useVehiclesStore()
    const backup = [{ id: 'backup-car', make: 'Honda', model: 'Jazz', year: 2010, engine: '1.4', fuelType: 'Petrol' as const, odometer: 100000, color: 'Blue', ownershipCost: 2000 }]

    store.replaceVehicles(backup)

    expect(store.vehicles).toEqual(backup)
    expect(() => store.replaceVehicles([{ id: 1 } as never])).toThrow('Backup contains invalid vehicle data')
  })

  it.each([
    ['make', { make: '' }],
    ['model', { model: '' }],
    ['year', { year: 0 }],
    ['odometer', { odometer: -1 }],
    ['ownership cost', { ownershipCost: -1 }],
  ])('rejects an invalid %s', (_field, invalidValues) => {
    const store = useVehiclesStore()
    const validVehicle = {
      make: 'Honda',
      model: 'Civic',
      year: 2004,
      engine: '1.6 VTEC',
      fuelType: 'Petrol' as const,
      odometer: 120000,
      color: 'Silver',
      ownershipCost: 1000,
    }

    expect(() => store.addVehicle({ ...validVehicle, ...invalidValues })).toThrow()
  })
})
