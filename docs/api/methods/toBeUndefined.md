# toBeUndefined()

Wait until the value is `undefined`.

## Signature

```typescript
toBeUndefined(options?: UntilToMatchOptions): Promise<T>
```

## Parameters

### options

- **Type:** `UntilToMatchOptions`
- **Required:** No

Options for timeout behavior.

## Returns

A Promise that resolves to `undefined` when the value is undefined.

## Examples

### Basic Usage

```typescript
import until from 'untiljs'

let config = { debug: true }
setTimeout(() => { config = undefined as any }, 500)

const result = await until(() => config).toBeUndefined()
console.log(result) // undefined
```

### Waiting for Deletion

```typescript
import until from 'untiljs'

let cache: Record<string, any> = { key: 'value' }

function clearCache() {
  cache = undefined as any
}

setTimeout(clearCache, 1000)

await until(() => cache).toBeUndefined()
console.log('Cache cleared')
```

### With Timeout

```typescript
import until from 'untiljs'

let config = { debug: true }

const result = await until(() => config).toBeUndefined({ timeout: 5000 })
```

### With Vue

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const config = ref<Config | undefined>({ debug: true })

async function reset() {
  config.value = undefined
  await until(config).toBeUndefined()
  console.log('Config reset')
}
```

## See Also

- [toBeNull()](/api/methods/toBeNull)
- [toBeTruthy()](/api/methods/toBeTruthy)
- [not.toBeUndefined()](/api/methods/not)
