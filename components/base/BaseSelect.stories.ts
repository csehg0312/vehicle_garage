import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseSelect from './BaseSelect.vue'

type BaseSelectArgs = {
  label: string
  modelValue: string
  options: string[]
  placeholder?: string
  error?: string
  disabled?: boolean
}

const meta = {
  title: 'Base/Select',
  component: BaseSelect,
  tags: ['autodocs'],
  args: {
    label: 'Fuel',
    modelValue: '',
    options: ['Petrol', 'Diesel', 'Electric'],
    placeholder: 'Select fuel',
  },
} satisfies Meta<BaseSelectArgs>

export default meta
type Story = StoryObj<BaseSelectArgs>

export const Default: Story = {}

export const Interactive: Story = {
  render: (args) => ({
    components: { BaseSelect },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: '<BaseSelect v-bind="args" v-model="value" />',
  }),
}

export const Selected: Story = {
  args: {
    modelValue: 'Petrol',
  },
}

export const ValidationError: Story = {
  args: {
    error: 'Fuel is required',
  },
}

