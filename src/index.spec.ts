import { Observable, Subject } from "rxjs";
import otag from ".";

/** @private */
function parallel(task: ConstructorParameters<PromiseConstructor>[0]): void {
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

	parallel((resolve) => {
		const iterations = 3;

		setTimeout(() => {
			subject.complete();
			resolve();
		}, 200 * (iterations + 1));

		for (let i = 0; i < iterations; i++)
			setTimeout(() => subject.next(42), 200 * i);
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

	parallel((resolve) => {
		const iterations = 2;

		setTimeout(() => {
			subject.error(errorLike);
			resolve(); // not reject
		}, 200 * (iterations + 1));

		for (let i = 0; i < iterations; i++)
			setTimeout(() => subject.next(42), 200 * i);
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
