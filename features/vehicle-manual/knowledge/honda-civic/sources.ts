import type { KnowledgeSource } from '../../domain/knowledge'

export const hondaCivicKnowledgeSources: KnowledgeSource[] = [
  {
    id: 'honda-civic-service-manual-2001-2005',
    authority: 'primary',
    source: 'Honda / Helm',
    title: '2001-2005 Civic Service Manual, item 61S5C01',
    url: 'https://www.helminc.com/helm/product2.asp?Sku=61S5C01&class_2=AHM&itemtype=N',
    modelYears: ['2001-2005'],
    engineCodes: ['D16V1'],
    notes: 'Primary repair and specification source. Exact vehicle configuration must be verified before applying a value or procedure.',
  },
  {
    id: 'honda-civic-owner-manual-2001',
    authority: 'manufacturer-owner',
    source: 'Honda',
    title: "2001 Honda Civic Owner's Manual",
    url: 'https://owners.honda.com/assets/ownerlink/model/own_man/2001hondacivic.pdf',
    modelYears: ['2001'],
    notes: 'Manufacturer maintenance guidance and warnings. Not a substitute for workshop procedures; US-market configuration may differ from European D16V1 applications.',
  },
  {
    id: 'honda-civic-service-publication-2001-2005',
    authority: 'secondary',
    source: 'iFixit',
    title: '2001-2005 Honda Civic Service Publication',
    url: 'https://nl.ifixit.com/Document/uuRhO5drfGRxBs3U/2001_2005-Honda-Civic-WM.pdf',
    modelYears: ['2001-2005'],
    notes: 'Research copy for cross-checking. Honda documentation remains authoritative.',
  },
  {
    id: 'honda-civic-d16v1-cooling-secondary',
    authority: 'secondary',
    source: 'Civic Coupe and Sedan Service Manual Supplement mirror',
    title: 'Cooling standards and service limits for 2001 Civic D-series applications',
    url: 'https://pdfcoffee.com/civic-coupe-and-sedan-supplement-pdf-free.html',
    modelYears: ['2001-2005'],
    engineCodes: ['D16V1'],
    section: 'Cooling / Standards and Service Limits',
    notes: 'Secondary copy used to cross-check values. Exact D16V1 EU application should be reconciled against the primary Honda manual before treating values as final.',
  },
]
