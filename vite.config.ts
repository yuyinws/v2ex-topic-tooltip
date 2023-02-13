import { defineConfig } from 'vite'
import monkey from 'vite-plugin-monkey'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://www.v2ex.com/static/favicon.ico',
        namespace: 'npm/vite-plugin-monkey',
        match: ['*://v2ex.com/*', '*://*.v2ex.com/*'],
        description: 'show v2ex topic tooltip',
        license: 'MIT',
      },
    }),
  ],
})
