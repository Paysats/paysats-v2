import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/app.ts'],
  format: ['esm'],
  target: 'node18',
  clean: true,
  splitting: false,
  treeshake: true,
  minify: false,
  sourcemap: true,
  dts: false,
  bundle: true,      // bundle all internal modules
  external: [],      // let Vercel resolve node_modules
  esbuildOptions(options) {
    options.platform = 'node';
  },
  tsconfig: './tsconfig.json',
});

