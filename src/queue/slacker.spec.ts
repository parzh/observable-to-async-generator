import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('Slacker', () => {
  let Slacker: typeof import('./slacker.js').Slacker

  beforeEach(async () => {
    vi.useFakeTimers()
    vi.resetModules()
    Slacker = (await import('./slacker.js')).Slacker
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('should not run the action eagerly', () => {
    const action = vi.fn()

    new Slacker(action).runWhenIdle()

    expect(action).not.toHaveBeenCalled()
  })

  it('should run the action asynchronously', () => {
    const action = vi.fn()

    new Slacker(action).runWhenIdle()

    vi.runAllTimers()

    expect(action).toHaveBeenCalledOnce()
  })

  it('should only schedule the action once at a time', () => {
    const action = vi.fn()
    const slacker = new Slacker(action)

    slacker.runWhenIdle()
    slacker.runWhenIdle()
    slacker.runWhenIdle()

    vi.runAllTimers()

    expect(action).toHaveBeenCalledOnce()
  })

  it('should be able to schedule again after the action has run', () => {
    const action = vi.fn()
    const slacker = new Slacker(action)

    slacker.runWhenIdle()
    vi.runAllTimers()

    expect(action).toHaveBeenCalledOnce()

    slacker.runWhenIdle()
    vi.runAllTimers()

    expect(action).toHaveBeenCalledTimes(2)
  })
})

describe('Slacker scheduleIdle initialization', () => {
  it('should use requestIdleCallback if available', async () => {
    const fakeRequestIdleCallback = vi.fn()

    vi.stubGlobal('requestIdleCallback', fakeRequestIdleCallback)
    vi.resetModules()

    const { Slacker } = await import('./slacker.js')

    new Slacker(() => {}).runWhenIdle()

    expect(fakeRequestIdleCallback).toHaveBeenCalledOnce()
  })

  it('should use setTimeout if requestIdleCallback is not available', async () => {
    const fakeSetTimeout = vi.fn()

    vi.stubGlobal('requestIdleCallback', undefined)
    vi.stubGlobal('setTimeout', fakeSetTimeout)
    vi.resetModules()

    const { Slacker } = await import('./slacker.js')

    new Slacker(() => {}).runWhenIdle()

    expect(fakeSetTimeout).toHaveBeenCalledOnce()
  })
})
