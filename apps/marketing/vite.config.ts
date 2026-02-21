import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: /^@shared-ui\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/shared/ui/$1') },
      { find: /^@shared\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/shared/$1') },
      { find: '@shared-ui', replacement: path.resolve(__dirname, '../../packages/shared/ui') },
      { find: '@shared', replacement: path.resolve(__dirname, '../../packages/shared') }
    ]
  },
  optimizeDeps: {
    exclude: ['@shared', '@shared-ui']
  },
  server: {
    port: 3000,
    fs: {
      allow: ['../..']
    }
  }
})

