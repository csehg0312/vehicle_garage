export type TorqueUnit = 'Nm' | 'lb-ft' | 'kgf-m'
export type AngleUnit = 'deg'
export type VehicleSystem =
  | 'engine'
  | 'transmission'
  | 'drivetrain'
  | 'brakes'
  | 'suspension'
  | 'steering'
  | 'body'
  | 'electrical'
  | 'cooling'
  | 'fuel'
  | 'exhaust'
  | 'intake'
  | 'hvac'
  | 'wheels'
  | 'other'

export type TechnicalSourceKind =
  | 'manufacturer-manual'
  | 'service-manual'
  | 'owner-manual'
  | 'parts-catalog'
  | 'technical-bulletin'
  | 'measurement'
  | 'web'
  | 'other'

export interface TechnicalSource {
  kind: TechnicalSourceKind
  title: string
  url?: string
  reference?: string
  page?: string
  note?: string
}

export interface TorqueValue {
  value: number
  unit: TorqueUnit
}

export interface TorqueStage {
  step: number
  torque?: TorqueValue
  angleDeg?: number
  description?: string
}

export interface TorqueSpecification {
  id: string
  system: VehicleSystem
  component: string
  fastener: string
  torque?: TorqueValue
  stages?: TorqueStage[]
  finalAngleDeg?: number
  sequence?: string[]
  conditions?: string[]
  fastenerRequirement?: {
    replace: boolean
    threadlocker?: string
    lubrication?: string
  }
  notes?: string
  source?: TechnicalSource
}

export interface FluidSpecification {
  id: string
  system: VehicleSystem
  fluid: string
  specification: string
  capacityLitres?: number
  capacityRangeLitres?: {
    min: number
    max: number
  }
  fillProcedure?: string
  conditions?: string[]
  source?: TechnicalSource
}

export interface MaintenanceSpecification {
  id: string
  system: VehicleSystem
  item: string
  intervalKm?: number
  intervalMonths?: number
  intervalDescription?: string
  conditions?: string[]
  notes?: string
  source?: TechnicalSource
}

export interface TireSpecification {
  id: string
  position?: 'front' | 'rear' | 'all'
  size: string
  loadIndex?: string
  speedRating?: string
  pressureKpa?: number
  pressurePsi?: number
  pressureBar?: number
  conditions?: string[]
  notes?: string
  source?: TechnicalSource
}

export interface ElectricalSpecification {
  id: string
  system: VehicleSystem
  circuit: string
  fuse?: string
  relay?: string
  ratingAmps?: number
  connector?: string
  pinout?: Record<string, string>
  notes?: string
  source?: TechnicalSource
}

export interface FastenerSpecification {
  id: string
  system: VehicleSystem
  component: string
  fastener: string
  thread?: string
  grade?: string
  material?: string
  quantity?: number
  replacementRequired?: boolean
  threadlocker?: string
  lubrication?: string
  notes?: string
  source?: TechnicalSource
}

export interface VehicleTechnicalReference {
  torqueSpecifications: TorqueSpecification[]
  fluidSpecifications: FluidSpecification[]
  maintenanceSpecifications: MaintenanceSpecification[]
  tireSpecifications: TireSpecification[]
  electricalSpecifications: ElectricalSpecification[]
  fastenerSpecifications: FastenerSpecification[]
}

const isPositive = (value: number | undefined): boolean =>
  value === undefined || (Number.isFinite(value) && value > 0)

const nonEmpty = (value: string): boolean => value.trim().length > 0

export function validateTorqueSpecification(spec: TorqueSpecification): string[] {
  const errors: string[] = []

  if (!nonEmpty(spec.id)) errors.push('id is required')
  if (!nonEmpty(spec.component)) errors.push('component is required')
  if (!nonEmpty(spec.fastener)) errors.push('fastener is required')

  if (spec.torque && !isPositive(spec.torque.value)) {
    errors.push('torque value must be positive')
  }

  if (!spec.torque && (!spec.stages || spec.stages.length === 0)) {
    errors.push('torque or stages is required')
  }

  if (spec.finalAngleDeg !== undefined && !isPositive(spec.finalAngleDeg)) {
    errors.push('final angle must be positive')
  }

  if (spec.stages) {
    if (spec.stages.length === 0) errors.push('stages must not be empty')

    const steps = spec.stages.map(stage => stage.step)
    const uniqueSteps = new Set(steps)

    if (uniqueSteps.size !== steps.length) errors.push('stage steps must be unique')
    if (steps.some(step => !Number.isInteger(step) || step < 1)) {
      errors.push('stage steps must be positive integers')
    }

    spec.stages.forEach(stage => {
      if (stage.torque && !isPositive(stage.torque.value)) {
        errors.push(`stage ${stage.step} torque must be positive`)
      }
      if (stage.angleDeg !== undefined && !isPositive(stage.angleDeg)) {
        errors.push(`stage ${stage.step} angle must be positive`)
      }
      if (stage.description !== undefined && !nonEmpty(stage.description)) {
        errors.push(`stage ${stage.step} description must not be empty`)
      }
    })
  }

  if (spec.sequence && spec.sequence.length === 0) {
    errors.push('sequence must not be empty')
  }

  spec.conditions?.forEach((condition, index) => {
    if (!nonEmpty(condition)) errors.push(`condition ${index} must not be empty`)
  })

  return errors
}

export function validateFluidSpecification(spec: FluidSpecification): string[] {
  const errors: string[] = []
  if (!nonEmpty(spec.id)) errors.push('id is required')
  if (!nonEmpty(spec.fluid)) errors.push('fluid is required')
  if (!nonEmpty(spec.specification)) errors.push('specification is required')

  if (!isPositive(spec.capacityLitres)) errors.push('capacity must be positive')
  if (spec.capacityRangeLitres) {
    const { min, max } = spec.capacityRangeLitres
    if (!isPositive(min) || !isPositive(max)) errors.push('capacity range values must be positive')
    if (min > max) errors.push('capacity range min must not exceed max')
  }

  return errors
}

export function validateMaintenanceSpecification(spec: MaintenanceSpecification): string[] {
  const errors: string[] = []
  if (!nonEmpty(spec.id)) errors.push('id is required')
  if (!nonEmpty(spec.item)) errors.push('item is required')

  if (!isPositive(spec.intervalKm)) errors.push('intervalKm must be positive')
  if (!isPositive(spec.intervalMonths)) errors.push('intervalMonths must be positive')

  if (
    spec.intervalKm === undefined &&
    spec.intervalMonths === undefined &&
    !spec.intervalDescription?.trim()
  ) {
    errors.push('at least one maintenance interval is required')
  }

  return errors
}

export function validateTireSpecification(spec: TireSpecification): string[] {
  const errors: string[] = []
  if (!nonEmpty(spec.id)) errors.push('id is required')
  if (!nonEmpty(spec.size)) errors.push('size is required')

  if (!isPositive(spec.pressureKpa)) errors.push('pressureKpa must be positive')
  if (!isPositive(spec.pressurePsi)) errors.push('pressurePsi must be positive')
  if (!isPositive(spec.pressureBar)) errors.push('pressureBar must be positive')

  if (
    spec.pressureKpa === undefined &&
    spec.pressurePsi === undefined &&
    spec.pressureBar === undefined
  ) {
    errors.push('at least one pressure value is required')
  }

  return errors
}

export function validateElectricalSpecification(spec: ElectricalSpecification): string[] {
  const errors: string[] = []
  if (!nonEmpty(spec.id)) errors.push('id is required')
  if (!nonEmpty(spec.circuit)) errors.push('circuit is required')
  if (!isPositive(spec.ratingAmps)) errors.push('ratingAmps must be positive')

  if (spec.pinout) {
    Object.entries(spec.pinout).forEach(([pin, signal]) => {
      if (!nonEmpty(pin) || !nonEmpty(signal)) errors.push('pinout entries must not be empty')
    })
  }

  return errors
}

export function validateFastenerSpecification(spec: FastenerSpecification): string[] {
  const errors: string[] = []
  if (!nonEmpty(spec.id)) errors.push('id is required')
  if (!nonEmpty(spec.component)) errors.push('component is required')
  if (!nonEmpty(spec.fastener)) errors.push('fastener is required')

  if (spec.quantity !== undefined && (!Number.isInteger(spec.quantity) || spec.quantity < 1)) {
    errors.push('quantity must be a positive integer')
  }

  return errors
}

export function validateTechnicalReference(reference: VehicleTechnicalReference): string[] {
  return [
    ...reference.torqueSpecifications.flatMap(spec =>
      validateTorqueSpecification(spec).map(error => `torque[${spec.id}]: ${error}`),
    ),
    ...reference.fluidSpecifications.flatMap(spec =>
      validateFluidSpecification(spec).map(error => `fluid[${spec.id}]: ${error}`),
    ),
    ...reference.maintenanceSpecifications.flatMap(spec =>
      validateMaintenanceSpecification(spec).map(error => `maintenance[${spec.id}]: ${error}`),
    ),
    ...reference.tireSpecifications.flatMap(spec =>
      validateTireSpecification(spec).map(error => `tire[${spec.id}]: ${error}`),
    ),
    ...reference.electricalSpecifications.flatMap(spec =>
      validateElectricalSpecification(spec).map(error => `electrical[${spec.id}]: ${error}`),
    ),
    ...reference.fastenerSpecifications.flatMap(spec =>
      validateFastenerSpecification(spec).map(error => `fastener[${spec.id}]: ${error}`),
    ),
  ]
}
