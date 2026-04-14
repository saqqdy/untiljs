# toBeNaN()

Wait until the value is `NaN`.

## Signature

```typescript
toBeNaN(options?: UntilToMatchOptions): Promise<T>
```

## Parameters

### options

- **Type:** `UntilToMatchOptions`
- **Required:** No

Options for timeout behavior.

## Returns

A Promise that resolves to `NaN` when the value is NaN.

## Examples

### Basic Usage

```typescript
import until from 'untiljs'

let number = 0
setTimeout(() => { number = NaN }, 500)

const result = await until(() => number).toBeNaN()
console.log(result) // NaN
```

### Waiting for Invalid Calculation

```typescript
import until from 'untiljs'

let result = 0

function divide(a: number, b: number) {
  result = a / b
}

setTimeout(() => divide(1, 0), 1000) // Actually returns Infinity, not NaN
setTimeout(() => divide(NaN, 1), 1500) // This returns NaN

await until(() => result).toBeNaN()
console.log('Got NaN!')
```

### With Timeout

```typescript
import until from 'untiljs'

let number = 0

const result = await until(() => number).toBeNaN({ timeout: 5000 })
```

### With Vue

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const value = ref(0)

async function test() {
  value.value = NaN
  await until(value).toBeNaN()
  console.log('Value is NaN')
}
```

## See Also

- [not.toBeNaN()](/api/methods/not)
- [toMatch()](/api/methods/toMatch)
