import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VehicleSplitter from './VehicleSplitter.vue'

type VehicleSplitterStoryArgs = {
  direction?: 'horizontal' | 'vertical'
  autoSaveId?: string
  firstDefaultSize?: number
  firstMinSize?: number
  secondMinSize?: number
}

const meta = {
  title: 'Vehicle/VehicleSplitter',
  component: VehicleSplitter,
  tags: ['autodocs'],
  args: {
    direction: 'horizontal',
    autoSaveId: 'vehicle-detail-demo',
  },
} satisfies Meta<VehicleSplitterStoryArgs>

export default meta
type Story = StoryObj<VehicleSplitterStoryArgs>

const paneStyle = 'height: 100%; padding: 1rem; box-sizing: border-box; background: #f7faf7;'

export const Horizontal: Story = {
  render: (args) => ({
    components: { VehicleSplitter },
    setup: () => ({ args, paneStyle }),
    template: `
      <VehicleSplitter v-bind="args">
        <template #first><div :style="paneStyle"><strong>Vehicle identity</strong><p>Editable profile fields.</p></div></template>
        <template #second><div :style="paneStyle"><strong>Service timeline</strong><p>Maintenance records and costs.</p></div></template>
      </VehicleSplitter>
    `,
  }),
}

export const Vertical: Story = {
  args: {
    direction: 'vertical',
    autoSaveId: 'vehicle-detail-vertical-demo',
  },
  render: Horizontal.render,
}
