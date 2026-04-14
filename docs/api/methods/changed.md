# changed()

Wait until the value changes from its initial value.

## Signature

```typescript
changed(options?: UntilToMatchOptions): Promise<T>
```

## Parameters

### options

- **Type:** `UntilToMatchOptions`
- **Required:** No

Options for timeout behavior.

## Returns

A Promise that resolves to the new value when it changes.

## Examples

### Basic Usage

```typescript
import until from 'untiljs'

let value = 'initial'
setTimeout(() => { value = 'changed' }, 1000)

const result = await until(() => value).changed()
console.log(result) // 'changed'
```

### With Timeout

```typescript
import until from 'untiljs'

let value = 'initial'

const result = await until(() => value).changed({ timeout: 5000 })

if (result !== 'initial') {
  console.log('Value changed to:', result)
}
```

### Waiting for State Change

```typescript
import until from 'untiljs'

let status = 'pending'

async function process() {
  // Some async operation
  setTimeout(() => { status = 'complete' }, 1000)
}

process()

await until(() => status).changed()
console.log('Status changed from pending')
```

### With Vue

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const loading = ref(false)

async function fetchData() {
  loading.value = false

  setTimeout(() => {
    loading.value = true
  }, 500)

  // Wait for loading to become true
  await until(loading).changed()

  console.log('Loading state changed')
}
```

### With React (createStore)

```typescript
import until, { createStore } from 'untiljs'

const store = createStore('initial')

async function updateValue() {
  setTimeout(() => {
    store.value = 'updated'
  }, 1000)

  await until(store).changed()
  console.log('Value changed to:', store.value)
}
```

## Object Changes

For objects, use `deep` option to detect deep changes:

```typescript
import until from 'untiljs'

let obj = { count: 0 }
setTimeout(() => {
  obj = { count: 1 }
}, 500)

// Detect reference change
await until(() => obj).changed()

// Or with deep comparison for same reference mutations
let obj2 = { count: 0 }
setTimeout(() => {
  obj2.count = 1 // Same reference, different content
}, 500)

// This won't detect the change (reference is same)
// Use toMatch instead
await until(() => obj2.count).toMatch(v => v === 1)
```

## See Also

- [changedTimes()](/api/methods/changedTimes)
- [toMatch()](/api/methods/toMatch)
