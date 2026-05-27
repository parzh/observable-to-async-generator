import { describe, expect, it, test } from 'vitest'
import { Observable, Subject, concat, from, throwError } from 'rxjs'
import { setTimeout } from 'timers/promises'
import { otag } from './otag.js'

/** @private */
function createSubject(): Observable<42> {
  let iterations = 3

  const subject = new Subject<42>()
  const yielding = setInterval(() => {
    if (iterations-- > 0) {
      subject.next(42)
    } else {
      subject.complete()
      clearInterval(yielding)
    }
  }, 10)

  return subject
}

/** @private */
function createObservable(): Observable<42> {
  return from([42, 42, 42] as const)
}

/** @private */
function createErroneousSubject(errorLike: unknown): Observable<42> {
  return concat(
    createSubject(),
    throwError(() => errorLike),
  )
}

/** @private */
function createErroneousObservable(errorLike: unknown): Observable<42> {
  return concat(
    createObservable(),
    throwError(() => errorLike),
  )
}

describe(otag, () => {
  it('should convert observables into async generators', () => {
    const generator = otag(new Observable())

    expect(generator).toHaveProperty('next', expect.any(Function))
    expect(generator).toHaveProperty('return', expect.any(Function))
    expect(generator).toHaveProperty('throw', expect.any(Function))
    expect(generator[Symbol.asyncIterator]).toBeTypeOf('function')
  })

  it('should allow iterating over items in observable, using `for await .. of` construct', async () => {
    for (const create of [createSubject, createObservable]) {
      const observable = create()
      const values: Array<42> = []

      for await (const value of otag(observable)) {
        expect(value).toBe(42)
        values.push(value)
      }

      expect(values).toStrictEqual([42, 42, 42])
    }
  })

  test.each([
    ['an error', new Error('Unexpected error'), new Error('Unexpected error')],
    ['a string', 'Unexpected error', new Error('Unexpected error')],
  ] as const)('should throw if observable emits %s', async (name, errorLike, caughtExpected) => {
    for (const createErroneous of [createErroneousSubject, createErroneousObservable]) {
      const observable = createErroneous(errorLike)
      const values: Array<42> = []

      try {
        for await (const value of otag(observable)) {
          expect(value).toBe(42)
          values.push(value)
        }
      } catch (caught) {
        expect(caught).toEqual(caughtExpected)
      }

      expect(values).toStrictEqual([42, 42, 42])
    }
  })

  it('should not drop values when the consumer is slower than the observable', async () => {
    const observable = createObservable()
    const values: Array<42> = []

    for await (const value of otag(observable)) {
      values.push(value)

      await setTimeout(20)
    }

    expect(values).toStrictEqual([42, 42, 42])
  })

  it('should ignore emissions after completion or error', async () => {
    const subject = new Subject<number>()
    const iterator = otag(subject)

    const firstPromise = iterator.next()

    subject.next(1)
    subject.complete()
    subject.next(2)
    subject.error(new Error('Unexpected error'))
    subject.complete()

    const first = await firstPromise

    expect(first.value).toBe(1)
    expect(first.done).toBe(false)

    const second = await iterator.next()

    expect(second.done).toBe(true)
  })

  it('should unsubscribe from the observable if the generator is cancelled early', async () => {
    using unsubscribe = vi.fn()
    const observable = new Observable<number>((subscriber) => {
      subscriber.next(1)
      subscriber.next(2)

      return unsubscribe
    })

    for await (const value of otag(observable)) {
      expect(value).toBe(1)
      break
    }

    expect(unsubscribe).toHaveBeenCalled()
  })
})
