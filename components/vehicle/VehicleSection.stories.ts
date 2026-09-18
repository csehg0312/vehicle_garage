import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VehicleSection from './VehicleSection.vue'

type VehicleSectionStoryArgs = {
  title: string
  eyebrow?: string
  description?: string
}

const meta = {
  title: 'Vehicle/VehicleSection',
  component: VehicleSection,
  tags: ['autodocs'],
  args: {
    eyebrow: 'Vehicle identity',
    title: 'Honda Civic',
    description: 'Keep the fields that identify this vehicle together.',
  },
} satisfies Meta<VehicleSectionStoryArgs>

export default meta
type Story = StoryObj<VehicleSectionStoryArgs>

export const Default: Story = {
  render: (args) => ({
    components: { VehicleSection },
    setup: () => ({ args }),
    template: `
      <VehicleSection v-bind="args">
        <div style="display: grid; gap: 0.75rem; grid-template-columns: repeat(2, minmax(0, 1fr));">
          <div><strong>Engine</strong><br />D16V1</div>
          <div><strong>Year</strong><br />1998</div>
        </div>
      </VehicleSection>
    `,
  }),
}

export const WithActions: Story = {
  args: {
    title: 'Service history',
    eyebrow: 'Maintenance',
    description: 'Track work performed, costs and the next due date.',
  },
  render: (args) => ({
    components: { VehicleSection },
    setup: () => ({ args }),
    template: `
      <VehicleSection v-bind="args">
        <template #actions><button type="button">Add record</button></template>
        <p>No service records yet.</p>
      </VehicleSection>
    `,
  }),
}
