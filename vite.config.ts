import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        chat: resolve(__dirname, 'src/pages/chat/index.html'),
        history: resolve(__dirname, 'src/pages/history/index.html'),
      },
    },
  },
  server: {
    open: true
  }
});
