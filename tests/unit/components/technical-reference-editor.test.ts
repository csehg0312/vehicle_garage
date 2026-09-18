// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TechnicalReferenceEditor from '../../../components/vehicle/TechnicalReferenceEditor.vue'

const reference = {
  torqueSpecifications: [{
    id: 'front-caliper',
    system: 'brakes' as const,
    component: 'Front brake caliper',
    fastener: 'Mounting bolt',
    torque: { value: 108, unit: 'Nm' as const },
    conditions: ['Clean and dry threads'],
  }],
  fluidSpecifications: [{
    id: 'engine-oil',
    system: 'engine' as const,
    fluid: 'Engine oil',
    specification: '5W-30',
    capacityLitres: 3.7,
  }],
  maintenanceSpecifications: [{
    id: 'spark-plugs',
    system: 'engine' as const,
    item: 'Spark plugs',
    intervalKm: 40000,
  }],
  tireSpecifications: [{
    id: 'all-season',
    position: 'all' as const,
    size: '205/55 R16',
    pressureBar: 2.2,
  }],
  electricalSpecifications: [{
    id: 'fuel-pump',
    system: 'fuel' as const,
    circuit: 'Fuel pump',
    fuse: 'Fuse 15',
    ratingAmps: 15,
  }],
  fastenerSpecifications: [{
    id: 'wheel-bolt',
    system: 'wheels' as const,
    component: 'Wheel',
    fastener: 'Wheel nut',
    thread: 'M12 x 1.5',
    quantity: 5,
  }],
}

describe('TechnicalReferenceEditor', () => {
  it('renders each structured technical reference category', () => {
    const wrapper = mount(TechnicalReferenceEditor, {
      props: { modelValue: reference },
    })

    expect(wrapper.find('[data-section="torque"]').text()).toContain('Front brake caliper')
    expect(wrapper.find('[data-section="fluids"]').text()).toContain('5W-30')
    expect(wrapper.find('[data-section="maintenance"]').text()).toContain('Spark plugs')
    expect(wrapper.find('[data-section="tires"]').text()).toContain('205/55 R16')
    expect(wrapper.find('[data-section="electrical"]').text()).toContain('Fuel pump')
    expect(wrapper.find('[data-section="fasteners"]').text()).toContain('Wheel nut')
  })

  it('adds a structured torque entry without falling back to legacy text fields', async () => {
    const wrapper = mount(TechnicalReferenceEditor, {
      props: { modelValue: reference },
    })

    await wrapper.find('[data-action="add-torque"]').trigger('click')

    expect(wrapper.find('[data-section="torque"]').findAll('.reference-item')).toHaveLength(2)
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toMatchObject({
      torqueSpecifications: [
        reference.torqueSpecifications[0],
        expect.objectContaining({
          component: '',
          fastener: '',
          stages: [],
        }),
      ],
    })
  })
})
