import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
            secure: false,
          },
        },
      },
      preview: {
        port: parseInt(process.env.PORT || '3000'),
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.OPENAI_API_KEY': JSON.stringify(env.OPENAI_API_KEY || env.VITE_OPENAI_API_KEY),
        'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(env.VITE_OPENAI_API_KEY || env.OPENAI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        },
        extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
        preserveSymlinks: false
      },
      build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'terser',
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom', 'react-router-dom'],
              charts: ['recharts'],
            }
          }
        }
      }
    };
});
