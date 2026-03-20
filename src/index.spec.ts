import { describe, expect, it } from 'vitest'
import { defer } from './defer.js'
import { otag } from './otag.js'
import * as indexfile from './index.js'

describe('default namespace (indexfile)', () => {
  it('should contain the `otag` function as its default entity', () => {
    expect(indexfile.default).toBe(otag)
  })

  it('should contain the `otag` function as a named export', () => {
    expect(indexfile.otag).toBe(otag)
  })

  it('should contain the `defer` function as a named export', () => {
    expect(indexfile.defer).toBe(defer)
  })
})
