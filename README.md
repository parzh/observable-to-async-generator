# `observable-to-async-generator`

Convert an observable to ES6 async generator.

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
	for await (const item of otag(observable))
		doSomethingWith(item);
}

catch (error) {
	handle(error);
}
```

# Notes

- `rxjs@6` is a peer dependency for this package; it is primarily used to add types on the development stage. These type imports are removed from the JavaScript output, but are still present in `*.d.ts` files; in case if the type information is needed, `rxjs@6` should be installed manually.
