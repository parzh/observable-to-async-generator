//! Credit goes to https://stackoverflow.com/a/44123368/4554883

import { type Observable, type Observer } from 'rxjs'
import defer, { type Deferred } from './defer'

/** @private */
class Carrier<Value> implements Observer<Value> {
  protected deferred = defer<Value>()
  protected finished = false

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  getValue(): Deferred<Value> {
    return this.deferred
  }

  isFinished(): boolean {
    return this.finished
  }

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  protected spawnDeferred(): Deferred<Value> {
    const deferred = this.deferred
    this.deferred = defer()
    return deferred
  }

  next(value: Value): void {
    setImmediate(() => {
      this.spawnDeferred().resolve(value)
    })
  }

  protected convertToError(value: unknown): Error {
    if (value instanceof Error) {
      return value
    }

    return new Error(String(value))
  }

  error(value: unknown): void {
    const error = this.convertToError(value)

    setImmediate(() => {
      this.spawnDeferred().reject(error)
    })
  }

  // has to be a function expression
  private readonly doComplete = (): void => {
    this.finished = true
    this.deferred.resolve()
  }

  complete(): void {
    setImmediate(this.doComplete)
  }
}

export async function * otag<Value>(observable: Observable<Value>): AsyncIterableIterator<Value> {
  const valueCarrier = new Carrier<Value>()
  const subscription = observable.subscribe(valueCarrier)

  try {
    while (true) {
      const value = await valueCarrier.getValue()

      if (valueCarrier.isFinished()) {
        break
      }

      yield value
    }
  } finally {
    subscription.unsubscribe()
  }
}
