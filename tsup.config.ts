import browsers from 'browserslist-to-esbuild'
import { defineConfig } from 'tsup'
import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  clean: true,
  entry: [
    'src/index.ts',
  ],
  format: ['cjs', 'esm'],
  target: [
    'node16',
    ...browsers(),
  ],
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
