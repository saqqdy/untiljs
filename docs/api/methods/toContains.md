# toContains()

Wait until an array contains a specific value.

## Signature

```typescript
toContains(value: T, options?: UntilToMatchOptions): Promise<T[]>
```

## Parameters

### value

- **Type:** `T`
- **Required:** Yes

The value to check for in the array.

### options

- **Type:** `UntilToMatchOptions`
- **Required:** No

Options for timeout behavior.

## Returns

A Promise that resolves to the array when it contains the value.

## Examples

### Basic Usage

```typescript
import until from 'untiljs'

let items = ['apple', 'banana']
setTimeout(() => {
  items.push('orange')
}, 500)

const result = await until(() => items).toContains('orange')
console.log(result) // ['apple', 'banana', 'orange']
```

### With Timeout

```typescript
import until from 'untiljs'

let items: string[] = []

const result = await until(() => items).toContains('target', { timeout: 5000 })
```

### Dynamic Array Updates

```typescript
import until from 'untiljs'

let queue: number[] = []

async function processQueue() {
  // Items arrive at different times
  setTimeout(() => { queue.push(1) }, 100)
  setTimeout(() => { queue.push(2) }, 200)
  setTimeout(() => { queue.push(3) }, 300)
}

processQueue()

// Wait for specific item
await until(() => queue).toContains(3)
console.log('Item 3 arrived!')
```

### With Vue

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const notifications = ref<string[]>([])

async function waitForNotification(id: string) {
  await until(notifications).toContains(id)
  console.log('Notification received:', id)
}

// Add notification
setTimeout(() => {
  notifications.value.push('notification-123')
}, 500)

await waitForNotification('notification-123')
```

### With React (createStore)

```typescript
import until, { createStore } from 'untiljs'

const itemsStore = createStore<string[]>([])

async function addItem() {
  setTimeout(() => {
    itemsStore.value = [...itemsStore.value, 'new-item']
  }, 500)

  await until(itemsStore).toContains('new-item')
  console.log('Item added!')
}
```

### Object Arrays

For arrays of objects, `toContains` checks for reference equality. Use `toMatch` for property matching:

```typescript
import until from 'untiljs'

interface User {
  id: number
  name: string
}

let users: User[] = []
setTimeout(() => {
  users.push({ id: 1, name: 'John' })
}, 500)

// Use toMatch for object arrays
await until(() => users).toMatch(arr => arr.some(u => u.id === 1))
```

### Number Arrays

```typescript
import until from 'untiljs'

let numbers: number[] = [1, 2, 3]

setTimeout(() => {
  numbers.push(4)
  numbers.push(5)
}, 500)

await until(() => numbers).toContains(5)
console.log('Found 5!')
```

## See Also

- [toMatch()](/api/methods/toMatch)
- [not.toContains()](/api/methods/not)
