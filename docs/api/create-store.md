# createStore()

Create a reactive store that can be used with UntilJS.

## Signature

```typescript
function createStore<T>(initialValue: T): Subscribable<T>
```

## Parameters

### initialValue

- **Type:** `T`
- **Required:** Yes

The initial value of the store.

## Returns

Returns a `Subscribable<T>` object with:

| Property/Method | Description |
|-----------------|-------------|
| `value` | Get or set the current value |
| `subscribe(callback)` | Subscribe to value changes |

## Why createStore?

In React and other frameworks where closures capture old values, `createStore` provides a way to create a reactive reference that works properly with UntilJS.

## Examples

### Basic Usage

```typescript
import until, { createStore } from 'untiljs'

const store = createStore(0)

// Set value
store.value = 5

// Get value
console.log(store.value) // 5

// Use with until
await until(store).toBe(5)
```

### With React

```tsx
import { useEffect, useState } from 'react'
import until, { createStore } from 'untiljs'

const store = createStore(0)

function MyComponent() {
  const [value, setValue] = useState(store.value)

  useEffect(() => store.subscribe(setValue), [])

  const handleClick = async () => {
    store.value = 5
    await until(store).toBe(5)
    console.log('Value is 5!')
  }

  return <button onClick={handleClick}>Test</button>
}
```

### With Objects

```typescript
import until, { createStore } from 'untiljs'

interface User {
  name: string
  loading: boolean
}

const userStore = createStore<User>({ name: '', loading: true })

// Update value
userStore.value = { name: 'John', loading: false }

// Wait for changes
await until(userStore).toMatch(u => !u.loading)
```

### Subscribe to Changes

```typescript
import { createStore } from 'untiljs'

const store = createStore(0)

// Subscribe returns unsubscribe function
const unsubscribe = store.subscribe((value) => {
  console.log('Value changed:', value)
})

store.value = 5 // logs: "Value changed: 5"
store.value = 10 // logs: "Value changed: 10"

// Unsubscribe
unsubscribe()

store.value = 20 // No log
```

### Multiple Subscribers

```typescript
import { createStore } from 'untiljs'

const store = createStore(0)

const unsub1 = store.subscribe(v => console.log('Subscriber 1:', v))
const unsub2 = store.subscribe(v => console.log('Subscriber 2:', v))

store.value = 5
// Subscriber 1: 5
// Subscriber 2: 5

unsub1()
store.value = 10
// Subscriber 2: 10
```

## TypeScript

```typescript
import { createStore, Subscribable } from 'untiljs'

// Type is inferred
const store1 = createStore(0) // Subscribable<number>

// With explicit type
const store2 = createStore<string | null>(null)
```

## See Also

- [until()](/api/until)
- [Subscribable](/api/subscribable)
