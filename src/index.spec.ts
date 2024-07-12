import { otag } from './otag'
import * as indexfile from '.'

describe('default namespace (indexfile)', () => {
  it('should contain the `otag` function as its default entity', () => {
    expect(indexfile.default).toBe(otag)
  })
})
