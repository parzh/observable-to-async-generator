/** @internal */
export interface Deferred<Value = unknown> extends Promise<Value> {
  resolve(value?: Value): void
  reject(error: Error): void
}

/** @internal */
// eslint-disable-next-line @typescript-eslint/promise-function-async
export default function defer<Value>(): Deferred<Value> {
  const transit = Object.create(null) as Deferred<Value>
  const promise = new Promise<Value>((resolve, reject) => {
    Object.assign(transit, { resolve, reject }) // eslint-disable-line @typescript-eslint/no-floating-promises
  })

  return Object.assign(promise, transit)
}
