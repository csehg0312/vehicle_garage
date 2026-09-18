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
  vin?: string
  registrationPlate?: string
  bodyStyle?: string
  marketCountry?: string
  purchaseDate?: string
  purchasePrice?: number
  insurance?: string
  inspectionExpiry?: string
  registration?: string
  currentValue?: number
  fuelCosts?: number
  technicalData?: VehicleTechnicalData
  technicalReference?: VehicleTechnicalReference
  diagnoses?: VehicleDiagnosis[]
  modifications?: VehicleModification[]
  manualUrl?: string
}

export interface VehicleTechnicalData {
  engineCode: string
  isCustom: boolean
  catalogGeneration: string
  displacementCc: number | null
  cylinders: number | null
  powerHp: number | null
  torqueNm: number | null
  transmission: string
  drivetrain: string
  fuelEconomyCombinedL100: number | null
}

export interface VehicleTechnicalReference {
  engineOil?: string
  oilCapacityLitres?: number | null
  coolantType?: string
  brakeFluid?: string
  sparkPlugs?: string
  filters?: string
  beltChainIntervals?: string
  torqueValues?: string
  tireSizesPressures?: string
  fuseLocations?: string
  fluidSpecifications?: string
}

export interface VehicleDiagnosis {
  id: string
  symptom: string
  firstObservedDate: string
  errorCode?: string
  suspectedCause?: string
  confirmedCause?: string
  repair?: string
  result?: string
  evidenceSource?: string
}

export interface VehicleModification {
  id: string
  partInstalled: string
  date: string
  supplier?: string
  partNumber?: string
  reason?: string
  compatibilityNotes?: string
  originalPartRetained: boolean
}
