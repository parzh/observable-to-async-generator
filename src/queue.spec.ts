import { describe, expect, it, vi } from 'vitest'
import { Queue } from './queue.js'

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
})
