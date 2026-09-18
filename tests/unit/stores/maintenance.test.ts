import { describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { maintenanceRecords, useMaintenanceStore } from '../../../stores/maintenance'

describe('maintenance records', () => {
  it('contains records with the required maintenance fields', () => {
    expect(maintenanceRecords.length).toBeGreaterThan(0)

    for (const record of maintenanceRecords) {
      expect(record.id).toMatch(/^maintenance-/)
      expect(record.vehicleId).toBeTruthy()
      expect(record.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(record.odometer).toBeGreaterThan(0)
      expect(record.category.id).toBeTruthy()
      expect(record.category.name).toBeTruthy()
      expect(record.description).toBeTruthy()
      expect(record.cost).toBeGreaterThanOrEqual(0)
      expect(['owner', 'workshop']).toContain(record.performedBy)
    }
  })

  it('keeps maintenance record identifiers unique', () => {
    const ids = maintenanceRecords.map((record) => record.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('adds a maintenance record for a vehicle', () => {
    setActivePinia(createPinia())
    const store = useMaintenanceStore()

    const record = store.addRecord({ vehicleId: 'honda-civic', date: '2026-09-18', odometer: 239000, category: { id: 'engine', name: 'Engine' }, description: 'Coolant check', cost: 12, performedBy: 'owner' })

    expect(record.description).toBe('Coolant check')
    expect(store.records[0]).toEqual(record)
  })
})
