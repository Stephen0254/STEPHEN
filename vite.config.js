import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,         // 👈 Always use this port
    strictPort: true,   // 👈 Throw error if port 5173 is taken
    proxy: {
      '/api': 'http://localhost:5000', // 👈 Local backend proxy (optional)
    },
  },
});
