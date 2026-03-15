# Node.js Example

This example demonstrates how to use untiljs in Node.js environment.

## Setup

```bash
# Run directly
node node-example.js
```

## Usage Patterns

### Basic Usage

```javascript
import until from 'untiljs'

let value = 0

// Use getter function
await until(() => value).toBe(5)
```

### Using createStore

```javascript
import { createStore } from 'untiljs'

const store = createStore(0)

// Subscribe to changes
store.subscribe(value => console.log(value))

// Use with until
await until(store).toBe(5)
```

### With Timeout

```javascript
import until from 'untiljs'

// Wait with timeout
const result = await until(() => someValue).toBe(5, { timeout: 5000 })
if (result === null) {
  console.log('Timed out!')
}
```

## Key Points

1. **ESM**: Use `import` syntax (ES Modules)
2. **CommonJS**: Use `require('untiljs').default` for CommonJS
3. **Async/Await**: Works seamlessly with async functions

## Tech Stack

- **Node.js** - Runtime
- **untiljs** - Promise-based wait utility
