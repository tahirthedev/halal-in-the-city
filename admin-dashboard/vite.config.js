import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // host: '0.0.0.0',
    port: 3001,
    host: true, // This allows external connections
    strictPort: false
  },
  root: '.',
  build: {
    outDir: 'dist'
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/
  }
})
