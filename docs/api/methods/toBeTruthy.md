# toBeTruthy()

Wait until the value is truthy.

## Signature

```typescript
toBeTruthy(options?: UntilToMatchOptions): Promise<T>
```

## Parameters

### options

- **Type:** `UntilToMatchOptions`
- **Required:** No

Options for timeout and comparison behavior.

## Returns

A Promise that resolves to the current value when it's truthy.

## What is Truthy?

In JavaScript, truthy values are values that evaluate to `true` in a boolean context:

- Non-empty strings: `'hello'`, `'false'`
- Non-zero numbers: `1`, `-1`, `3.14`
- Objects: `{}`, `[]`
- Functions: `() => {}`

Falsy values:
- `false`
- `0`
- `''` (empty string)
- `null`
- `undefined`
- `NaN`

## Examples

### Basic Usage

```typescript
import until from 'untiljs'

let data = null
setTimeout(() => { data = { name: 'John' } }, 500)

const result = await until(() => data).toBeTruthy()
console.log(result) // { name: 'John' }
```

### Waiting for Non-Null

```typescript
import until from 'untiljs'

let user: User | null = null

fetch('/api/user')
  .then(res => res.json())
  .then(data => { user = data })

await until(() => user).toBeTruthy()
console.log('User loaded:', user)
```

### With Timeout

```typescript
import until from 'untiljs'

let data = null

const result = await until(() => data).toBeTruthy({ timeout: 5000 })

if (result) {
  console.log('Data loaded:', result)
} else {
  console.log('Timed out waiting for data')
}
```

### With Vue

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const loading = ref(true)
const data = ref<string | null>(null)

async function fetchData() {
  loading.value = true

  setTimeout(() => {
    data.value = 'Hello World'
    loading.value = false
  }, 1000)

  // Wait for data to be truthy
  await until(data).toBeTruthy()

  console.log('Data loaded:', data.value)
}
```

### With React (createStore)

```typescript
import until, { createStore } from 'untiljs'

const dataStore = createStore<string | null>(null)

async function fetchData() {
  setTimeout(() => {
    dataStore.value = 'Hello World'
  }, 1000)

  await until(dataStore).toBeTruthy()
  console.log('Data loaded:', dataStore.value)
}
```

### DOM Elements

```typescript
import until from 'untiljs'

// Wait for element to exist
await until(() => document.getElementById('my-element')).toBeTruthy()

const element = document.getElementById('my-element')
console.log('Element found:', element)
```

## See Also

- [toBeNull()](/api/methods/toBeNull)
- [toBeUndefined()](/api/methods/toBeUndefined)
- [toMatch()](/api/methods/toMatch)
