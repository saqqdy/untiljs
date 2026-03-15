# Angular Example

This example demonstrates how to use untiljs with Angular 19+.

## Setup

```bash
# Install dependencies
pnpm install

# Link untiljs from parent directory
pnpm link ../../

# Run development server
pnpm start
```

## Usage Patterns

### Using Angular Signals (Recommended)

Angular 19+ supports signals, which work great with untiljs:

```typescript
import { signal } from '@angular/core'
import until from 'untiljs'

const count = signal(0)

// Use getter function with signals
await until(() => count()).toBe(5)
```

### Using createStore

The built-in `createStore` function provides a reactive store:

```typescript
import { createStore } from 'untiljs'

const store = createStore(0)

// Subscribe to changes
store.subscribe(value => console.log(value))

// Use with until
await until(store).toBe(5)
```

## Key Points

1. **Signals**: Use getter functions `() => signal()` with untiljs
2. **createStore**: Create reactive stores that work seamlessly with Angular
3. **Subscribable**: Implement the Subscribable interface for custom reactive sources

## Tech Stack

- **Angular 19** - Web framework
- **TypeScript** - Type safety
