import type { KnowledgeEntry } from './knowledge'

export type KnowledgeRelationType =
  | 'part-of'
  | 'contains'
  | 'related-to'
  | 'used-by'
  | 'diagnoses'
  | 'diagnosed-by'
  | 'requires'
  | 'specified-by'

export interface KnowledgeRelation {
  targetId: string
  relation: KnowledgeRelationType
}

export interface KnowledgeNavigationItem {
  id: string
  title: string
  description?: string
  category: KnowledgeEntry['category']
  entryIds: string[]
  icon?: string
}

export interface KnowledgeNavigationModel {
  vehicleId: string
  sections: KnowledgeNavigationItem[]
  pinnedEntryIds?: string[]
  recentEntryIds?: string[]
}
