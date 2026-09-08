export type KnowledgeSourceAuthority =
  | 'primary'
  | 'manufacturer-owner'
  | 'secondary'
  | 'community'
  | 'inference'

export type KnowledgeStatus = 'verified' | 'partially-verified' | 'unverified'

export interface KnowledgeSource {
  id: string
  authority: KnowledgeSourceAuthority
  title: string
  source: string
  url?: string
  section?: string
  page?: number
  modelYears?: string[]
  engineCodes?: string[]
  notes?: string
}

export interface KnowledgeClaim {
  id: string
  statement: string
  status: KnowledgeStatus
  applicableVariants: string[]
  sources: string[]
  notes?: string
}

export interface KnowledgeEntry {
  id: string
  title: string
  summary?: string
  category: 'system' | 'component' | 'procedure' | 'diagnostic' | 'specification'
  applicableVariants: string[]
  claims: KnowledgeClaim[]
  relatedEntries?: string[]
  sources: string[]
  mediaIds?: string[]
}

export interface KnowledgeIndex {
  vehicleId: string
  entries: string[]
  sources: string[]
  lastVerifiedAt?: string
}
