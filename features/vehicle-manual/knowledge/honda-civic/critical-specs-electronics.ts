import type { KnowledgeEntry } from '../../domain/knowledge'

const variantId = 'honda-civic-2001-2005-d16v1'
const serviceManual = 'honda-civic-service-manual-2001-2005'
const secondaryCooling = 'honda-civic-d16v1-cooling-secondary'

/**
 * Compact workshop reference for values that should be easy to find during service.
 * Safety-critical values remain explicitly scoped/verified rather than being presented
 * as universal D16V1 values until the exact transmission/body configuration is resolved.
 */
export const hondaCivicCriticalSpecsElectronics: KnowledgeEntry[] = [
  {
    id: 'd16v1-critical-fasteners',
    title: 'Critical fasteners and torque reference',
    summary: 'Short index of high-value fastener information. Exact values are retained only where the current research evidence is strong enough; unresolved values remain flagged for primary-manual verification.',
    category: 'specification',
    applicableVariants: [variantId],
    claims: [
      {
        id: 'cooling-drain-plug-torque',
        statement: 'Cooling-system drain-plug torque must be taken from the exact D16V1 workshop procedure; the current knowledge base does not promote an unverified value to a service instruction.',
        status: 'unverified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'wheel-nut-torque',
        statement: 'Wheel-nut torque is configuration- and wheel-dependent and must be verified against the applicable Honda specification before use.',
        status: 'unverified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'critical-fastener-policy',
        statement: 'Cylinder-head, connecting-rod, crankshaft and other torque-to-yield or engine-internal fasteners must not be populated from generic Civic values; they require exact engine-specific primary-source verification.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
        notes: 'This is a knowledge-base safety rule, not a substitute torque specification.',
      },
    ],
    relatedEntries: ['cooling-system-service-limits'],
    sources: [serviceManual],
  },
  {
    id: 'd16v1-cooling-service-values',
    title: 'Cooling service values',
    summary: 'Compact reference to the values already cross-checked during the cooling-system research pass.',
    category: 'specification',
    applicableVariants: [variantId],
    claims: [
      {
        id: 'radiator-cap-pressure-reference',
        statement: 'Radiator-cap opening pressure: 93-123 kPa (0.95-1.25 kgf/cm², 14-18 psi) in the current secondary cross-check.',
        status: 'partially-verified',
        applicableVariants: [variantId],
        sources: [secondaryCooling],
        notes: 'Verify against the exact primary Honda specification before using as a final acceptance limit.',
      },
      {
        id: 'thermostat-reference',
        statement: 'Thermostat begins opening at 76-80 °C, is fully open at 90 °C, with at least 8.0 mm valve lift at full opening in the current secondary cross-check.',
        status: 'partially-verified',
        applicableVariants: [variantId],
        sources: [secondaryCooling],
        notes: 'Verify against the exact D16V1 primary procedure.',
      },
    ],
    relatedEntries: ['cooling-system-overview', 'cooling-system-service-limits'],
    sources: [secondaryCooling, serviceManual],
  },
  {
    id: 'd16v1-electrical-system-overview',
    title: 'Electrical system: short diagnostic map',
    summary: 'Compact architecture map for the engine-management electrical system discussed previously: power supply, grounds, sensors, actuators and ECU signal paths.',
    category: 'system',
    applicableVariants: [variantId],
    claims: [
      {
        id: 'electrical-power-ground-foundation',
        statement: 'Electrical diagnosis should start with battery/charging supply, relevant fuses and relays, and engine/body grounds before condemning an ECU or sensor.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'ect-signal-path',
        statement: 'The engine coolant temperature sensing circuit provides temperature information to the engine control system and is relevant to cooling-fan and fuel-control diagnostics.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'sensor-diagnostic-principle',
        statement: 'A sensor fault should be distinguished between sensor element failure, wiring/connector failure, power or ground problems, and ECU-side circuit faults by measuring the circuit rather than replacing parts based only on a symptom.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'wiring-diagram-authority',
        statement: 'Connector pinouts, wire colors, terminal assignments and ECU circuit details must be taken from the exact applicable wiring diagram rather than inferred from generic D16-family diagrams.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
    ],
    relatedEntries: ['engine-overheating-diagnosis', 'cooling-system-overview'],
    sources: [serviceManual],
  },
  {
    id: 'd16v1-electrical-diagnostic-flow',
    title: 'Electrical diagnostic flow',
    summary: 'A short, repeatable sequence for electrical troubleshooting before component replacement.',
    category: 'diagnostic',
    applicableVariants: [variantId],
    claims: [
      {
        id: 'electrical-flow-symptom',
        statement: 'Define the symptom and operating condition first: cold/hot engine, starting/running, load, intermittent or permanent fault.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'electrical-flow-supply',
        statement: 'Check battery voltage/charging condition, fuses, relays and grounds relevant to the affected circuit.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'electrical-flow-connector',
        statement: 'Inspect connectors and harness routing for corrosion, looseness, broken conductors, damaged insulation and poor terminal contact.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'electrical-flow-measurement',
        statement: 'Measure the relevant voltage, resistance, continuity or signal against the exact service-manual test condition before replacing the component.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'electrical-flow-ecu-last',
        statement: 'Treat ECU failure as a conclusion reached after the external power, ground, wiring, connector and component checks have been satisfied.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
    ],
    relatedEntries: ['d16v1-electrical-system-overview'],
    sources: [serviceManual],
  },
]
