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
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    outDir: 'dist',
    rollupOptions: {
      external: [
        'pg',
        'discord.js',
        'compromise',
        'dotenv-flow',
        'drizzle-orm',
        'supabase',
        '@tensorflow/tfjs',
        '@tensorflow/tfjs-node',
        '@google/generative-ai',
        'crypto',
        'stream',
        'perf_hooks',
        'path',
        'fs',
      ],
      output: {
        globals: {
          pg: 'pg',
          'discord.js': 'discordjs',
          compromise: 'compromise',
          'dotenv-flow': 'dotenvFlow',
          'drizzle-orm': 'drizzleORM',
          supabase: 'supabase',
          '@tensorflow/tfjs': 'tfjs',
          '@tensorflow/tfjs-node': 'tfjsNode',
          '@google/generative-ai': 'googleGenerativeAI',
          crypto: 'crypto',
          stream: 'stream',
          perf_hooks: 'perf_hooks',
          path: 'path',
          fs: 'fs',
        },
      },
    },
    target: ['esnext'],
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
