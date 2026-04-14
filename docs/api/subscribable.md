# Subscribable

Interface for objects that can be subscribed to for value changes.

## Definition

```typescript
interface Subscribable<T> {
  /** The current value */
  readonly value: T

  /**
   * Subscribe to value changes
   * @param callback Function called when value changes
   * @returns Unsubscribe function
   */
  subscribe(callback: (value: T) => void): () => void
}
```

## Properties

### value

The current value of the subscribable.

```typescript
const store = createStore(0)
console.log(store.value) // 0

store.value = 5
console.log(store.value) // 5
```

### subscribe(callback)

Subscribe to value changes.

- **Parameters:**
  - `callback: (value: T) => void` - Function called when value changes
- **Returns:** `() => void` - Unsubscribe function

```typescript
const store = createStore(0)

const unsubscribe = store.subscribe((value) => {
  console.log('New value:', value)
})

store.value = 5 // logs: "New value: 5"

unsubscribe() // Stop listening
```

## Creating Custom Subscribable

You can create your own Subscribable objects:

```typescript
import until from 'untiljs'

function createCounter(initial = 0) {
  let value = initial
  const listeners = new Set<(value: number) => void>()

  return {
    get value() {
      return value
    },

    set value(newValue: number) {
      value = newValue
      listeners.forEach(listener => listener(value))
    },

    subscribe(callback: (value: number) => void) {
      listeners.add(callback)
      callback(value) // Call immediately with current value
      return () => listeners.delete(callback)
    }
  }
}

// Usage
const counter = createCounter()
await until(counter).toBe(5)
```

## Built-in createStore

UntilJS provides `createStore` for creating Subscribable objects:

```typescript
import until, { createStore } from 'untiljs'

// Simple store
const store = createStore(0)

// With object
const userStore = createStore({ name: '', age: 0 })

// With complex types
interface State {
  loading: boolean
  data: string | null
  error: Error | null
}

const stateStore = createStore<State>({
  loading: false,
  data: null,
  error: null
})
```

## Subscribable vs RefLike

| Feature | Subscribable | RefLike |
|---------|-------------|---------|
| Has `value` property | ✅ | ✅ |
| Has `subscribe` method | ✅ | ❌ |
| More efficient for until | ✅ | Uses polling |

When possible, use Subscribable for better performance.

## RxJS Integration

Convert RxJS subjects to Subscribable:

```typescript
import { BehaviorSubject } from 'rxjs'
import until from 'untiljs'

const subject = new BehaviorSubject(0)

const subscribable = {
  get value() {
    return subject.value
  },
  subscribe(callback: (value: number) => void) {
    const subscription = subject.subscribe(callback)
    return () => subscription.unsubscribe()
  }
}

await until(subscribable).toBe(5)
```

## See Also

- [createStore()](/api/create-store)
- [WatchSource](/api/watch-source)
