import { describe, it, expect, vi, afterEach } from 'vitest'
import { validateMaxDanglingItems, MAX_ARRAY_LENGTH } from './validateMaxDanglingItems.js'

function createWarnSpy() {
  return vi.spyOn(console, 'warn').mockImplementation(() => {})
}

describe('validateMaxDanglingItems', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return the input if it is a valid array length', () => {
    expect(validateMaxDanglingItems(1)).toBe(1)
    expect(validateMaxDanglingItems(100)).toBe(100)
    expect(validateMaxDanglingItems(MAX_ARRAY_LENGTH)).toBe(MAX_ARRAY_LENGTH)
  })

  it('should cap the input at MAX_ARRAY_LENGTH and warn if it exceeds it (but is not Infinity)', () => {
    using warn = createWarnSpy()
    const input = MAX_ARRAY_LENGTH + 1

    expect(validateMaxDanglingItems(input)).toBe(MAX_ARRAY_LENGTH)
    expect(warn).toHaveBeenCalledWith(
      `The provided dangling items limit (${input}) is too big and will be treated as Infinity (i.e., no pruning).`
    )
  })

  it('should cap the input at MAX_ARRAY_LENGTH without warning if it is Infinity', () => {
    using warn = createWarnSpy()

    expect(validateMaxDanglingItems(Infinity)).toBe(MAX_ARRAY_LENGTH)
    expect(warn).not.toHaveBeenCalled()
  })

  it('should throw an error if the input is <= 0', () => {
    expect(() => validateMaxDanglingItems(0)).toThrow(
      'Invalid maxDanglingItems: expected a valid array length, got 0'
    )
    expect(() => validateMaxDanglingItems(-1)).toThrow(
      'Invalid maxDanglingItems: expected a valid array length, got -1'
    )
  })

  it('should throw an error if the input is not an integer', () => {
    expect(() => validateMaxDanglingItems(1.5)).toThrow(
      'Invalid maxDanglingItems: expected a valid array length, got 1.5'
    )
  })
})
