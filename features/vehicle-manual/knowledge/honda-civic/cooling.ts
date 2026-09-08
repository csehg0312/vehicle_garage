import type { KnowledgeEntry } from '../../domain/knowledge'
import { d16v1Variant } from '../../data/honda-civic/variants'

const variantId = d16v1Variant.id
const serviceManual = 'honda-civic-service-manual-2001-2005'
const ownerManual = 'honda-civic-owner-manual-2001'

export const coolingKnowledge: KnowledgeEntry[] = [
  {
    id: 'cooling-system-overview',
    title: 'Cooling system overview',
    summary: 'Knowledge entry for the D16V1 engine cooling system and its principal service-relevant components.',
    category: 'system',
    applicableVariants: [variantId],
    claims: [
      {
        id: 'radiator-function',
        statement: 'The radiator transfers heat from engine coolant to airflow through the radiator core.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'cooling-fan-function',
        statement: 'The radiator cooling fan provides forced airflow through the radiator when additional airflow is required.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'thermostat-function',
        statement: 'The thermostat regulates coolant circulation as engine temperature changes.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'ect-sensor-function',
        statement: 'The engine coolant temperature sensor reports coolant temperature to the vehicle control system.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
    ],
    relatedEntries: ['coolant-replacement', 'engine-overheating-diagnosis', 'cooling-system-capacity'],
    sources: [serviceManual],
  },
  {
    id: 'cooling-system-capacity',
    title: 'Cooling system capacity',
    summary: 'Exact fill quantity is intentionally withheld until verified for the precise D16V1 vehicle and transmission configuration.',
    category: 'specification',
    applicableVariants: [variantId],
    claims: [
      {
        id: 'cooling-capacity-requires-verification',
        statement: 'A cooling-system fill quantity must not be applied until the exact vehicle configuration and corresponding Honda specification are confirmed.',
        status: 'unverified',
        applicableVariants: [variantId],
        sources: [serviceManual],
        notes: 'Migration preserves the existing safety guard instead of inventing a numeric capacity.',
      },
    ],
    sources: [serviceManual],
  },
  {
    id: 'coolant-replacement',
    title: 'Engine coolant replacement',
    summary: 'Safe high-level workflow for draining, inspecting, refilling, purging and verifying the engine cooling system.',
    category: 'procedure',
    applicableVariants: [variantId],
    claims: [
      {
        id: 'coolant-replacement-cold-system',
        statement: 'The cooling system must be allowed to cool sufficiently before it is opened for service.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual, ownerManual],
      },
      {
        id: 'coolant-replacement-inspection',
        statement: 'Coolant replacement is an appropriate service point to inspect hoses, connections, the radiator and visible leak points.',
        status: 'partially-verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
        notes: 'The detailed inspection checklist should be expanded from the exact D16V1 workshop procedure.',
      },
      {
        id: 'coolant-replacement-air-purge',
        statement: 'After refill, trapped air must be removed using the procedure applicable to the vehicle configuration and coolant level must be rechecked.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'coolant-replacement-final-verification',
        statement: 'After service, verify that there are no visible leaks and that temperature regulation and cooling-fan operation are normal.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
    ],
    relatedEntries: ['cooling-system-overview', 'engine-overheating-diagnosis'],
    sources: [serviceManual, ownerManual],
  },
  {
    id: 'engine-overheating-diagnosis',
    title: 'Engine overheating diagnosis',
    summary: 'Diagnostic knowledge migrated from the existing overheating tree without treating symptoms alone as proof of component failure.',
    category: 'diagnostic',
    applicableVariants: [variantId],
    claims: [
      {
        id: 'overheating-check-coolant-level',
        statement: 'Coolant level and evidence of leakage are basic checks when diagnosing an overheating complaint.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'overheating-check-fan',
        statement: 'Cooling-fan operation and its electrical circuit should be checked when overheating occurs, particularly when airflow is limited.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'overheating-check-circulation',
        statement: 'Coolant circulation and thermostat operation are relevant checks when diagnosing overheating.',
        status: 'verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
      },
      {
        id: 'overheating-combustion-gas',
        statement: 'Possible combustion-gas intrusion must be confirmed with an appropriate test rather than inferred from symptoms alone.',
        status: 'partially-verified',
        applicableVariants: [variantId],
        sources: [serviceManual],
        notes: 'Exact Honda diagnostic sequence and approved test method still require D16V1-specific extraction.',
      },
    ],
    relatedEntries: ['cooling-system-overview', 'coolant-replacement'],
    sources: [serviceManual],
  },
]
