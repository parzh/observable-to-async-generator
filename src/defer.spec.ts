import { describe, expect, it } from 'vitest'
import { defer } from './defer.js'

describe(defer, () => {
  it('should create a Promise-like object with exposed `.resolve()` and `.reject()`', () => {
    const deferred = defer<42>()

    expect(deferred).toBeInstanceOf(Promise)
    expect(deferred).toHaveProperty('resolve', expect.any(Function))
    expect(deferred).toHaveProperty('reject', expect.any(Function))
  })

  it('should allow manually resolving the promise', async () => {
    const deferred = defer<42>()

    deferred.resolve(42)

    await expect(deferred).resolves.toBe(42)
  })

  it('should allow manually rejecting the promise', async () => {
    const error = new Error('Unexpected error')
    const deferred = defer<unknown>()

    deferred.reject(error)

    await expect(deferred).rejects.toBe(error)
  })
})
