import { describe, expect, it } from 'vitest'
import pkg from '../package.json' with { type: 'json' }

describe('package.json exports', () => {
  it('should resolve ESM, CJS and types entrypoints for the root export', () => {
    expect(pkg.main).toBe('dist/index.cjs')
    expect(pkg.types).toBe('dist/index.d.ts')
    expect(pkg.exports['.']).toEqual({
      types: './dist/index.d.ts',
      module: './dist/index.js',
      default: './dist/index.cjs',
    })
  })
})
