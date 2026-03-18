import { defer } from './defer'
import { otag } from './otag'
import * as indexfile from '.'

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
