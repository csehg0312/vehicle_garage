import type { Preview } from '@storybook/vue3-vite'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      expanded: true,
    },
    a11y: {
      test: 'error',
    },
  },
}

export default preview