import { reactive, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VehicleMovablePanel from './VehicleMovablePanel.vue'

type VehiclePanelRect = {
  x: number
  y: number
  width: number
  height: number
}

type VehicleMovablePanelStoryArgs = {
  title: string
  modelValue: VehiclePanelRect
  minWidth?: number
  minHeight?: number
}

const meta = {
  title: 'Vehicle/VehicleMovablePanel',
  component: VehicleMovablePanel,
  tags: ['autodocs'],
  args: {
    title: 'Vehicle identity',
    modelValue: { x: 24, y: 24, width: 280, height: 190 },
    minWidth: 220,
    minHeight: 140,
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<VehicleMovablePanelStoryArgs>

export default meta
type Story = StoryObj<VehicleMovablePanelStoryArgs>

export const Default: Story = {
  render: (args) => ({
    components: { VehicleMovablePanel },
    setup() {
      const rect = ref({ ...args.modelValue })
      return { args, rect }
    },
    template: `
      <div style="position: relative; width: 100%; min-height: 420px; overflow: hidden; border: 1px dashed #b8c8b8; border-radius: 0.75rem; background: #eef5ee;">
        <VehicleMovablePanel v-bind="args" v-model="rect">
          <div style="display: grid; gap: 0.6rem;">
            <div style="display: flex; justify-content: space-between; gap: 1rem;">
              <span style="color: #647064;">Make / model</span>
              <strong>Honda Civic</strong>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 1rem;">
              <span style="color: #647064;">Engine</span>
              <strong>D16V1</strong>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 1rem;">
              <span style="color: #647064;">Odometer</span>
              <strong>184,230 km</strong>
            </div>
            <label style="display: grid; gap: 0.25rem; margin-top: 0.25rem;">
              <span style="color: #647064; font-size: 0.8rem;">Local note</span>
              <input value="Check timing belt history" style="width: 100%; box-sizing: border-box; padding: 0.35rem;" />
            </label>
            <small style="color: #647064;">Drag header. Resize bottom-right corner.</small>
          </div>
        </VehicleMovablePanel>
      </div>
    `,
  }),
}

export const VehicleDashboard: Story = {
  render: () => ({
    components: { VehicleMovablePanel },
    setup() {
      const panels = reactive({
        identity: { x: 20, y: 20, width: 270, height: 180 },
        service: { x: 320, y: 44, width: 300, height: 220 },
        technical: { x: 92, y: 245, width: 320, height: 140 },
      })
      return { panels }
    },
    template: `
      <div style="position: relative; width: 100%; min-height: 460px; overflow: hidden; border: 1px dashed #b8c8b8; border-radius: 0.75rem; background: #eef5ee;">
        <VehicleMovablePanel v-model="panels.identity" title="Vehicle identity">
          <div style="display: grid; gap: 0.45rem;">
            <strong>Honda Civic · 1998</strong>
            <span>Engine: D16V1</span>
            <span>Body: 5-door hatchback</span>
            <span style="color: #246b45;">Verified vehicle</span>
          </div>
        </VehicleMovablePanel>
        <VehicleMovablePanel v-model="panels.service" title="Service timeline">
          <div style="display: grid; gap: 0.6rem;">
            <div><strong>2026-08-12</strong><br />Oil and filter change · €86</div>
            <div><strong>2026-03-04</strong><br />Brake inspection · €35</div>
            <button type="button" style="width: fit-content; padding: 0.4rem 0.65rem;">Add record</button>
          </div>
        </VehicleMovablePanel>
        <VehicleMovablePanel v-model="panels.technical" title="Technical reference">
          <div style="display: grid; gap: 0.45rem;">
            <span>Oil capacity: <strong>3.8 L</strong></span>
            <span>Tires: <strong>185/65 R14</strong></span>
            <span>Drivetrain: <strong>FWD</strong></span>
          </div>
        </VehicleMovablePanel>
      </div>
    `,
  }),
}
