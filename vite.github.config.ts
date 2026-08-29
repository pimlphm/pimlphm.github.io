import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  root: 'github',
  publicDir: '../public',
  base: '/',
  plugins: [react()],
  build: {
    outDir: '../github-dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        en: resolve(import.meta.dirname, 'github/index.html'),
        zh: resolve(import.meta.dirname, 'github/zh/index.html'),
      },
    },
  },
});
