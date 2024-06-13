import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.js',
    coverage: {
      provider: 'v8', // or 'istanbul'
      enabled: true,
      include: ['src/**/*.{js,ts,jsx,tsx}'], // Include all source files
      reporter: ['text', 'html'], // Add 'html' reporter for UI coverage
      thresholds: {
        lines: 40,
        functions: 40,
        branches: 40,
        statements: 40
      }
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})

