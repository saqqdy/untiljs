# until()

The main function to create an Until instance for watching value changes.

## Signature

```typescript
function until<T>(source: WatchSource<T>): UntilValue<T>
```

## Parameters

### source

- **Type:** `WatchSource<T>`
- **Required:** Yes

A `WatchSource` can be one of:

| Type | Example | Description |
|------|---------|-------------|
| **Getter Function** | `() => value` | A function that returns the current value |
| **Subscribable** | `{ value, subscribe }` | An object with `value` property and `subscribe` method |
| **RefLike** | `{ value }` | An object with `value` property (e.g., Vue ref) |
| **Plain Value** | `5`, `'hello'` | A static value (will never change) |

## Returns

Returns an `UntilValue<T>` instance with methods for waiting on conditions.

## Examples

### With Getter Function

```typescript
import until from 'untiljs'

let count = 0
setTimeout(() => { count = 5 }, 1000)

const result = await until(() => count).toBe(5)
console.log(result) // 5
```

### With Vue Ref

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const count = ref(0)
setTimeout(() => { count.value = 5 }, 1000)

// Pass ref directly
const result = await until(count).toBe(5)

// Or use getter function
const result2 = await until(() => count.value).toBe(5)
```

### With Subscribable

```typescript
import until, { createStore } from 'untiljs'

const store = createStore(0)
setTimeout(() => { store.value = 5 }, 1000)

const result = await until(store).toBe(5)
```

### With Plain Value

```typescript
import until from 'untiljs'

// Plain values never change, so this will timeout
const result = await until(5).toBe(10, { timeout: 1000 })
```

## TypeScript

```typescript
import until from 'untiljs'

// Type is inferred from source
const result1 = await until(() => 'hello').toBe('hello') // string

// With explicit type
const result2 = await until<number>(() => someNumber).toBe(5)
```

## See Also

- [WatchSource](/api/watch-source)
- [createStore()](/api/create-store)
- [UntilToMatchOptions](/api/options)
