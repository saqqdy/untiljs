# WatchSource

Types of values that can be watched by UntilJS.

## Definition

```typescript
type WatchSource<T> =
  | (() => T)           // Getter function
  | Subscribable<T>     // Subscribable object
  | RefLike<T>          // Ref-like object (e.g., Vue ref)
  | T                   // Plain value
```

## Types

### Getter Function

A function that returns the current value. Most commonly used.

```typescript
import until from 'untiljs'

let count = 0
const source = () => count

await until(source).toBe(5)
// Or inline
await until(() => count).toBe(5)
```

### Subscribable

An object with `value` property and `subscribe` method.

```typescript
interface Subscribable<T> {
  readonly value: T
  subscribe(callback: (value: T) => void): () => void
}
```

```typescript
import until, { createStore } from 'untiljs'

const store = createStore(0)

// createStore returns a Subscribable
await until(store).toBe(5)
```

### RefLike

An object with a `value` property. Vue refs are RefLike.

```typescript
interface RefLike<T> {
  value: T
}
```

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const count = ref(0)

// Vue refs are RefLike
await until(count).toBe(5)
```

### Plain Value

A static value that never changes. Not very useful with UntilJS.

```typescript
import until from 'untiljs'

// This will timeout since the value never changes
await until(5).toBe(10, { timeout: 1000 })
```

## Choosing the Right Type

| Type | Use When | Framework |
|------|----------|-----------|
| Getter Function | Any situation | All |
| Subscribable | Need reactive store | React, Vanilla JS |
| RefLike | Using Vue refs | Vue |
| Plain Value | Never changes (rare) | All |

## Best Practices

### Vue

Use RefLike directly or getter function:

```typescript
// Recommended: Pass ref directly
await until(count).toBe(5)

// Also works: Use getter
await until(() => count.value).toBe(5)
```

### React

Use Subscribable (createStore) due to closure behavior:

```typescript
const store = createStore(0)
await until(store).toBe(5)
```

### Angular Signals

Use getter function:

```typescript
const count = signal(0)
await until(() => count()).toBe(5)
```

### Svelte Runes

Use getter function:

```typescript
let count = $state(0)
await until(() => count).toBe(5)
```

## See Also

- [until()](/api/until)
- [Subscribable](/api/subscribable)
