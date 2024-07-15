import { defineConfig } from 'vite'
import { resolve } from 'path'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default defineConfig({
  plugins: [
    svelte(),
    nodeResolve({
      preferBuiltins: true,
    }),
    commonjs(),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: resolve(__dirname, 'src/index.ts'),
      output: {
        format: 'es',
        file: 'dist/index.js',
      },
    },
    target: 'esnext',
    ssr: {
      noExternal: ['fs/promises'], // Prevent externalization of 'fs/promises'
    },
  },
  resolve: {
    alias: {
      path: 'path-browserify',
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env': JSON.stringify(process.env),
  },
})
