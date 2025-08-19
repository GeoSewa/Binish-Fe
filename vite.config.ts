import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { domToCodePlugin } from 'dom-to-code/vite';
import { defineConfig } from 'vite';

dotenv.config();
export default defineConfig({
  plugins: [
    react(),
    process.env.NODE_ENV !== 'production'
      ? domToCodePlugin({
          mode: 'react',
        })
      : undefined,
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': '/src',
      '@Assets': '/src/assets',
      '@Utils': '/src/utils',
      '@Store': '/src/store',
      '@Schemas': '/src/schemas',
      '@Hooks': '/src/hooks',
      '@Api': '/src/api',
      '@Services': '/src/services',
      '@Constants': '/src/constants',
      '@Queries': '/src/api/queries',
      '@Routes': '/src/routes',
      '@Views': '/src/views',
      '@Components': '/src/components',
      '@UserModule': '/src/modules/user-auth-module/src',
    },
  },
  build: {
    sourcemap: process.env.NODE_ENV === 'development',
  },
  define: {
    'process.env': {
      BASE_URL: process.env.BASE_URL,
      API_URL_V1: process.env.API_URL_V1,
      SITE_NAME: process.env.SITE_NAME,
    },
  },
  server: {
    open: true,
    port: 3040,
  },
});
