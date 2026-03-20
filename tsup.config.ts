import { defineConfig } from 'tsup'
import { fileURLToPath } from 'url'
import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  clean: true,
  entry: [
    fileURLToPath(new URL('src/index.ts', import.meta.url)),
  ],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  minify: true,
  external: Object.keys(pkg.peerDependencies),
  outExtension: ({ format }) => ({
    js: format === 'esm' ? '.js' : '.cjs',
    // dts: '.d.ts', // TODO: use this when it is fixed: https://github.com/egoist/tsup/issues/939
  }),
  esbuildOptions(options) {
    options.keepNames = true
  },
})
