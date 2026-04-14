# UntilToMatchOptions

Options for configuring wait behavior in UntilJS methods.

## Definition

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

## Properties

### timeout

Timeout in milliseconds. Default is `0` (never timeout).

```typescript
import until from 'untiljs'

// Timeout after 1 second
const result = await until(() => value).toBe(5, { timeout: 1000 })

// Never timeout (default)
const result = await until(() => value).toBe(5, { timeout: 0 })
```

### throwOnTimeout

Whether to reject the promise on timeout. Default is `false`.

```typescript
import until from 'untiljs'

// Don't throw on timeout (returns current value)
const result = await until(() => value).toBe(5, { timeout: 1000 })

// Throw on timeout
try {
  await until(() => value).toBe(5, {
    timeout: 1000,
    throwOnTimeout: true
  })
} catch (error) {
  console.error('Timed out!')
}
```

### deep

Configure deep comparison for objects and arrays.

- `false` (default): Reference comparison only
- `true`: Unlimited depth comparison
- `number`: Limit comparison to specified depth

```typescript
import until from 'untiljs'

let obj = { nested: { value: 0 } }

// No deep comparison (reference only)
await until(() => obj).toBe({ nested: { value: 5 } }) // Won't match!

// Deep comparison
await until(() => obj).toBe({ nested: { value: 5 } }, { deep: true })

// Limit depth
await until(() => obj).toBe({ nested: { value: 5 } }, { deep: 2 })
```

## Default Values

| Property | Default Value |
|----------|---------------|
| `timeout` | `0` (never) |
| `throwOnTimeout` | `false` |
| `deep` | `false` |

## Usage Examples

### All Options

```typescript
import until from 'untiljs'

let obj = { nested: { value: 0 } }

const result = await until(() => obj).toBe(
  { nested: { value: 5 } },
  {
    timeout: 5000,
    throwOnTimeout: true,
    deep: true
  }
)
```

### Timeout Only

```typescript
await until(() => value).toBe(5, { timeout: 1000 })
```

### Deep Comparison Only

```typescript
await until(() => obj).toBe(expected, { deep: true })
```

### Multiple Calls with Same Options

```typescript
import until from 'untiljs'

const defaultOptions = {
  timeout: 5000,
  throwOnTimeout: true
}

await until(() => value1).toBe(5, defaultOptions)
await until(() => value2).toBeTruthy(defaultOptions)
```

## TypeScript

```typescript
import until, { UntilToMatchOptions } from 'untiljs'

const options: UntilToMatchOptions = {
  timeout: 5000,
  throwOnTimeout: true,
  deep: true
}

await until(() => value).toBe(5, options)
```

## See Also

- [toBe()](/api/methods/toBe)
- [toMatch()](/api/methods/toMatch)
