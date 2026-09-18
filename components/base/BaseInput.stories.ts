import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseInput from './BaseInput.vue'

type BaseInputArgs = {
  label: string
  modelValue: string
  error?: string
  disabled?: boolean
}

const meta = {
  title: 'Base/Input',
  component: BaseInput,
  tags: ['autodocs'],
  args: {
    label: 'Make',
    modelValue: '',
  },
} satisfies Meta<BaseInputArgs>

export default meta
type Story = StoryObj<BaseInputArgs>

export const Default: Story = {}

export const ValidationError: Story = {
  args: {
    error: 'Make is required',
  },
}

export const Disabled: Story = {
  args: {
    modelValue: 'Honda',
    disabled: true,
  },
}

