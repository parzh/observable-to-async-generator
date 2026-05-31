import { describe, expect, it, vi } from 'vitest'
import { Flow } from './flow.js'

async function expectToHaveActedAfterFlowResumed(flow: Flow): Promise<void> {
  using action = vi.fn()
  const promise = flow.pause().then(action)

  expect(action).not.toHaveBeenCalled()

  await Promise.resolve()

  expect(action).not.toHaveBeenCalled()

  flow.resume()

  await promise

  expect(action).toHaveBeenCalled()
}

describe(Flow, () => {
  it('should allow pausing and resuming execution one or more times', async () => {
    const flow = new Flow()

    await expectToHaveActedAfterFlowResumed(flow)
    await expectToHaveActedAfterFlowResumed(flow)
  })
})
