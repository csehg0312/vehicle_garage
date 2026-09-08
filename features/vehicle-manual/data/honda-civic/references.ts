import type { ManualReference } from '../../domain/manual'

export const hondaCivicReferences: Record<string, ManualReference> = {
  serviceManual: {
    source: 'Honda / Helm',
    title: '2001-2005 Civic Service Manual, item 61S5C01',
    url: 'https://www.helminc.com/helm/product2.asp?Sku=61S5C01&class_2=AHM&itemtype=N',
    modelYears: ['2001-2005'],
    notes: 'Primary structural reference. Verify variant-specific values in the licensed manual.',
  },
  ownerManual: {
    source: 'Honda',
    title: '2001 Honda Civic Owner\'s Manual',
    url: 'https://owners.honda.com/assets/ownerlink/model/own_man/2001hondacivic.pdf',
    modelYears: ['2001'],
    notes: 'Owner-level maintenance and warnings; not a substitute for workshop procedures.',
  },
  servicePublication: {
    source: 'iFixit',
    title: '2001-2005 Honda Civic Service Publication',
    url: 'https://nl.ifixit.com/Document/uuRhO5drfGRxBs3U/2001_2005-Honda-Civic-WM.pdf',
    modelYears: ['2001-2005'],
    notes: 'Research copy for cross-checking; Honda documentation remains authoritative.',
  },
}
