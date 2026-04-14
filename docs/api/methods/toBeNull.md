# toBeNull()

Wait until the value is `null`.

## Signature

```typescript
toBeNull(options?: UntilToMatchOptions): Promise<T>
```

## Parameters

### options

- **Type:** `UntilToMatchOptions`
- **Required:** No

Options for timeout behavior.

## Returns

A Promise that resolves to `null` when the value is null.

## Examples

### Basic Usage

```typescript
import until from 'untiljs'

let data = { name: 'John' }
setTimeout(() => { data = null }, 500)

const result = await until(() => data).toBeNull()
console.log(result) // null
```

### Waiting for Cleanup

```typescript
import until from 'untiljs'

let user: User | null = { name: 'John' }

function logout() {
  user = null
}

setTimeout(logout, 1000)

await until(() => user).toBeNull()
console.log('User logged out')
```

### With Timeout

```typescript
import until from 'untiljs'

let data = { name: 'John' }

const result = await until(() => data).toBeNull({ timeout: 5000 })
```

### With Vue

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const user = ref<User | null>({ name: 'John' })

async function logout() {
  user.value = null
  await until(user).toBeNull()
  console.log('Logout complete')
}
```

## See Also

- [toBeUndefined()](/api/methods/toBeUndefined)
- [toBeTruthy()](/api/methods/toBeTruthy)
- [not.toBeNull()](/api/methods/not)
