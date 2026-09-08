import type { VehicleVariant } from '../../domain/manual'

export const d16v1Variant: VehicleVariant = {
  id: 'honda-civic-2001-2005-d16v1',
  market: 'European market',
  modelYears: [2001, 2002, 2003, 2004, 2005],
  chassisCodes: [],
  bodyStyles: ['Hatchback', 'Sedan', 'Coupe'],
  engineCodes: ['D16V1'],
}

export const hondaCivicVariants: VehicleVariant[] = [d16v1Variant]
