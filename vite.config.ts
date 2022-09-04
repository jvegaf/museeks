import { rmSync } from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import react from '@vitejs/plugin-react';

import pkg from './package.json';

rmSync(path.join(__dirname, 'dist'), { recursive: true, force: true });

const externals = ['electron', 'fs', 'stream', 'path', 'platform', 'assert', 'os', 'constants', 'util', 'events'];
const otherExternals = ['graceful-fs'];

export default defineConfig({
  plugins: [
    react(),
    electron({
      renderer: {
        resolve: () => [...externals, ...otherExternals],
      },
      main: {
        entry: 'src/main/main.ts',
        vite: {
          build: {
            // For Debug
            sourcemap: true,
            outDir: 'dist/main',
          },
        },
      },
    }),
  ],
  build: {
    outDir: 'dist/renderer',
  },
  server: process.env.VSCODE_DEBUG
    ? {
        host: pkg.debug.env.VITE_DEV_SERVER_HOSTNAME,
        port: pkg.debug.env.VITE_DEV_SERVER_PORT,
      }
    : undefined,
});
