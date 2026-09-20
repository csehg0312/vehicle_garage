// @vitest-environment jsdom
import { shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import VehicleView from '../../../views/VehicleView.vue'

const vehicle = {
  id: 'civic',
  make: 'Honda',
  model: 'Civic',
  year: 2003,
  engine: '1.6',
  fuelType: 'Petrol',
  odometer: 276080,
  color: 'Silver',
  ownershipCost: 4200,
  manualUrl: '',
  technicalData: {
    engineCode: 'D16V1',
    isCustom: false,
    catalogGeneration: 'Civic VII',
    displacementCc: 1590,
    cylinders: 4,
    powerHp: 110,
    torqueNm: 152,
    transmission: '5-speed manual',
    drivetrain: 'FWD',
    fuelEconomyCombinedL100: 6.8,
  },
  technicalReference: {
    torqueSpecifications: [],
    fluidSpecifications: [],
    maintenanceSpecifications: [],
    tireSpecifications: [],
    electricalSpecifications: [],
    fastenerSpecifications: [],
  },
  diagnoses: [],
  modifications: [],
}

const findById = vi.fn(() => vehicle)
const updateVehicle = vi.fn()

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { vehicleId: 'civic' } }),
}))

vi.mock('../../../services/i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('../../../stores/vehicles', () => ({
  useVehiclesStore: () => ({
    findById,
    updateVehicle,
  }),
}))

vi.mock('../../../stores/maintenance', () => ({
  useMaintenanceStore: () => ({
    records: [],
    addRecord: vi.fn(),
  }),
}))

describe('VehicleView', () => {
  beforeEach(() => {
    findById.mockClear()
    updateVehicle.mockClear()
  })

  it('renders the vehicle identity and primary actions', () => {
    const wrapper = shallowMount(VehicleView, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    expect(wrapper.find('.vehicle-page').exists()).toBe(true)
    expect(wrapper.find('.detail-heading h2').text()).toBe('Honda Civic')
    expect(wrapper.find('.back-link').exists()).toBe(true)
    expect(wrapper.find('.heading-actions').exists()).toBe(true)
    expect(wrapper.find('.technical-reference-action').exists()).toBe(true)
  })

  it('keeps the vehicle overview compact enough to form a mobile-first page hierarchy', () => {
    const wrapper = shallowMount(VehicleView, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    expect(wrapper.find('.hero-detail').exists()).toBe(true)
    expect(wrapper.find('.detail-stats').findAll('article')).toHaveLength(3)
    expect(wrapper.find('.detail-stats').findAll('strong')).toHaveLength(3)
  })
})
