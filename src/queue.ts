function scheduleIdleCallback(callback: () => void): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  globalThis.requestIdleCallback?.(callback)
  ?? globalThis.setImmediate?.(callback)
  ?? globalThis.setTimeout?.(callback)
}

export class Queue<Item> {
  protected readonly items: Item[] = []
  protected start = 0
  private cleanupScheduled = false

  get isEmpty(): boolean {
    return this.start >= this.items.length
  }

  enqueue(item: Item): void {
    this.items.push(item)
  }

  private prune() {
    for (let i = this.start; i < this.items.length; i++) {
      this.items[i - this.start] = this.items[i]
    }

    this.items.length -= this.start
    this.start = 0
    this.cleanupScheduled = false
  }

  private schedulePruneIfNeeded() {
    if (!this.cleanupScheduled && this.start >= this.items.length / 2) {
      scheduleIdleCallback(() => this.prune())
      this.cleanupScheduled = true
    }
  }

  dequeue(): Item | undefined {
    if (this.isEmpty) {
      return undefined
    }

    const item = this.items[this.start]

    delete this.items[this.start++] // eslint-disable-line @typescript-eslint/no-array-delete

    this.schedulePruneIfNeeded()

    return item
  }
}
