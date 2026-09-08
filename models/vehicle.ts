export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric'

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  engine: string
  fuelType: FuelType
  odometer: number
  color: string
  ownershipCost: number
  manualUrl?: string
}
