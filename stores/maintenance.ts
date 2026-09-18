import { defineStore } from 'pinia'

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
  partsFluids?: string
  nextServiceDue?: string
  receiptUrl?: string
  notes?: string
}

export const MAINTENANCE_STORAGE_KEY = 'vehicle-garage:maintenance'

const seededMaintenanceRecords: MaintenanceRecord[] = [
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

export const maintenanceRecords = seededMaintenanceRecords

function readStoredRecords(): MaintenanceRecord[] {
	if (typeof localStorage === 'undefined') return seededMaintenanceRecords.map((record) => ({ ...record, category: { ...record.category } }))
	try {
		const value = JSON.parse(localStorage.getItem(MAINTENANCE_STORAGE_KEY) ?? 'null')
		return Array.isArray(value) ? value : seededMaintenanceRecords.map((record) => ({ ...record, category: { ...record.category } }))
	} catch {
		return seededMaintenanceRecords.map((record) => ({ ...record, category: { ...record.category } }))
	}
}

export const useMaintenanceStore = defineStore('maintenance', {
	state: () => ({ records: readStoredRecords() }),
	actions: {
		addRecord(record: Omit<MaintenanceRecord, 'id'>) {
			if (!record.vehicleId || !record.date || !record.description.trim() || record.odometer < 0 || record.cost < 0) throw new Error('Date, description, odometer, and cost are required')
			const newRecord = { ...record, id: `maintenance-${Date.now()}` }
			this.records.unshift(newRecord)
			return newRecord
		},
		replaceRecords(records: MaintenanceRecord[]) {
			if (!records.every(isMaintenanceRecord)) throw new Error('Backup contains invalid maintenance records')
			this.records = records
		},
	},
})

export function isMaintenanceRecord(value: unknown): value is MaintenanceRecord {
	const record = value as MaintenanceRecord | null
	return Boolean(record && typeof record.id === 'string' && typeof record.vehicleId === 'string' && typeof record.date === 'string' && typeof record.odometer === 'number' && record.odometer >= 0 && typeof record.description === 'string' && record.description.trim() && typeof record.cost === 'number' && record.cost >= 0 && (record.performedBy === 'owner' || record.performedBy === 'workshop') && record.category && typeof record.category.id === 'string' && typeof record.category.name === 'string')
}
