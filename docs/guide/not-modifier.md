# Not Modifier

The `not` modifier inverts any wait condition.

## Basic Usage

```typescript
import until from 'untiljs'

// Wait until value is NOT 5
let value = 5
setTimeout(() => { value = 10 }, 500)

await until(() => value).not.toBe(5)
console.log(value) // 10
```

## not.toBeNull

```typescript
import until from 'untiljs'

// Wait until value is NOT null
let data = null
setTimeout(() => { data = 'loaded' }, 500)

await until(() => data).not.toBeNull()
console.log(data) // 'loaded'
```

## not.toBeUndefined

```typescript
import until from 'untiljs'

// Wait until value is NOT undefined
let config = undefined
setTimeout(() => { config = { debug: true } }, 500)

await until(() => config).not.toBeUndefined()
console.log(config) // { debug: true }
```

## not.toBeNaN

```typescript
import until from 'untiljs'

// Wait until value is NOT NaN
let number = NaN
setTimeout(() => { number = 42 }, 500)

await until(() => number).not.toBeNaN()
console.log(number) // 42
```

## not.toBeTruthy

```typescript
import until from 'untiljs'

// Wait until value is NOT truthy
let loading = true
setTimeout(() => { loading = false }, 500)

await until(() => loading).not.toBeTruthy()
console.log(loading) // false
```

## not.toMatch

```typescript
import until from 'untiljs'

// Wait until condition is NOT met
let status = 'pending'
setTimeout(() => { status = 'complete' }, 500)

await until(() => status).not.toMatch(v => v === 'pending')
console.log(status) // 'complete'
```

## not.changed

Wait for value to stay the same:

```typescript
import until from 'untiljs'

let value = 'stable'
// No change happens

// This will timeout since value never changes
const result = await until(() => value).not.changed({ timeout: 1000 })
```

## not.toContains (Arrays)

```typescript
import until from 'untiljs'

let items = ['apple', 'banana', 'orange']
setTimeout(() => {
  items = items.filter(i => i !== 'banana')
}, 500)

await until(() => items).not.toContains('banana')
console.log(items) // ['apple', 'orange']
```

## Combining with Other Options

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

## Practical Example

```typescript
import until from 'untiljs'

async function waitForLogout(isLoggedIn) {
  // Wait for user to log out
  await until(isLoggedIn).not.toBeTruthy()
  console.log('User logged out')
}

async function waitForDataClear(data) {
  // Wait for data to be cleared
  await until(() => data).not.toBeTruthy()
  console.log('Data cleared')
}
```
