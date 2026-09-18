// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { useI18n } from '../../../services/i18n'

describe('i18n', () => {
	afterEach(() => useI18n().setLocale('en'))

	it('uses English by default and switches language', () => {
		const { t, locale, setLocale } = useI18n()

		expect(locale.value).toBe('en')
		expect(t('garage.title')).toBe('Garage')
		setLocale('sk')
		expect(t('garage.title')).toBe('Garáž')
		setLocale('hu')
		expect(t('garage.title')).toBe('Garázs')
	})

	it('interpolates translated values', () => {
		const { t, setLocale } = useI18n()
		setLocale('sk')

		expect(t('form.crossBodyWarning', { generation: 'Civic 5 Doors (2001)' })).toContain('Civic 5 Doors (2001)')
	})
})
