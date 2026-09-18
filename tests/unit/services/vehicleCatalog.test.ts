import { describe, expect, it, vi } from 'vitest'
import { fetchCatalogMakes, fetchCatalogModels, getCatalogGenerationsForYear, getCatalogVariants, getCatalogVariantsForYear, getCatalogYears } from '../../../services/vehicleCatalog'

describe('vehicle catalog', () => {
	it('loads bundled manufacturer index', () => {
		expect(fetchCatalogMakes()).toContainEqual({ id: 'ac', name: 'AC' })
	})

	it('loads models from selected make file', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ makes: [{ models: [{ id: 'skoda:octavia', name: 'Octavia', generations: [] }] }] })))

		await expect(fetchCatalogModels('skoda')).resolves.toEqual([{ id: 'skoda:octavia', name: 'Octavia', generations: [] }])
	})

	it('maps generations and engines into selectable variants', () => {
		const model = { id: 'x', name: 'X', generations: [{ name: 'Gen 1', yearStart: 2000, yearEnd: 2004, engines: [{ label: '1.6 Petrol', fuelType: 'Petrol' }] }] }
		expect(getCatalogVariants(model)).toEqual([
			{ id: 'x:Gen 1:1.6 Petrol', label: 'Gen 1 - 1.6 Petrol', yearStart: 2000, yearEnd: 2004, engine: '1.6 Petrol', fuelType: 'Petrol' },
		])
		expect(getCatalogYears(model)).toEqual([2004, 2003, 2002, 2001, 2000])
		expect(getCatalogVariantsForYear(model, 2002)).toHaveLength(1)
		expect(getCatalogGenerationsForYear(model, 2002)).toEqual(model.generations)
	})
})
