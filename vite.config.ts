import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'index.js' : 'index.cjs',
    },
    rollupOptions: {
      external: ['rxjs'],
    },
  },
  esbuild: {
    keepNames: true,
  },
  plugins: [
    dts({
      include: ['src'],
      exclude: ['src/**/*.spec.ts'],
      outDir: 'dist',
    }),
  ],
})
