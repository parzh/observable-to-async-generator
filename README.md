# `observable-to-async-generator`

Convert an observable to ES6 async generator.

### Why `observable-to-async-generator`?

- it has no dependencies;
- it is always 100% covered with unit tests;
- it is written in TypeScript;
- it can be [extended with a PR](https://github.com/parzh/observable-to-async-generator/fork);

# Import

```ts
import otag from "observable-to-async-generator";
```

&hellip; or:

```js
const otag = require("observable-to-async-generator").default;
```

# Usage

```ts
try {
	for await (const item of otag(observable)) {
		doSomethingWith(item);
	}
} catch (error) {
	handle(error);
}
```

# Notes

- `rxjs` is a peer dependency for this package; it is primarily used to add types on the development stage. These type imports are then removed from the JavaScript output, but are still present in `*.d.ts` files. In case if the type information is needed to you (for example, if your package/application is also written in TypeScript), you should install `rxjs` manually; inspect the `peerDependencies` object inside of [`observable-to-async-generator`'s `package.json` file](https://github.com/parzh/observable-to-async-generator/blob/v1.0.1-rc/package.json) to find the appropriate version of `rxjs` to install.
