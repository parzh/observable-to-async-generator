import { type Observable, type Observer } from 'rxjs'
import { Flow } from './flow/flow.js'
import { Queue, QueueOverflowError } from './queue.js'

/** @private */
const completion = {
  done: true,
  value: undefined,
} as const satisfies IteratorResult<unknown>

/** @private */
class Carrier<Value> implements Observer<Value> {
  protected readonly flow = new Flow()
  protected valueError?: Error
  protected completed = false

  constructor(protected readonly queue: Queue<Value>) {}

  private getCompletion(): IteratorResult<Value> {
    if (this.valueError) {
      throw this.valueError
    }

    return completion
  }

  async getValue(): Promise<IteratorResult<Value>> {
    while (this.queue.isEmpty) {
      if (this.completed) {
        return this.getCompletion()
      }

      await this.flow.pause()
    }

    return {
      done: false,
      value: this.queue.dequeue(),
    }
  }

  next(value: Value): void {
    this.queue.enqueue(value)
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
  const transitQueue = new Queue<Value>()
  const valueCarrier = new Carrier<Value>(transitQueue)
  const subscription = observable.subscribe(valueCarrier)

  try {
    while (true) {
      const result = await valueCarrier.getValue()

      if (result.done) {
        break
      }

      yield result.value
    }
  } catch (error) {
    if (error instanceof QueueOverflowError) {
      throw new Error('The internal queue has reached its maximum capacity. Please, ensure that the consumer can process items, emitted by the observable, at the same speed or faster.', { cause: error })
    }

    throw error
  } finally {
    subscription.unsubscribe()
  }
}
