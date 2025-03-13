import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          'vendor-tone': ['tone'],
          'vendor-tonal': ['tonal'],
          'vendor-vexflow': ['vexflow'],
          'vendor-webmidi': ['webmidi'],
          'vendor-redux': ['redux', 'react-redux', 'redux-thunk', '@reduxjs/toolkit'],
          'vendor-react': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
});
