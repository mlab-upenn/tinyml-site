import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',                 // custom domain needs root base
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
})

