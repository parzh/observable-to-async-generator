import { describe, expect, it, vi } from 'vitest'
import { Queue, QueueOverflowError } from './queue.js'
import { MAX_ARRAY_LENGTH } from './validateMaxDanglingItems.js'

class QueueTest extends Queue<number> {
  get startValue(): number {
    return this.start.value
  }

  fillToMax() {
    this.items.length = MAX_ARRAY_LENGTH - 1
    this.start.value = 0
  }

  simulateNearMax() {
    this.items.length = MAX_ARRAY_LENGTH - 1
    this.start.value = MAX_ARRAY_LENGTH - 2
  }
}

describe(Queue, () => {
  it('should be empty initially', () => {
    const queue = new Queue<number>()

    expect(queue.isEmpty).toBe(true)
  })

  it('should enqueue and dequeue items in FIFO order', () => {
    const queue = new Queue<number>()

    queue.enqueue(1)

    expect(queue.isEmpty).toBe(false)

    queue.enqueue(2)
    queue.enqueue(3)

    expect(queue.dequeue()).toBe(1)
    expect(queue.isEmpty).toBe(false)

    expect(queue.dequeue()).toBe(2)
    expect(queue.isEmpty).toBe(false)

    expect(queue.dequeue()).toBe(3)
    expect(queue.isEmpty).toBe(true)
  })

  it('should prune dangling items in the background when they reach 100 items', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('requestIdleCallback', undefined)
    vi.resetModules()

    const { Queue } = await import('./queue.js')

    class QueueTest extends Queue<number> {
      get startValue(): number {
        return this.start.value
      }
    }

    const queue = new QueueTest()

    for (let i = 0; i < 101; i++) {
      queue.enqueue(i)
    }

    for (let i = 0; i < 100; i++) {
      expect(queue.dequeue()).toBe(i)
    }

    expect(queue.startValue).toBe(100)

    vi.runAllTimers()

    expect(queue.startValue).toBe(0)
  })

  it('should salvage prune the queue if the array is full but dangling items are present', () => {
    const queue = new QueueTest()

    queue.simulateNearMax()

    expect(() => queue.enqueue(1)).not.toThrow()
    expect(queue.startValue).toBe(0)
  })

  it('should throw QueueOverflowError if the array is full and no dangling items are present', () => {
    const queue = new QueueTest()

    queue.fillToMax()

    expect(() => queue.enqueue(1)).toThrow(QueueOverflowError)
  })

  it.todo('should disable background pruning if maxDanglingItems is Infinity')
})
