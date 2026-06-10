import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 2048,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('@react-three/drei')) {
            return 'drei'
          }
          if (id.includes('@react-three/fiber')) {
            return 'r3f'
          }
          if (id.includes('@react-three/postprocessing') || id.includes('postprocessing')) {
            return 'postfx'
          }
          if (id.includes('maath')) {
            return 'three-utils'
          }
          if (id.includes('three')) {
            return 'three'
          }
          if (id.includes('framer-motion')) {
            return 'motion'
          }
          if (id.includes('firebase')) {
            return 'firebase'
          }
          if (id.includes('@emailjs')) {
            return 'email'
          }
          if (id.includes('react-vertical-timeline-component')) {
            return 'timeline'
          }
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react'
          }
          return 'vendor'
        },
      },
    },
  },
})
