import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'github',
  publicDir: '../public',
  base: '/',
  plugins: [react()],
  build: {
    outDir: '../github-dist',
    emptyOutDir: true,
  },
});
