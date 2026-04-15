import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000, // Explicit port for consistency
    proxy: {
      '/api': {
        target: 'http://localhost:3030',
        changeOrigin: true,
      }
    }
  }
})


