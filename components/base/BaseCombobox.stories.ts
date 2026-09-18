import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseCombobox from './BaseCombobox.vue'

type BaseComboboxArgs = {
  label: string
  modelValue: string
  options: string[]
  error?: string
  disabled?: boolean
}

const meta = {
  title: 'Base/Combobox',
  component: BaseCombobox,
  tags: ['autodocs'],
  args: {
    label: 'Make',
    modelValue: '',
    options: ['Honda', 'Lada', 'Toyota'],
  },
} satisfies Meta<BaseComboboxArgs>

export default meta
type Story = StoryObj<BaseComboboxArgs>

export const Default: Story = {}

export const ValidationError: Story = {
  args: {
    error: 'Make is required',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

