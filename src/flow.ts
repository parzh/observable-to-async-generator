import { Deferred, defer } from './defer.js'

export class Flow {
  protected deferred: Deferred | null = null

  async pause(): Promise<void> {
    this.deferred ??= defer()

    await this.deferred
  }

  resume(): void {
    this.deferred?.resolve()
    this.deferred = null
  }
}
