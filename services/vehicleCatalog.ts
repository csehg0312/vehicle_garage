import catalogIndex from '../data/vehicle-catalog/index.json'

export interface CatalogMake {
	id: string
	name: string
}

export interface CatalogModel {
	id?: string
	name: string
	yearStart?: number
	yearEnd?: number | null
	generations: CatalogGeneration[]
}

export interface CatalogGeneration {
	name: string
	yearStart: number
	yearEnd: number | null
	bodyType?: string | null
	engines: CatalogEngine[]
}

export interface CatalogEngine {
	label: string
	fuelType: string | null
	displacementCc?: number | null
	cylinders?: number | null
	powerHp?: number | null
	torqueNm?: number | null
	transmission?: string | null
	drivetrain?: string | null
	fuelEconomyCombinedL100?: number | null
}

export interface CatalogVariant {
	id: string
	label: string
	yearStart: number
	yearEnd: number | null
	engine: string
	fuelType: string | null
}

const rawCatalogBase = 'https://raw.githubusercontent.com/gor3a/vehicle-makes-models/main/data/json'

export function fetchCatalogMakes(): CatalogMake[] {
	return catalogIndex.flatMap((group) => group.makes.map((make) => ({ id: group.group, name: make.name })))
}

export async function fetchCatalogModels(makeId: string, signal?: AbortSignal): Promise<CatalogModel[]> {
	const response = await fetch(`${rawCatalogBase}/${encodeURIComponent(makeId)}.json`, { signal })
	if (!response.ok) throw new Error(`Vehicle catalog lookup failed (${response.status})`)
	const data = await response.json() as { makes?: Array<{ models?: CatalogModel[] }> }
	return data.makes?.flatMap((make) => make.models ?? []) ?? []
}

export function getCatalogVariants(model: CatalogModel): CatalogVariant[] {
	return model.generations.flatMap((generation) => generation.engines.map((engine) => ({
		id: `${model.id}:${generation.name}:${engine.label}`,
		label: `${generation.name} - ${engine.label}`,
		yearStart: generation.yearStart,
		yearEnd: generation.yearEnd,
		engine: engine.label,
		fuelType: engine.fuelType,
	})))
}

export function getCatalogYears(model: CatalogModel): number[] {
	return [...new Set(getCatalogVariants(model).flatMap((variant) => Array.from({ length: (variant.yearEnd ?? new Date().getFullYear()) - variant.yearStart + 1 }, (_, index) => variant.yearStart + index)))].sort((a, b) => b - a)
}

export function getCatalogVariantsForYear(model: CatalogModel, year: number): CatalogVariant[] {
	return getCatalogVariants(model).filter((variant) => year >= variant.yearStart && (!variant.yearEnd || year <= variant.yearEnd))
}

export function getCatalogGenerationsForYear(model: CatalogModel, year: number): CatalogGeneration[] {
	return model.generations.filter((generation) => year >= generation.yearStart && (!generation.yearEnd || year <= generation.yearEnd))
}
