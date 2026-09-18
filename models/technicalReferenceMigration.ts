import type {
  ElectricalSpecification,
  FastenerSpecification,
  FluidSpecification,
  MaintenanceSpecification,
  TechnicalSource,
  TireSpecification,
  TorqueSpecification,
  VehicleTechnicalReference,
} from './technicalReference'

export interface LegacyVehicleTechnicalReference {
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

const legacySource: TechnicalSource = {
  kind: 'other',
  title: 'Migrated legacy technical reference',
}

export function migrateTechnicalReference(
  input: LegacyVehicleTechnicalReference | VehicleTechnicalReference | undefined,
): VehicleTechnicalReference | undefined {
  if (!input) return undefined

  if (isStructuredTechnicalReference(input)) return input

  const reference: VehicleTechnicalReference = {
    torqueSpecifications: [],
    fluidSpecifications: [],
    maintenanceSpecifications: [],
    tireSpecifications: [],
    electricalSpecifications: [],
    fastenerSpecifications: [],
  }

  if (input.torqueValues?.trim()) {
    const torque: TorqueSpecification = {
      id: 'legacy-torque-values',
      system: 'other',
      component: 'Legacy torque values',
      fastener: 'Legacy text',
      stages: [{ step: 1, description: input.torqueValues.trim() }],
      source: legacySource,
    }
    reference.torqueSpecifications.push(torque)
  }

  if (input.engineOil?.trim()) {
    reference.fluidSpecifications.push({
      id: 'legacy-engine-oil',
      system: 'engine',
      fluid: 'Engine oil',
      specification: input.engineOil.trim(),
      source: legacySource,
    })
  }

  if (input.coolantType?.trim()) {
    reference.fluidSpecifications.push({
      id: 'legacy-coolant',
      system: 'cooling',
      fluid: 'Coolant',
      specification: input.coolantType.trim(),
      source: legacySource,
    })
  }

  if (input.brakeFluid?.trim()) {
    reference.fluidSpecifications.push({
      id: 'legacy-brake-fluid',
      system: 'brakes',
      fluid: 'Brake fluid',
      specification: input.brakeFluid.trim(),
      source: legacySource,
    })
  }

  if (input.oilCapacityLitres !== undefined && input.oilCapacityLitres !== null) {
    const existing = reference.fluidSpecifications.find(item => item.id === 'legacy-engine-oil')
    if (existing) existing.capacityLitres = input.oilCapacityLitres
    else {
      reference.fluidSpecifications.push({
        id: 'legacy-engine-oil-capacity',
        system: 'engine',
        fluid: 'Engine oil',
        specification: 'Legacy capacity',
        capacityLitres: input.oilCapacityLitres,
        source: legacySource,
      })
    }
  }

  if (input.sparkPlugs?.trim()) {
    reference.maintenanceSpecifications.push({
      id: 'legacy-spark-plugs',
      system: 'engine',
      item: 'Spark plugs',
      intervalDescription: input.sparkPlugs.trim(),
      source: legacySource,
    })
  }

  if (input.filters?.trim()) {
    reference.maintenanceSpecifications.push({
      id: 'legacy-filters',
      system: 'engine',
      item: 'Filters',
      intervalDescription: input.filters.trim(),
      source: legacySource,
    })
  }

  if (input.beltChainIntervals?.trim()) {
    reference.maintenanceSpecifications.push({
      id: 'legacy-belts-chains',
      system: 'engine',
      item: 'Belts / chains',
      intervalDescription: input.beltChainIntervals.trim(),
      source: legacySource,
    })
  }

  if (input.tireSizesPressures?.trim()) {
    reference.tireSpecifications.push({
      id: 'legacy-tires',
      size: input.tireSizesPressures.trim(),
      pressureBar: 1,
      notes: 'Legacy value; pressure placeholder must be reviewed.',
      source: legacySource,
    })
  }

  if (input.fuseLocations?.trim()) {
    reference.electricalSpecifications.push({
      id: 'legacy-fuses',
      system: 'electrical',
      circuit: 'Fuse locations',
      notes: input.fuseLocations.trim(),
      source: legacySource,
    })
  }

  if (input.fluidSpecifications?.trim()) {
    reference.fluidSpecifications.push({
      id: 'legacy-fluids',
      system: 'other',
      fluid: 'Legacy fluid specifications',
      specification: input.fluidSpecifications.trim(),
      source: legacySource,
    })
  }

  return reference
}

function isStructuredTechnicalReference(
  input: LegacyVehicleTechnicalReference | VehicleTechnicalReference,
): input is VehicleTechnicalReference {
  return (
    Array.isArray((input as VehicleTechnicalReference).torqueSpecifications) &&
    Array.isArray((input as VehicleTechnicalReference).fluidSpecifications) &&
    Array.isArray((input as VehicleTechnicalReference).maintenanceSpecifications) &&
    Array.isArray((input as VehicleTechnicalReference).tireSpecifications) &&
    Array.isArray((input as VehicleTechnicalReference).electricalSpecifications) &&
    Array.isArray((input as VehicleTechnicalReference).fastenerSpecifications)
  )
}
