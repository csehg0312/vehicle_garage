import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VehicleTabs from './VehicleTabs.vue'

type VehicleTabsStoryArgs = {
  tabs: { value: string; label: string; disabled?: boolean }[]
  modelValue: string
  defaultValue?: string
  ariaLabel?: string
}

const meta = {
  title: 'Vehicle/VehicleTabs',
  component: VehicleTabs,
  tags: ['autodocs'],
  args: {
    tabs: [
      { value: 'overview', label: 'Overview' },
      { value: 'service', label: 'Service history' },
      { value: 'technical', label: 'Technical data' },
      { value: 'ownership', label: 'Ownership' },
    ],
    modelValue: 'overview',
  },
} satisfies Meta<VehicleTabsStoryArgs>

export default meta
type Story = StoryObj<VehicleTabsStoryArgs>

export const Default: Story = {
  render: (args) => ({
    components: { VehicleTabs },
    setup() {
      const active = ref(args.modelValue)
      return { args, active }
    },
    template: `
      <VehicleTabs v-bind="args" v-model="active">
        <template #tab-overview><p>Identity, odometer and current vehicle status.</p></template>
        <template #tab-service><p>Service timeline and maintenance records.</p></template>
        <template #tab-technical><p>Technical reference values and specifications.</p></template>
        <template #tab-ownership><p>Purchase, insurance and running costs.</p></template>
      </VehicleTabs>
    `,
  }),
}

export const LongLabelsOnMobile: Story = {
  args: {
    tabs: [
      { value: 'identity', label: 'Vehicle identity' },
      { value: 'service', label: 'Service history and repairs' },
      { value: 'diagnosis', label: 'Problems and diagnosis' },
      { value: 'modifications', label: 'Modifications' },
    ],
    modelValue: 'identity',
  },
  render: Default.render,
}
