# `observable-to-async-generator`

Convert an observable to ES6 async generator.

# Import

### TypeScript:

```ts
import otag from "observable-to-async-generator";
```

### JavaScript:

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
