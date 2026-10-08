import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react-tinder-card',
      '@react-spring/web',
      '@react-spring/animated',
      '@react-spring/core',
      'recharts',
      'react-is',
    ],
  },
})
