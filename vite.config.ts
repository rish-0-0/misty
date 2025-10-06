import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  base: '/misty/',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
  },
});
