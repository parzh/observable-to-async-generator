//! Credit goes to https://stackoverflow.com/a/44123368/4554883

import { type Observable, type Observer } from 'rxjs'
import { Flow } from './flow.js'

/** @private */
const completion = {
  done: true,
  value: undefined,
} as const satisfies IteratorResult<unknown>

/** @private */
class Carrier<Value> implements Observer<Value> {
  protected readonly flow = new Flow()
  protected readonly values: Value[] = []
  protected valueError?: Error
  protected completed = false

  private getCompletion(): IteratorResult<Value> {
    if (this.valueError) {
      throw this.valueError
    }

    return completion
  }

  async getValue(): Promise<IteratorResult<Value>> {
    while (this.values.length === 0) {
      if (this.completed) {
        return this.getCompletion()
      }

      await this.flow.pause()
    }

    return {
      done: false,
      value: this.values.shift()!, // TODO: use pointers
    }
  }

  next(value: Value): void {
    this.values.push(value)
    this.flow.resume()
  }

  complete(): void {
    this.completed = true
    this.flow.resume()
  }

  protected convertToError(value: unknown): Error {
    if (value instanceof Error) {
      return value
    }

    return new Error(String(value))
  }

  error(value: unknown): void {
    this.valueError = this.convertToError(value)
    this.complete()
  }
}

export async function * otag<Value>(observable: Observable<Value>): AsyncIterableIterator<Value> {
  const valueCarrier = new Carrier<Value>()
  const subscription = observable.subscribe(valueCarrier)

  try {
    while (true) {
      const result = await valueCarrier.getValue()

      if (result.done) {
        break
      }

      yield result.value
    }
  } finally {
    subscription.unsubscribe()
  }
}
