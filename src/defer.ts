/** @private */
interface Deferred<Value = unknown> extends Promise<Value> {
	resolve(value?: Value): void;
	reject(error: Error): void;
}

/** @internal */
export default function defer<Value>(): Deferred<Value> {
	const transit = {} as Deferred<Value>;

	const promise = new Promise<Value>((resolve, reject) => {
		Object.assign(transit, { resolve, reject });
	});

	return Object.assign(promise, transit);
}
