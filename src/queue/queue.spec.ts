import { describe, expect, it } from 'vitest'
import { Queue, QueueOverflowError } from './queue.js'

const MAX_ARRAY_LENGTH = 2 ** 32 - 1 // I don't want to `export` it just for tests

class QueueTest extends Queue<number> {
  get meta() {
    // it's highly non-performant to create an object each time, but it for tests, so it's fine
    return {
      capacity: this.list.length,
      head: this.head,
      tail: this.tail,
      size: this.size,
    }
  }

  fillToMax() {
    this.list = new Array<number>(MAX_ARRAY_LENGTH)
    this.head = 0
    this.tail = 0
    this.size = MAX_ARRAY_LENGTH
  }

  setEmptyCapacity() {
    this.list = []
    this.head = 0
    this.tail = 0
    this.size = 0
  }
}

describe(Queue, () => {
  it('should be empty initially', () => {
    const queue = new QueueTest()

    expect(queue.isEmpty).toBe(true)
    expect(queue.meta.size).toBe(0)
  })

  it('should enqueue and dequeue items in FIFO order', () => {
    const queue = new QueueTest()

    queue.enqueue(1)

    expect(queue.isEmpty).toBe(false)
    expect(queue.meta.size).toBe(1)

    queue.enqueue(2)
    queue.enqueue(3)

    expect(queue.meta.size).toBe(3)

    expect(queue.dequeue()).toBe(1)
    expect(queue.meta.size).toBe(2)

    expect(queue.dequeue()).toBe(2)
    expect(queue.meta.size).toBe(1)

    expect(queue.dequeue()).toBe(3)
    expect(queue.isEmpty).toBe(true)
    expect(queue.meta.size).toBe(0)
  })

  it('should wrap around the array', () => {
    const queue = new QueueTest()
    const capacity = queue.meta.capacity

    for (let i = 0; i < capacity - 1; i++) {
      queue.enqueue(i)
    }

    queue.dequeue()
    queue.dequeue()
    queue.enqueue(100)
    queue.enqueue(101)

    expect(queue.meta.capacity).toBe(capacity)
    expect(queue.meta.tail).toBeLessThan(queue.meta.head)
  })

  it('should grow when full', () => {
    const queue = new QueueTest()
    const capacity = queue.meta.capacity

    for (let i = 0; i < capacity; i++) {
      queue.enqueue(i)
    }

    expect(queue.meta.capacity).toBe(capacity)

    queue.enqueue(capacity)

    expect(queue.meta.capacity).toBe(capacity * 2)
    expect(queue.meta.size).toBe(capacity + 1)

    for (let i = 0; i <= capacity; i++) {
      expect(queue.dequeue()).toBe(i)
    }
  })

  it('should maintain elements correctly when growing from a wrapped state', () => {
    const queue = new QueueTest()
    const capacity = queue.meta.capacity

    for (let i = 0; i < capacity; i++) {
      queue.enqueue(i)
    }

    queue.dequeue()
    queue.dequeue()
    queue.enqueue(capacity)
    queue.enqueue(capacity + 1)

    expect(queue.meta.tail).toBe(queue.meta.head)

    queue.enqueue(capacity + 2)

    expect(queue.meta.capacity).toBe(capacity * 2)
    expect(queue.meta.head).toBe(0)
    expect(queue.meta.tail).toBe(queue.meta.size)

    for (let i = 2; i <= capacity + 2; i++) {
      expect(queue.dequeue()).toBe(i)
    }
  })

  it('should throw QueueOverflowError if the array is full and cannot grow further', () => {
    const queue = new QueueTest()

    queue.fillToMax()

    expect(() => queue.enqueue(1)).toThrow(QueueOverflowError)
  })

  it('should cap the capacity at MAX_ARRAY_LENGTH if newCapacity <= 0 or exceeds max', () => {
    const queue = new QueueTest()

    queue.setEmptyCapacity()
    queue.enqueue(1)

    expect(queue.meta.capacity).toBe(MAX_ARRAY_LENGTH)
  })
})
