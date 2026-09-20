import { defineStore } from 'pinia'
import type { Vehicle } from '../models/vehicle'
import { migrateTechnicalReference, type LegacyVehicleTechnicalReference } from '../models/technicalReferenceMigration'

type NewVehicle = Omit<Vehicle, 'id' | 'manualUrl'>
export const VEHICLES_STORAGE_KEY = 'vehicle-garage:vehicles'

const seededVehicles: Vehicle[] = [
	{
		id: 'honda-civic',
		make: 'Honda',
		model: 'Civic',
		year: 2003,
		engine: '1.6 VTEC',
		fuelType: 'Petrol',
		odometer: 238412,
		color: 'Nighthawk black',
		ownershipCost: 4821,
		manualUrl: '/manuals/honda-civic-2001-2005/index.html',
	},
	{
		id: 'lada-samara',
		make: 'Lada',
		model: 'Samara',
		year: 1998,
		engine: '1.5',
		fuelType: 'Petrol',
		odometer: 174890,
		color: 'Baltic blue',
		ownershipCost: 3260,
	},
]

function readStoredVehicles(): Vehicle[] {
	if (typeof localStorage === 'undefined') return seededVehicles
	try {
		const value = JSON.parse(localStorage.getItem(VEHICLES_STORAGE_KEY) ?? 'null')
		return Array.isArray(value)
			? value.map(migrateVehicle).filter((vehicle): vehicle is Vehicle => vehicle !== undefined)
			: seededVehicles
	} catch {
		return seededVehicles
	}
}

function migrateVehicle(value: unknown): Vehicle | undefined {
	if (!isVehicle(value as Vehicle)) return undefined

	const vehicle = value as Vehicle & {
		technicalReference?: LegacyVehicleTechnicalReference | Vehicle['technicalReference']
	}

	return {
		...vehicle,
		technicalReference: migrateTechnicalReference(vehicle.technicalReference),
	}
}

export const useVehiclesStore = defineStore('vehicles', {
	state: () => ({
		vehicles: readStoredVehicles(),
	}),
	getters: {
		totalOwnershipCost: (state) => state.vehicles.reduce((total, vehicle) => total + vehicle.ownershipCost, 0),
		findById: (state) => (id: string) => state.vehicles.find((vehicle) => vehicle.id === id),
	},
	actions: {
		updateVehicle(id: string, changes: Partial<Omit<Vehicle, 'id'>>) {
			const vehicle = this.vehicles.find((item) => item.id === id)
			if (!vehicle) throw new Error('Vehicle not found')
			Object.assign(vehicle, changes)
			return vehicle
		},
		replaceVehicles(vehicles: Vehicle[]) {
			if (!vehicles.every((vehicle) => isVehicle(vehicle))) throw new Error('Backup contains invalid vehicle data')
			this.vehicles = vehicles
		},
		addVehicle(vehicle: NewVehicle) {
			if (!vehicle.make.trim() || !vehicle.model.trim() || !vehicle.engine.trim() || !vehicle.color.trim()) {
				throw new Error('Make, model, engine, and color are required')
			}
			if (!Number.isInteger(vehicle.year) || vehicle.year <= 0 || vehicle.odometer < 0 || vehicle.ownershipCost < 0) {
				throw new Error('Year, odometer, and ownership cost must be valid non-negative numbers')
			}

			const baseId = `${vehicle.make}-${vehicle.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
			let id = baseId
			let suffix = 2
			while (this.vehicles.some((existingVehicle) => existingVehicle.id === id)) {
				id = `${baseId}-${suffix}`
				suffix += 1
			}

			const newVehicle = { ...vehicle, id }
			this.vehicles.push(newVehicle)
			return newVehicle
		},
	},
})

function isVehicle(value: Vehicle): value is Vehicle {
	return Boolean(value && typeof value.id === 'string' && typeof value.make === 'string' && typeof value.model === 'string' && typeof value.engine === 'string' && typeof value.year === 'number' && typeof value.odometer === 'number' && typeof value.ownershipCost === 'number')
}
