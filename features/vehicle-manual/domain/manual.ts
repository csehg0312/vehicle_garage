export interface ManualReference {
  source: string
  title: string
  section?: string
  page?: number
  url?: string
  modelYears?: string[]
  engineCodes?: string[]
  notes?: string
}

export interface VehicleVariant {
  id: string
  market: string
  modelYears: number[]
  chassisCodes: string[]
  bodyStyles: string[]
  engineCodes: string[]
  transmissionCodes?: string[]
}

export interface Specification {
  id: string
  name: string
  value: string | number
  unit?: string
  applicableVariants: string[]
  condition?: string
  references: ManualReference[]
}

export interface VehicleComponent {
  id: string
  name: string
  aliases?: string[]
  system: string
  location?: string
  function?: string
  symptoms?: string[]
  inspectionPoints?: string[]
  relatedProcedures?: string[]
  relatedDiagnostics?: string[]
  references: ManualReference[]
}

export interface ProcedureStep {
  order: number
  title: string
  description: string
}

export interface ServiceProcedure {
  id: string
  title: string
  system: string
  applicableVariants: string[]
  difficulty?: 1 | 2 | 3 | 4 | 5
  estimatedTimeMinutes?: number
  prerequisites?: string[]
  tools?: string[]
  parts?: string[]
  warnings?: string[]
  steps: ProcedureStep[]
  specifications?: Specification[]
  references: ManualReference[]
}

export interface DiagnosticNode {
  id: string
  question: string
  yes?: string
  no?: string
  guidance?: string
}

export interface DiagnosticTree {
  id: string
  symptom: string
  applicableVariants: string[]
  nodes: DiagnosticNode[]
  references: ManualReference[]
}
