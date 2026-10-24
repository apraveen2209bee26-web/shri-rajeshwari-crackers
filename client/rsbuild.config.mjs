import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const { publicVars } = loadEnv({ prefixes: ['PUBLIC_'] });

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/main.jsx',
    },
    define: publicVars,
  },
  html: {
    title: 'Sachin Pyrotech',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
