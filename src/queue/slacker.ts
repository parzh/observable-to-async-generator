type Action = () => void
type IdleScheduler = (action: Action) => void

export const scheduleIdle: IdleScheduler = (() => {
  if (typeof requestIdleCallback === 'function') {
    return requestIdleCallback
  }

  return setTimeout
})()

export class Slacker {
  protected scheduled = false

  constructor(protected readonly action: Action) { }

  runWhenIdle() {
    if (!this.scheduled) {
      scheduleIdle(() => {
        this.action()
        this.scheduled = false
      })
      this.scheduled = true
    }
  }
}
