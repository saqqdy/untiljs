# toBe()

Wait until the source equals the given value.

## Signature

```typescript
toBe(value: T, options?: UntilToMatchOptions): Promise<T>
```

## Parameters

### value

- **Type:** `T`
- **Required:** Yes

The target value to wait for.

### options

- **Type:** `UntilToMatchOptions`
- **Required:** No

Options for timeout and comparison behavior.

## Returns

A Promise that resolves to the current value when the condition is met.

## Examples

### Basic Usage

```typescript
import until from 'untiljs'

let count = 0
setTimeout(() => { count = 5 }, 1000)

const result = await until(() => count).toBe(5)
console.log(result) // 5
```

### With Timeout

```typescript
import until from 'untiljs'

let count = 0

// Returns current value on timeout
const result = await until(() => count).toBe(5, { timeout: 1000 })
console.log(result) // 0

// Throws on timeout
try {
  await until(() => count).toBe(5, { timeout: 1000, throwOnTimeout: true })
} catch (error) {
  console.error('Timed out!')
}
```

### With Deep Comparison

```typescript
import until from 'untiljs'

let obj = { nested: { value: 0 } }
setTimeout(() => {
  obj = { nested: { value: 5 } }
}, 500)

// Deep comparison for objects
await until(() => obj).toBe(
  { nested: { value: 5 } },
  { deep: true }
)
```

### With Vue Refs

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const count = ref(0)
setTimeout(() => { count.value = 5 }, 1000)

// Pass ref directly
await until(count).toBe(5)

// Or use getter
await until(() => count.value).toBe(5)
```

### With createStore

```typescript
import until, { createStore } from 'untiljs'

const store = createStore(0)
setTimeout(() => { store.value = 5 }, 1000)

await until(store).toBe(5)
```

## Array Comparison

```typescript
import until from 'untiljs'

let arr = [1, 2, 3]
setTimeout(() => { arr = [1, 2, 3, 4, 5] }, 500)

// Reference comparison (won't match)
await until(() => arr).toBe([1, 2, 3, 4, 5]) // Times out!

// Deep comparison
await until(() => arr).toBe([1, 2, 3, 4, 5], { deep: true })
```

## See Also

- [toMatch()](/api/methods/toMatch)
- [UntilToMatchOptions](/api/options)
