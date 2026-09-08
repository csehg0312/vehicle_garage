import type { KnowledgeIndex } from '../../domain/knowledge'
import { coolingKnowledge } from './cooling'

export { coolingKnowledge } from './cooling'
export { hondaCivicKnowledgeSources } from './sources'

export const hondaCivicKnowledgeIndex: KnowledgeIndex = {
  vehicleId: 'honda-civic-2001-2005-d16v1',
  entries: coolingKnowledge.map(({ id }) => id),
  sources: [
    'honda-civic-service-manual-2001-2005',
    'honda-civic-owner-manual-2001',
    'honda-civic-service-publication-2001-2005',
  ],
}
