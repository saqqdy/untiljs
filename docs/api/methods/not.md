# not.*

The `not` modifier inverts any wait condition.

## Signature

All methods on `not` have the same signature as their regular counterparts:

```typescript
not.toBe(value: T, options?: UntilToMatchOptions): Promise<T>
not.toMatch(condition: (value: T) => boolean, options?: UntilToMatchOptions): Promise<T>
not.toBeTruthy(options?: UntilToMatchOptions): Promise<T>
not.toBeNull(options?: UntilToMatchOptions): Promise<T>
not.toBeUndefined(options?: UntilToMatchOptions): Promise<T>
not.toBeNaN(options?: UntilToMatchOptions): Promise<T>
not.changed(options?: UntilToMatchOptions): Promise<T>
not.toContains(value: T, options?: UntilToMatchOptions): Promise<T>
```

## Available Methods

| Method | Waits Until... |
|--------|----------------|
| `not.toBe(value)` | Value is NOT equal to target |
| `not.toMatch(condition)` | Condition is NOT met |
| `not.toBeTruthy()` | Value is NOT truthy |
| `not.toBeNull()` | Value is NOT null |
| `not.toBeUndefined()` | Value is NOT undefined |
| `not.toBeNaN()` | Value is NOT NaN |
| `not.changed()` | Value does NOT change |
| `not.toContains(value)` | Array does NOT contain value |

## Examples

### not.toBe

```typescript
import until from 'untiljs'

let value = 5
setTimeout(() => { value = 10 }, 500)

await until(() => value).not.toBe(5)
console.log(value) // 10
```

### not.toBeNull

```typescript
import until from 'untiljs'

let data = null
setTimeout(() => { data = 'loaded' }, 500)

await until(() => data).not.toBeNull()
console.log(data) // 'loaded'
```

### not.toBeUndefined

```typescript
import until from 'untiljs'

let config = undefined
setTimeout(() => { config = { debug: true } }, 500)

await until(() => config).not.toBeUndefined()
console.log(config) // { debug: true }
```

### not.toBeTruthy

```typescript
import until from 'untiljs'

let loading = true
setTimeout(() => { loading = false }, 500)

await until(() => loading).not.toBeTruthy()
console.log(loading) // false
```

### not.toMatch

```typescript
import until from 'untiljs'

let status = 'pending'
setTimeout(() => { status = 'complete' }, 500)

await until(() => status).not.toMatch(v => v === 'pending')
console.log(status) // 'complete'
```

### not.changed

Wait for value to remain stable:

```typescript
import until from 'untiljs'

let value = 'stable'

// This will timeout if value changes within timeout period
const result = await until(() => value).not.changed({ timeout: 1000 })

// Useful for checking stability
if (result === 'stable') {
  console.log('Value remained stable for 1 second')
}
```

### not.toContains

```typescript
import until from 'untiljs'

let items = ['apple', 'banana', 'orange']
setTimeout(() => {
  items = items.filter(i => i !== 'banana')
}, 500)

await until(() => items).not.toContains('banana')
console.log(items) // ['apple', 'orange']
```

### With Options

```typescript
import until from 'untiljs'

let value = 5

// With timeout
await until(() => value).not.toBe(5, { timeout: 2000 })

// With throwOnTimeout
try {
  await until(() => value).not.toBe(5, { timeout: 1000, throwOnTimeout: true })
} catch (error) {
  console.error('Value did not change in time')
}

// With deep comparison
let obj = { nested: { value: 5 } }
setTimeout(() => {
  obj = { nested: { value: 10 } }
}, 500)

await until(() => obj).not.toBe({ nested: { value: 5 } }, { deep: true })
```

## Practical Examples

### Wait for Logout

```typescript
import until from 'untiljs'

async function waitForLogout(isLoggedIn) {
  await until(isLoggedIn).not.toBeTruthy()
  console.log('User logged out')
}
```

### Wait for Data Clear

```typescript
import until from 'untiljs'

async function waitForDataClear(data) {
  await until(() => data).not.toBeTruthy()
  console.log('Data cleared')
}
```

### Wait for Input Change

```typescript
import until from 'untiljs'

let input = 'initial'

async function waitForInputChange() {
  await until(() => input).not.toBe('initial')
  console.log('Input changed from initial value')
}
```

## See Also

- [toBe()](/api/methods/toBe)
- [toMatch()](/api/methods/toMatch)
- [toBeTruthy()](/api/methods/toBeTruthy)
