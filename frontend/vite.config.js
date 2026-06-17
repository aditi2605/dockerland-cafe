import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite is our development server and build tool.
// In Docker, the frontend container runs 'vite build' to create static files,
// then Nginx serves those files. In dev mode, Vite serves with hot reload.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow connections from outside the container
    port: 5173,
    proxy: {
      // Proxy /api calls to the backend container.
      // In Docker Compose, 'backend' is the service name — Docker's built-in
      // DNS resolves it to the backend container's IP automatically!
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
