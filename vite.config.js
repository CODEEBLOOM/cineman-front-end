/* eslint-disable no-undef */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@component': path.resolve(__dirname, 'src/components'),
      '@libs': path.resolve(__dirname, 'src/libs'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@configs': path.resolve(__dirname, 'src/configs'),
      '@redux': path.resolve(__dirname, 'src/redux'),
      '@apis': path.resolve(__dirname, 'src/apis'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@context': path.resolve(__dirname, 'src/context'),
    },
  },
});
