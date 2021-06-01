import { Observable, Subject } from "rxjs";
import otag from ".";

/** @private */
function runInBackground(task: (finish: (result?: unknown) => void) => void): void {
	new Promise<unknown>(task);
}

it("should convert observables into async generators", () => {
	const generator = otag(new Observable());

	expect(generator).toHaveProperty("next", expect.any(Function));
	expect(generator).toHaveProperty("return", expect.any(Function));
	expect(generator).toHaveProperty("throw", expect.any(Function));
	expect(generator).toHaveProperty([ Symbol.asyncIterator ], expect.any(Function));
});

it("should allow iterating over items in observable, using `for await .. of` construct", async () => {
	const subject = new Subject<42>();

	runInBackground((finish) => {
		const iterations = 3;

		for (let i = 0; i < iterations; i++)
			setTimeout(() => subject.next(42), 200 * i);

		setTimeout(() => {
			subject.complete();
			finish();
		}, 200 * (iterations + 1));
	});

	const values: 42[] = [];

	for await (const value of otag(subject)) {
		expect(value).toBe(42);
		values.push(value);
	}

	expect(values).toStrictEqual([ 42, 42, 42 ]);
});

test.each([
	[ "an error", new Error("Unexpected error"), new Error("Unexpected error") ],
	[ "a string", "Unexpected error", new Error("Unexpected error") ],
] as const)("should throw if observable emits %s", async (name, errorLike, caughtExpected) => {
	const subject = new Subject<42>();

	runInBackground((finish) => {
		const iterations = 2;

		for (let i = 0; i < iterations; i++)
			setTimeout(() => subject.next(42), 200 * i);

		setTimeout(() => {
			subject.error(errorLike);
			finish();
		}, 200 * (iterations + 1));
	});

	const values: 42[] = [];

	try {
		for await (const value of otag(subject)) {
			expect(value).toBe(42);
			values.push(value);
		}
	}

	catch (caught) {
		expect(caught).toEqual(caughtExpected);
	}

	expect(values).toStrictEqual([ 42, 42 ]);
});
