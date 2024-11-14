import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/export-data': {
        target: 'http://localhost:3010', // Target backend server
        changeOrigin: true,             // Change the origin to the target's origin
        secure: false                   // Disable SSL verification if needed
      }
    }
  }
});
