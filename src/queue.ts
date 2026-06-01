const MAX_ARRAY_LENGTH = 2 ** 32 - 1

export class Queue<Item> {
  protected list = new Array<Item>(16)
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
    let newCapacity = this.list.length * 2

    if (newCapacity > MAX_ARRAY_LENGTH || newCapacity <= 0) {
      newCapacity = MAX_ARRAY_LENGTH
    }

    const newItems = new Array<Item>(newCapacity)

    for (let index = 0; index < this.size; index++) {
      newItems[index] = this.list[this.getNextAfter(this.head, index)]
    }

    this.list = newItems
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

    this.list[this.head] = undefined as unknown as Item
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
