import type { KnowledgeEntry } from '../../domain/knowledge'

const variantId = 'honda-civic-2001-2005-d16v1'
const serviceManual = 'honda-civic-service-manual-2001-2005'
const secondaryCooling = 'honda-civic-d16v1-cooling-secondary'

export const hondaCivicComponentKnowledge: KnowledgeEntry[] = [
  {
    id: 'radiator',
    title: 'Radiator',
    summary: 'Heat exchanger that transfers engine-coolant heat to airflow.',
    category: 'component',
    applicableVariants: [variantId],
    claims: [
      {
        id: 'radiator-role',
        statement: 'The radiator is the primary coolant-to-air heat exchanger in the engine cooling circuit.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'radiator-service-context',
        statement: 'Radiator service should include inspection for leakage, damage and restriction before condemning another cooling-system component.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
    ],
    relatedEntries: ['cooling-system-overview', 'coolant-replacement', 'engine-overheating-diagnosis'],
    sources: [serviceManual],
  },
  {
    id: 'thermostat',
    title: 'Thermostat',
    summary: 'Temperature-controlled valve that regulates coolant circulation during warm-up and normal operation.',
    category: 'component',
    applicableVariants: [variantId],
    claims: [
      {
        id: 'thermostat-regulation',
        statement: 'The thermostat controls coolant flow as engine temperature changes, allowing controlled warm-up before full radiator circulation.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'thermostat-test-range',
        statement: 'The current workshop-data cross-check gives 76-80 °C as the opening range and 90 °C as the fully-open temperature, with at least 8.0 mm valve lift.',
        status: 'partially-verified',
        applicableVariants: [variantId],
        sources: [secondaryCooling],
        notes: 'Retained as a research value until reconciled with the exact primary D16V1 service procedure.',
      },
    ],
    relatedEntries: ['cooling-system-overview', 'cooling-system-service-limits', 'engine-overheating-diagnosis'],
    sources: [serviceManual, secondaryCooling],
  },
  {
    id: 'cooling-fan-switch',
    title: 'Cooling fan switch',
    summary: 'Thermal switch used to request radiator-fan operation at a defined coolant temperature.',
    category: 'component',
    applicableVariants: [variantId],
    claims: [
      {
        id: 'fan-switch-function',
        statement: 'The cooling fan switch changes electrical state at a temperature threshold so the radiator fan circuit can operate when coolant temperature requires additional airflow.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'fan-switch-test-range',
        statement: 'The 2001-2005 Civic workshop cross-check lists 91-95 °C for switch-on and 3-8 °C below the actual switch-on temperature for switch-off.',
        status: 'partially-verified',
        applicableVariants: [variantId],
        sources: [secondaryCooling],
        notes: 'The exact electrical test sequence and terminal assignment remain configuration-specific.',
      },
    ],
    relatedEntries: ['cooling-system-overview', 'd16v1-electrical-system-overview', 'engine-overheating-diagnosis'],
    sources: [serviceManual, secondaryCooling],
  },
  {
    id: 'engine-coolant-temperature-sensor',
    title: 'Engine coolant temperature sensor',
    summary: 'Temperature-sensing component used by the engine-control system for temperature-dependent control and diagnostics.',
    category: 'component',
    applicableVariants: [variantId],
    claims: [
      {
        id: 'ect-sensor-role',
        statement: 'The engine coolant temperature sensing circuit supplies coolant-temperature information to the engine control system.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'ect-diagnostic-scope',
        statement: 'A temperature-sensor fault diagnosis must distinguish the sensor element from connector, harness, supply/ground and ECU-side faults.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
    ],
    relatedEntries: ['d16v1-electrical-system-overview', 'd16v1-electrical-diagnostic-flow', 'engine-overheating-diagnosis'],
    sources: [serviceManual],
  },
]
