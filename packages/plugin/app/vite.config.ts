import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';

import { ROUTE } from '../plugin/src/index.js';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  base: ROUTE,
  plugins: [
    react(),
    checker({ typescript: { root, tsconfigPath: 'src/tsconfig.json' } }),
  ],
  build: {
    outDir: resolve(root, '../dist/app'),
    emptyOutDir: true,
  },
});
