import type { DiagnosticTree, ServiceProcedure, Specification, VehicleComponent } from '../../domain/manual'
import { d16v1Variant } from './variants'
import { hondaCivicReferences } from './references'

const variantId = d16v1Variant.id
const serviceReference = { ...hondaCivicReferences.serviceManual, section: 'Cooling', engineCodes: ['D16V1'] }
const ownerReference = { ...hondaCivicReferences.ownerManual, section: 'Maintenance' }

export const coolingSpecifications: Specification[] = [
  {
    id: 'cooling-system-capacity',
    name: 'Cooling system capacity',
    value: 'Requires source verification',
    applicableVariants: [variantId],
    condition: 'Do not use as a fill quantity until confirmed for the exact vehicle configuration.',
    references: [serviceReference],
  },
]

export const coolingComponents: VehicleComponent[] = [
  {
    id: 'radiator',
    name: 'Radiator',
    system: 'Cooling',
    location: 'Front of the engine bay, behind the grille area.',
    function: 'Transfers heat from coolant to airflow through the radiator core.',
    inspectionPoints: ['Check for visible leaks or damage.', 'Inspect fins and hose connections.'],
    relatedProcedures: ['coolant-replacement'],
    relatedDiagnostics: ['engine-overheating'],
    references: [serviceReference],
  },
  {
    id: 'thermostat',
    name: 'Thermostat',
    system: 'Cooling',
    location: 'Mounted in the engine coolant outlet housing.',
    function: 'Controls coolant circulation as engine temperature changes.',
    symptoms: ['Overheating', 'Slow warm-up or temperature regulation concerns'],
    inspectionPoints: ['Use the applicable Honda inspection procedure before replacement.'],
    relatedProcedures: ['coolant-replacement'],
    relatedDiagnostics: ['engine-overheating'],
    references: [serviceReference],
  },
  {
    id: 'cooling-fan',
    name: 'Cooling fan',
    system: 'Cooling',
    location: 'Mounted at the radiator in the engine bay.',
    function: 'Provides forced airflow through the radiator when required.',
    symptoms: ['Overheating at low vehicle speed or while stationary'],
    inspectionPoints: ['Keep hands and tools clear of the fan.', 'Follow the electrical test procedure for the applicable variant.'],
    relatedDiagnostics: ['engine-overheating'],
    references: [serviceReference],
  },
  {
    id: 'engine-coolant-temperature-sensor',
    name: 'Engine coolant temperature sensor',
    aliases: ['ECT sensor'],
    system: 'Cooling',
    location: 'Engine coolant passage; exact location is variant and engine configuration dependent.',
    function: 'Reports coolant temperature to the vehicle control system.',
    inspectionPoints: ['Use the applicable wiring and sensor test procedure before replacing the sensor.'],
    relatedDiagnostics: ['engine-overheating'],
    references: [serviceReference],
  },
]

export const coolantReplacementProcedure: ServiceProcedure = {
  id: 'coolant-replacement',
  title: 'Engine coolant replacement',
  system: 'Cooling',
  applicableVariants: [variantId],
  difficulty: 2,
  estimatedTimeMinutes: 45,
  prerequisites: ['Confirm the exact vehicle variant and coolant requirements.', 'Allow the engine and cooling system to cool sufficiently.'],
  tools: ['Drain pan', 'Funnel', 'Basic hand tools'],
  parts: ['Correct coolant for the vehicle configuration', 'Replacement sealing components if required by the applicable procedure'],
  warnings: ['Never open a hot or pressurized cooling system.', 'Keep coolant away from children and animals and dispose of it according to local rules.'],
  steps: [
    { order: 1, title: 'Prepare the vehicle', description: 'Park safely, secure the vehicle, and prepare a suitable drain pan.' },
    { order: 2, title: 'Allow the system to cool', description: 'Do not continue until the engine and cooling system are sufficiently cool.' },
    { order: 3, title: 'Drain the coolant', description: 'Open the cooling system and drain coolant using the applicable Honda procedure.' },
    { order: 4, title: 'Inspect the system', description: 'Check hoses, connections, radiator condition, and visible leak points.' },
    { order: 5, title: 'Refill the system', description: 'Use the specified coolant and refill method for the applicable vehicle configuration.' },
    { order: 6, title: 'Purge air', description: 'Follow the applicable air-purge procedure and monitor the coolant level.' },
    { order: 7, title: 'Verify operation', description: 'Check for leaks and confirm normal temperature control and cooling fan operation.' },
  ],
  specifications: coolingSpecifications,
  references: [serviceReference, ownerReference],
}

export const overheatingDiagnostic: DiagnosticTree = {
  id: 'engine-overheating',
  symptom: 'Engine overheating',
  applicableVariants: [variantId],
  nodes: [
    { id: 'coolant-level', question: 'Is the coolant level correct?', yes: 'cooling-fan', no: 'Inspect for leaks and follow the coolant service procedure.' },
    { id: 'cooling-fan', question: 'Does the cooling fan operate when required?', yes: 'coolant-circulation', no: 'Perform the applicable electrical and fan circuit diagnosis.' },
    { id: 'coolant-circulation', question: 'Is coolant circulating through the system?', yes: 'thermostat', no: 'Inspect circulation-related components using the Honda procedure.' },
    { id: 'thermostat', question: 'Is thermostat operation confirmed?', yes: 'combustion-gas', no: 'Follow the thermostat inspection and replacement procedure.' },
    { id: 'combustion-gas', question: 'Are there signs of combustion-gas intrusion?', guidance: 'Use an appropriate confirmed test procedure; do not infer a failure from symptoms alone.' },
  ],
  references: [serviceReference],
}
