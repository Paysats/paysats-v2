import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['apple-touch-icon.png', 'paysats-logo.png'],
      manifest: {
        name: 'Paysats',
        short_name: 'Paysats',
        description: 'Paysats — your everyday with bitcoincash',
        theme_color: '#33C279',
        background_color: '#000000',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        id: '/',
        orientation: 'portrait',
        prefer_related_applications: false,
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        /* when using generateSW the PWA injectRegister will use the virtual module registerSW */
        navigateFallback: 'index.html',
        suppressWarnings: true
      }
    })



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

