import { Slacker } from './slacker.js'
import { validateMaxDanglingItems, MAX_ARRAY_LENGTH } from './validateMaxDanglingItems.js'

export const DEFAULT_MAX_DANGLING_ITEMS = 100

class Shared<Value> {
  constructor(public value: Value) {}
}

class Pruner<Item> {
  constructor(
    protected readonly items: Item[],
    protected readonly start: Shared<number>,
  ) {}

  prune() {
    const lengthPruned = this.items.length - this.start.value

    for (let index = 0; index < lengthPruned; index++) {
      this.items[index] = this.items[index + this.start.value]
    }

    this.items.length = lengthPruned
    this.start.value = 0
  }
}

export interface QueueParams {
  /**
   * The number of items removed from the queue after which schedule pruning (normalization of pointers and items' indexes).
   * Defaults to {@link DEFAULT_MAX_DANGLING_ITEMS}.
   *
   * To disable background pruning set this to `Infinity`.
   * This doesn't disable salvage pruning, which postpones {@link QueueOverflowError}.
   */
  readonly maxDanglingItems?: number
}

export class Queue<Item> {
  protected readonly items: Item[] = []
  protected readonly start = new Shared(0)
  protected readonly pruner = new Pruner(this.items, this.start)
  protected readonly prunerLazy = new Slacker(() => this.pruner.prune())
  protected readonly maxDanglingItems = validateMaxDanglingItems(this.params?.maxDanglingItems ?? DEFAULT_MAX_DANGLING_ITEMS)
  protected readonly maybePruneWhenIdle =
    this.maxDanglingItems === MAX_ARRAY_LENGTH
      ? () => {}
      : () => {
        if (this.start.value >= this.maxDanglingItems) {
          this.prunerLazy.runWhenIdle()
        }
      }

  constructor(protected readonly params?: QueueParams) {}

  protected get size(): number {
    return this.items.length - this.start.value
  }

  get isEmpty(): boolean {
    return this.size === 0
  }

  enqueue(item: Item): void {
    this.items.push(item)

    if (this.items.length !== MAX_ARRAY_LENGTH) {
      return
    }

    if (this.start.value === 0) {
      throw new QueueOverflowError()
    }

    this.pruner.prune()
  }

  // assumes there is at least one item in the queue
  dequeue(): Item {
    const item = this.items[this.start.value]

    this.items[this.start.value] = undefined as unknown as Item
    this.start.value += 1
    this.maybePruneWhenIdle()

    return item
  }
}

export class QueueOverflowError extends Error {
  constructor() {
    super('Queue has reached maximum capacity')
  }
}
