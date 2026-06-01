const MAX_ARRAY_LENGTH = 2 ** 32 - 1
const INITIAL_CAPACITY = 2 ** 4

function createList<Item>(capacity: number): Array<Item> {
  return new Array<Item>(Math.min(capacity, MAX_ARRAY_LENGTH))
}

export class Queue<Item> {
  protected list = createList<Item>(INITIAL_CAPACITY)
  protected head = 0
  protected tail = 0
  protected size = 0

  get isEmpty(): boolean {
    return this.size === 0
  }

  protected getNextAfter(current: number, jump = 1): number {
    return (current + jump) % this.list.length
  }

  protected grow() {
    const list = createList<Item>(this.list.length * 2)

    for (let index = 0; index < this.size; index++) {
      list[index] = this.list[this.getNextAfter(this.head, index)]
    }

    this.list = list
    this.head = 0
    this.tail = this.size
  }

  enqueue(item: Item): void {
    if (this.size === MAX_ARRAY_LENGTH) {
      throw new QueueOverflowError(item)
    }

    if (this.size === this.list.length) {
      this.grow()
    }

    this.list[this.tail] = item
    this.tail = this.getNextAfter(this.tail)
    this.size++
  }

  dequeue(): Item {
    const item = this.list[this.head]

    this.list[this.head] = undefined as never
    this.head = this.getNextAfter(this.head)
    this.size--

    return item
  }
}

export class QueueOverflowError extends Error {
  constructor(public readonly enqueuedItem: unknown) {
    super('Queue has reached maximum capacity')
  }
}
