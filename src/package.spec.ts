import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('package.json exports', () => {
  it('should resolve ESM, CJS and types entrypoints for the root export', () => {
    const packageJsonPath = resolve(__dirname, '../package.json')
    const packageJsonContents = readFileSync(packageJsonPath, 'utf8')
    const packageJson = JSON.parse(packageJsonContents) as {
      main: string
      types: string
      exports: {
        '.': {
          types: string
          module: string
          default: string
        }
      }
    }

    expect(packageJson.main).toBe('dist/index.cjs')
    expect(packageJson.types).toBe('dist/index.d.ts')
    expect(packageJson.exports['.']).toEqual({
      types: './dist/index.d.ts',
      module: './dist/index.js',
      default: './dist/index.cjs',
    })
  })
})
