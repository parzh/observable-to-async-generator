export class Queue<Item> {
  protected readonly items: Item[] = []

  get isEmpty(): boolean {
    return this.items.length === 0
  }

  enqueue(item: Item): void {
    this.items.push(item)
  }

  dequeue(): Item | undefined {
    return this.items.shift() // TODO: use pointers
  }
}
