//! Credit goes to https://stackoverflow.com/a/44123368/4554883

import type { Observable } from "rxjs/internal/Observable";
import defer from "./defer";

export default async function * otag<Value>(observable: Observable<Value>): AsyncIterableIterator<Value> {
	let deferred = defer<Value>();
	let finished = false;

	const subscription = observable.subscribe({
		next(value) {
			const result = deferred;
			deferred = defer<Value>();
			result.resolve(value);
		},

		error(error: unknown) {
			deferred.reject(error instanceof Error ? error : new Error(String(error)));
		},

		complete() {
			finished = true;
			deferred.resolve();
		},
	});

	try {
		while (true) {
			const value = await deferred;

			if (finished)
				break;

			yield value;
		}
	}

	finally {
		subscription.unsubscribe();
	}
}
