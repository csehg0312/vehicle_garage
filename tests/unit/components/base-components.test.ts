// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseCombobox from '../../../components/base/BaseCombobox.vue'
import BaseDataTable from '../../../components/base/BaseDataTable.vue'
import BaseInput from '../../../components/base/BaseInput.vue'
import BaseSelect from '../../../components/base/BaseSelect.vue'

describe('base components', () => {
  it('renders labeled input and validation message', () => {
    const wrapper = mount(BaseInput, { props: { label: 'Make', modelValue: '', error: 'Make is required' } })

    expect(wrapper.get('label').text()).toContain('Make')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[role="alert"]').text()).toBe('Make is required')
  })

  it('emits input value changes', async () => {
    const wrapper = mount(BaseInput, { props: { label: 'Make', modelValue: '' } })

    await wrapper.get('input').setValue('Honda')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Honda'])
  })

  it('renders select trigger and disabled state', () => {
    const wrapper = mount(BaseSelect, { props: { label: 'Fuel', modelValue: 'Petrol', options: ['Petrol', 'Diesel'], disabled: true } })

    expect(wrapper.get('[role="combobox"]').attributes('aria-label')).toBe('Fuel')
    expect(wrapper.get('[role="combobox"]').attributes('disabled')).toBeDefined()
  })

  it('renders combobox input with accessible label', () => {
    const wrapper = mount(BaseCombobox, { props: { label: 'Make', modelValue: '', options: ['Honda', 'Lada'] } })

    expect(wrapper.get('input').attributes('aria-label')).toBe('Make')
  })

  it('renders table rows and empty state', () => {
    const wrapper = mount(BaseDataTable, {
      props: {
        label: 'Vehicles',
        columns: [{ key: 'make', label: 'Make' }, { key: 'model', label: 'Model' }],
        rows: [{ id: '1', make: 'Honda', model: 'Civic' }],
      },
    })

    expect(wrapper.get('caption').text()).toBe('Vehicles')
    expect(wrapper.get('tbody').text()).toContain('Honda')
    expect(wrapper.get('thead').text()).toContain('Model')
  })

  it('renders table empty state', () => {
    const wrapper = mount(BaseDataTable, { props: { label: 'Vehicles', columns: [], rows: [] } })

    expect(wrapper.get('[data-empty-state]').text()).toBe('No data')
  })
})
