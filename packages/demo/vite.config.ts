import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';
import inspect from 'vite-plugin-inspect';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  plugins: [
    react(),
    checker({ typescript: { root, tsconfigPath: 'src/tsconfig.json' } }),
    inspect(),
  ],
});
