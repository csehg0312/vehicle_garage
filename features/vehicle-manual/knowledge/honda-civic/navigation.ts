import type { KnowledgeNavigationModel } from '../../domain/knowledge-navigation'

const vehicleId = 'honda-civic-2001-2005-d16v1'

/**
 * Minimal user-facing information architecture for the Civic knowledge base.
 * Entry IDs remain the source of truth; this file only defines useful ways to enter the graph.
 */
export const hondaCivicKnowledgeNavigation: KnowledgeNavigationModel = {
  vehicleId,
  sections: [
    {
      id: 'systems',
      title: 'Systems',
      description: 'Understand how the vehicle system works and how its components relate.',
      category: 'system',
      entryIds: [
        'cooling-system-overview',
        'd16v1-electrical-system-overview',
      ],
    },
    {
      id: 'service',
      title: 'Service',
      description: 'Perform maintenance and repair procedures.',
      category: 'procedure',
      entryIds: [
        'coolant-replacement',
      ],
    },
    {
      id: 'diagnostics',
      title: 'Diagnostics',
      description: 'Start from a symptom and follow the relevant diagnostic knowledge.',
      category: 'diagnostic',
      entryIds: [
        'engine-overheating-diagnosis',
        'd16v1-electrical-diagnostic-flow',
      ],
    },
    {
      id: 'components',
      title: 'Components',
      description: 'Explore individual cooling-system components and their relationships.',
      category: 'component',
      entryIds: [
        'radiator',
        'thermostat',
        'cooling-fan-switch',
        'engine-coolant-temperature-sensor',
      ],
    },
    {
      id: 'specifications',
      title: 'Specifications',
      description: 'Find capacities, service limits and critical workshop values.',
      category: 'specification',
      entryIds: [
        'cooling-system-capacity',
        'cooling-system-service-limits',
        'd16v1-cooling-service-values',
        'd16v1-critical-fasteners',
      ],
    },
  ],
  pinnedEntryIds: [
    'engine-overheating-diagnosis',
    'cooling-system-capacity',
  ],
}
