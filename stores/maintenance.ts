export type MaintenanceCategoryName = 'Engine' | 'Transmission' | 'Brakes' | 'Suspension' | 'Electrical' | 'Cooling System' | 'Fuel System' | 'Exhaust System' | 'Body & Interior' | 'Tires & Wheels' | 'Other'

export interface MaintenanceCategory {
  id: string
  name: MaintenanceCategoryName
  description?: string
}

export interface MaintenanceRecord {
  id: string
  vehicleId: string
  date: string
  odometer: number
  category: MaintenanceCategory
  description: string
  cost: number
  performedBy: 'owner' | 'workshop'
  notes?: string
}

export const maintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'maintenance-1',
    vehicleId: 'honda-civic',
    date: '2026-09-03',
    odometer: 238412,
    category: { id: 'engine', name: 'Engine' },
    description: 'Oil + filter change',
    cost: 42,
    performedBy: 'owner',
  },
  {
    id: 'maintenance-2',
    vehicleId: 'honda-civic',
    date: '2026-07-22',
    odometer: 236980,
    category: { id: 'brakes', name: 'Brakes' },
    description: 'Front brake pads',
    cost: 91,
    performedBy: 'workshop',
  },
]