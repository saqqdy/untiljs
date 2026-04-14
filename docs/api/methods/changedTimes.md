# changedTimes()

Wait until the value changes a specific number of times.

## Signature

```typescript
changedTimes(n: number, options?: UntilToMatchOptions): Promise<T>
```

## Parameters

### n

- **Type:** `number`
- **Required:** Yes

The number of times the value must change.

### options

- **Type:** `UntilToMatchOptions`
- **Required:** No

Options for timeout behavior.

## Returns

A Promise that resolves to the final value after n changes.

## Examples

### Basic Usage

```typescript
import until from 'untiljs'

let count = 0

const interval = setInterval(() => {
  count++
}, 200)

// Wait for 3 changes
const result = await until(() => count).changedTimes(3)
console.log(result) // 3

clearInterval(interval)
```

### Multiple State Transitions

```typescript
import until from 'untiljs'

let status = 'pending'

async function process() {
  setTimeout(() => { status = 'loading' }, 200)
  setTimeout(() => { status = 'processing' }, 500)
  setTimeout(() => { status = 'complete' }, 800)
}

process()

// Wait for 3 changes: pending → loading → processing → complete
await until(() => status).changedTimes(3)
console.log('Process complete')
```

### With Timeout

```typescript
import until from 'untiljs'

let count = 0

const result = await until(() => count).changedTimes(5, { timeout: 10000 })

console.log('Count changed 5 times, final value:', result)
```

### With Vue

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const step = ref(0)

async function runSteps() {
  for (let i = 1; i <= 5; i++) {
    setTimeout(() => { step.value = i }, i * 200)
  }

  await until(step).changedTimes(5)
  console.log('All 5 steps completed')
}
```

### With React (createStore)

```typescript
import until, { createStore } from 'untiljs'

const store = createStore(0)

async function incrementMultipleTimes() {
  for (let i = 1; i <= 3; i++) {
    setTimeout(() => { store.value = i }, i * 200)
  }

  await until(store).changedTimes(3)
  console.log('Incremented 3 times, final value:', store.value)
}
```

### Tracking Form Progress

```typescript
import until from 'untiljs'

interface FormData {
  step: number
  completed: boolean
}

let formData = { step: 0, completed: false }

async function fillForm() {
  setTimeout(() => { formData = { ...formData, step: 1 } }, 200)
  setTimeout(() => { formData = { ...formData, step: 2 } }, 400)
  setTimeout(() => { formData = { ...formData, step: 3, completed: true } }, 600)
}

fillForm()

// Wait for 3 step changes
await until(() => formData.step).changedTimes(3)
console.log('Form completed!')
```

## See Also

- [changed()](/api/methods/changed)
- [toMatch()](/api/methods/toMatch)
