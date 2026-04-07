import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // binds to 0.0.0.0 (all network interfaces)
    port: 3000,
    open: false
  }
})
