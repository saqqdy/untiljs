# Timeout Handling

UntilJS provides built-in timeout support for all wait methods.

## Basic Timeout

```typescript
import until from 'untiljs'

let value = 0

// Timeout without throwOnTimeout - returns current value
const result = await until(() => value).toBe(5, { timeout: 1000 })
console.log(result) // 0 (current value after timeout)
```

## Throw on Timeout

```typescript
import until from 'untiljs'

let value = 0

// Timeout with throwOnTimeout - rejects promise
try {
  await until(() => value).toBe(5, { timeout: 1000, throwOnTimeout: true })
} catch (error) {
  console.error('Timeout!', error)
}
```

## No Timeout (Wait Forever)

```typescript
import until from 'untiljs'

// timeout: 0 means never timeout
await until(() => value).toBe(5, { timeout: 0 })
```

## Practical Example

```typescript
import until from 'untiljs'

async function waitForApiData() {
  let data = null

  fetch('/api/data')
    .then(res => res.json())
    .then(json => { data = json })

  try {
    await until(() => data).toBeTruthy({
      timeout: 5000,
      throwOnTimeout: true
    })
    return data
  } catch (error) {
    console.error('API request timed out')
    return null
  }
}
```

## Timeout with Other Options

```typescript
import until from 'untiljs'

let obj = { nested: { value: 0 } }

// Combine timeout with deep comparison
const result = await until(() => obj).toBe(
  { nested: { value: 5 } },
  {
    timeout: 2000,
    deep: true
  }
)
```

## Custom Timeout Handler

```typescript
import until from 'untiljs'

async function withTimeout<T>(
  promise: Promise<T>,
  timeout: number,
  message = 'Operation timed out'
): Promise<T> {
  let value: T

  const result = await until(() => value).toBeTruthy({
    timeout,
    throwOnTimeout: false
  })

  if (result === undefined) {
    throw new Error(message)
  }

  return result
}
```

## All Methods Support Timeout

```typescript
import until from 'untiljs'

// toMatch
await until(() => value).toMatch(v => v > 5, { timeout: 1000 })

// toBeTruthy
await until(() => value).toBeTruthy({ timeout: 1000 })

// changed
await until(() => value).changed({ timeout: 1000 })

// toContains (arrays)
await until(() => array).toContains('item', { timeout: 1000 })

// Not modifier
await until(() => value).not.toBe(0, { timeout: 1000 })
```
