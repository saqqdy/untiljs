# toMatch()

Wait until a custom condition returns true.

## Signature

```typescript
toMatch(condition: (value: T) => boolean, options?: UntilToMatchOptions): Promise<T>
```

## Parameters

### condition

- **Type:** `(value: T) => boolean`
- **Required:** Yes

A function that receives the current value and returns `true` when the condition is met.

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

// Wait for count > 3
const result = await until(() => count).toMatch(v => v > 3)
console.log(result) // 5
```

### Complex Conditions

```typescript
import until from 'untiljs'

let user = { name: '', age: 0 }
setTimeout(() => {
  user = { name: 'John', age: 25 }
}, 500)

// Wait for adult user
await until(() => user).toMatch(u => u.age >= 18)
```

### With Timeout

```typescript
import until from 'untiljs'

let count = 0

const result = await until(() => count).toMatch(
  v => v > 100,
  { timeout: 5000 }
)
```

### With Deep Comparison

```typescript
import until from 'untiljs'

let config = { settings: { theme: 'light' } }
setTimeout(() => {
  config = { settings: { theme: 'dark' } }
}, 500)

// Access nested properties in condition
await until(() => config).toMatch(
  v => v.settings.theme === 'dark',
  { deep: true }
)
```

### Array Conditions

```typescript
import until from 'untiljs'

let items: string[] = []
setTimeout(() => {
  items = ['apple', 'banana', 'orange']
}, 500)

// Wait for array to have at least 2 items
await until(() => items).toMatch(arr => arr.length >= 2)

// Wait for specific item
await until(() => items).toMatch(arr => arr.includes('orange'))
```

### Object Conditions

```typescript
import until from 'untiljs'

interface User {
  id: number
  name: string
  email: string
}

let user: User | null = null

fetch('/api/user')
  .then(res => res.json())
  .then(data => { user = data })

// Wait for user with email
await until(() => user).toMatch(u => u?.email?.includes('@'))
```

### With Vue

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const data = ref<string | null>(null)
const loading = ref(true)

async function fetchData() {
  loading.value = true

  setTimeout(() => {
    data.value = 'Hello World'
    loading.value = false
  }, 1000)

  // Wait for loading to complete
  await until(loading).toMatch(v => !v)

  console.log('Data:', data.value)
}
```

## See Also

- [toBe()](/api/methods/toBe)
- [toBeTruthy()](/api/methods/toBeTruthy)
