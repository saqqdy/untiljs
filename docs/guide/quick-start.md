# Quick Start

## Basic Usage

UntilJS provides a simple, Promise-based API for waiting on value changes.

```typescript
import until from 'untiljs'

// Basic usage with getter function
let value = 1
setTimeout(() => { value = 2 }, 1000)

await until(() => value).toBe(2)
console.log('Value is now 2!')
```

## WatchSource Types

A `WatchSource<T>` can be one of:

| Type | Example | Description |
|------|---------|-------------|
| **Getter Function** | `() => value` | A function that returns the current value |
| **Subscribable** | `{ value, subscribe }` | An object with `value` property and `subscribe` method |
| **RefLike** | `{ value }` | An object with `value` property (e.g., Vue ref) |
| **Plain Value** | `5`, `'hello'` | A static value (will never change) |

## Common Methods

### toBe(value)

Wait until the source equals the given value:

```typescript
let count = 0
setTimeout(() => { count = 5 }, 1000)

await until(() => count).toBe(5)
```

### toMatch(condition)

Wait until a custom condition returns true:

```typescript
let count = 0
setTimeout(() => { count = 5 }, 1000)

await until(() => count).toMatch(v => v > 3)
```

### toTruthy()

Wait until the value is truthy:

```typescript
let data = null
setTimeout(() => { data = { name: 'John' } }, 500)

await until(() => data).toBeTruthy()
```

### changed()

Wait until the value changes:

```typescript
let value = 'initial'
setTimeout(() => { value = 'changed' }, 1000)

await until(() => value).changed()
```

## Options

All methods accept an options object:

```typescript
interface UntilToMatchOptions {
  /** Timeout in milliseconds (0 = never timeout) */
  timeout?: number

  /** Reject promise on timeout (default: false) */
  throwOnTimeout?: boolean

  /** Deep comparison depth (true = unlimited, number = specific depth) */
  deep?: boolean | number
}
```

### Example with Options

```typescript
// With timeout
await until(() => value).toBe(5, { timeout: 1000 })

// With deep comparison
let obj = { nested: { value: 0 } }
setTimeout(() => { obj = { nested: { value: 5 } } }, 500)

await until(() => obj).toBe({ nested: { value: 5 } }, { deep: true })
```

## Not Modifier

Use `.not` to invert any condition:

```typescript
let value = 5
setTimeout(() => { value = 10 }, 500)

await until(() => value).not.toBe(5)
console.log(value) // 10
```

## Array Methods

```typescript
let items = ['apple', 'banana']
setTimeout(() => { items.push('orange') }, 500)

// Wait for array to contain value
await until(() => items).toContains('orange')

// Wait for specific array
await until(() => items).toBe(['apple', 'banana', 'orange'], { deep: true })
```
