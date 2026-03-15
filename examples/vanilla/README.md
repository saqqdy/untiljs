# Vanilla JavaScript Example

This example demonstrates how to use untiljs with vanilla JavaScript.

## Setup

```bash
# Run in browser
# Open index.html directly or serve with a local server
npx serve .
```

## Usage Patterns

### Using createStore

```javascript
import { createStore } from 'untiljs'

const store = createStore(0)

// Subscribe to changes
store.subscribe(value => console.log(value))

// Use with until
await until(store).toBe(5)
```

### Using with Promises

```javascript
import until from 'untiljs'

let value = 0

// Use getter function
await until(() => value).toBe(5)
```

## Key Points

1. **Getter functions**: Use `() => variable` to watch plain variables
2. **createStore**: Create reactive stores for better change detection
3. **CDN**: Can be loaded via unpkg or jsdelivr

## Tech Stack

- **Vanilla JavaScript** - No framework
- **untiljs** - Promise-based wait utility
