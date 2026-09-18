import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseDataTable from './BaseDataTable.vue'

type BaseDataTableArgs = {
  label: string
  columns: { key: string; label: string }[]
  rows: Record<string, unknown>[]
  rowKey?: string
}

const columns = [
  { key: 'make', label: 'Make' },
  { key: 'model', label: 'Model' },
  { key: 'year', label: 'Year' },
]

const meta = {
  title: 'Base/DataTable',
  component: BaseDataTable,
  tags: ['autodocs'],
  args: {
    label: 'Vehicles',
    columns,
    rows: [
      { id: '1', make: 'Honda', model: 'Civic', year: 2003 },
      { id: '2', make: 'Toyota', model: 'Corolla', year: 2005 },
    ],
  },
} satisfies Meta<BaseDataTableArgs>

export default meta
type Story = StoryObj<BaseDataTableArgs>

export const Populated: Story = {}

export const Empty: Story = {
  args: {
    rows: [],
  },
}