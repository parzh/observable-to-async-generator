import defer from './defer'

describe(defer, () => {
  it('should create a Promise-like object with exposed `.resolve()` and `.reject()`', () => {
    const deferred = defer<42>()

    expect(deferred).toBeInstanceOf(Promise)
    expect(deferred).toHaveProperty('resolve', expect.any(Function))
    expect(deferred).toHaveProperty('reject', expect.any(Function))
  })

  it('should allow manually resolving the promise', (done) => {
    const deferred = defer<42>()

    void deferred
      .then((value) => {
        expect(value).toBe(42)
      })
      .finally(done)

    deferred.resolve(42)
  })

  it('should allow manually rejecting the promise', (done) => {
    const error = new Error('Unexpected error')
    const deferred = defer<unknown>()

    void deferred
      .catch((caught: Error) => {
        expect(caught).toBe(error)
      })
      .finally(done)

    deferred.reject(error)
  })
})
