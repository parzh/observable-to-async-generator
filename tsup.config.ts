import { defineConfig } from 'tsup'
import { resolve } from 'path'
import { peerDependencies } from './package.json'

export default defineConfig({
  clean: true,
  entry: {
    index: resolve(__dirname, 'src/index.ts'),
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  minify: true,
  external: Object.keys(peerDependencies),
  outExtension: ({ format }) => ({
    js: format === 'esm' ? '.js' : '.cjs',
  }),
  esbuildOptions(options) {
    options.keepNames = true
  },
})
