import type { KnowledgeCategory } from './knowledge-navigation-types'

export interface KnowledgeRelation {
  targetId: string
  relation:
    | 'part-of'
    | 'contains'
    | 'related-to'
    | 'used-by'
    | 'diagnoses'
    | 'diagnosed-by'
    | 'requires'
    | 'specified-by'
}

export interface KnowledgeNavigationItem {
  id: string
  title: string
  description?: string
  category: KnowledgeCategory
  entryIds: string[]
  icon?: string
}

export interface KnowledgeNavigationModel {
  vehicleId: string
  sections: KnowledgeNavigationItem[]
  pinnedEntryIds?: string[]
  recentEntryIds?: string[]
}
