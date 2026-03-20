import { describe, expect, it } from 'vitest'
import pkg from '../package.json' with { type: 'json' }

describe('package.json exports', () => {
  // FIXME: this is sloppy, change to E2E test with mock packages for ESM and CJS
  it('should resolve ESM, CJS and types entrypoints for the root export', () => {
    expect(pkg.main).toBe('dist/index.cjs')
    expect(pkg.types).toBe('dist/index.d.ts')
    expect(pkg.exports['.']).toEqual({
      import: {
        types: './dist/index.d.ts',
        default: './dist/index.js',
      },
      require: {
        types: './dist/index.d.ts',
        default: './dist/index.cjs',
      },
    })
  })
})
