import { describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { maintenanceRecords } from '../../stores/maintenance'
import { useVehiclesStore } from '../../stores/vehicles'

describe('garage data', () => {
  it('links every maintenance record to a known vehicle', () => {
    setActivePinia(createPinia())
    const vehiclesStore = useVehiclesStore()

    for (const record of maintenanceRecords) {
      expect(vehiclesStore.findById(record.vehicleId)).toBeDefined()
    }
  })
})