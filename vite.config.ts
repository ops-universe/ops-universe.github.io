import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// BASE_PATH lets the same build run at a root domain (ops-universe.github.io → "/")
// or under a project subpath (e.g. "/website/") on GitHub Pages.
export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: env.BASE_PATH || '/',
    plugins: [react()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    build: {
      target: 'es2020',
      sourcemap: false,
      rollupOptions: {
        // Vendor chunks for the browser build only; the prerender (SSR) build keeps dependencies external.
        output: isSsrBuild
          ? {}
          : {
              manualChunks: {
                react: ['react', 'react-dom', 'react-router-dom'],
                motion: ['framer-motion'],
              },
            },
      },
    },
  };
});
