import { defineStore } from 'pinia'
import type { Vehicle } from '../models/vehicle'

export const useVehiclesStore = defineStore('vehicles', {
	state: () => ({
		vehicles: [
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
		] as Vehicle[],
	}),
	getters: {
		totalOwnershipCost: (state) => state.vehicles.reduce((total, vehicle) => total + vehicle.ownershipCost, 0),
		findById: (state) => (id: string) => state.vehicles.find((vehicle) => vehicle.id === id),
	},
})
