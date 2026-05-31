function scheduleIdleCallback(callback: () => void): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  globalThis.requestIdleCallback?.(callback) ?? globalThis.setImmediate?.(callback) ?? globalThis.setTimeout?.(callback)
}

class Shared<Value> {
  constructor(public value: Value) {}
}

class Pruner<Item> {
  protected cleanupScheduled = false

  constructor(
    protected readonly items: Item[],
    protected readonly start: Shared<number>,
  ) {}

  protected prune() {
    for (let i = this.start.value; i < this.items.length; i++) {
      this.items[i - this.start.value] = this.items[i]
    }

    this.items.length -= this.start.value
    this.start.value = 0
    this.cleanupScheduled = false
  }

  schedulePruneIfNeeded() {
    if (!this.cleanupScheduled && this.start.value >= this.items.length / 2) {
      scheduleIdleCallback(() => this.prune())
      this.cleanupScheduled = true
    }
  }
}

export class Queue<Item> {
  protected readonly items: Item[] = []
  protected readonly start = new Shared(0)
  protected readonly pruner = new Pruner(this.items, this.start)

  get isEmpty(): boolean {
    return this.start.value >= this.items.length
  }

  enqueue(item: Item): void {
    this.items.push(item)
  }

  // assumes there is at least one item in the queue
  dequeue(): Item {
    const item = this.items[this.start.value]

    delete this.items[this.start.value++] // eslint-disable-line @typescript-eslint/no-array-delete

    this.pruner.schedulePruneIfNeeded()

    return item
  }
}
