<div style="text-align: center;" align="center">

# untiljs

Promise-based one-time watch for changes - **Framework Agnostic**

[![NPM version][npm-image]][npm-url]
[![Codacy Badge][codacy-image]][codacy-url]
[![tree shaking][tree-shaking-image]][tree-shaking-url]
![typescript][typescript-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]
[![gzip][gzip-image]][gzip-url]
[![License][license-image]][license-url]

[![Sonar][sonar-image]][sonar-url]

</div>

<div style="text-align: center; margin-bottom: 20px;" align="center">

### **[Documentation](https://www.saqqdy.com/untiljs)** • **[Change Log](./CHANGELOG.md)**

**Read this in other languages: English | [简体中文](./README-zh_CN.md)**

</div>

## Features

- **Framework Agnostic** - Works with Vue, React, Angular, Svelte, Node.js, and vanilla JavaScript
- **TypeScript Support** - Full type definitions included
- **Multiple Input Types** - Supports getter functions, Subscribable objects, RefLike objects, and plain values
- **Deep Comparison** - Configurable depth for object/array comparison
- **Timeout Support** - Built-in timeout handling with optional error throwing
- **Tree-shakeable** - Only bundle what you use
- **Zero Dependencies** - Only `js-cool` as a lightweight runtime dependency
- **Well Tested** - 210+ test cases with comprehensive coverage

## Experience Online

- [Vue 3 Example (CodeSandbox)](https://codesandbox.io/p/sandbox/github/saqqdy/untiljs/tree/master/examples/vue3)
- [React Example (CodeSandbox)](https://codesandbox.io/p/sandbox/github/saqqdy/untiljs/tree/master/examples/react)

## Installation

```bash
# use pnpm
$ pnpm install untiljs

# use npm
$ npm install untiljs --save

# use yarn
$ yarn add untiljs
```

## Quick Start

```typescript
import until from 'untiljs'

// Basic usage with getter function
let value = 1
setTimeout(() => {
  value = 2
}, 1000)

await until(() => value).toBe(2)
console.log('Value is now 2!')
```

## API Reference

### WatchSource

A `WatchSource<T>` can be one of:

| Type                | Example                | Description                                            |
| ------------------- | ---------------------- | ------------------------------------------------------ |
| **Getter Function** | `() => value`          | A function that returns the current value              |
| **Subscribable**    | `{ value, subscribe }` | An object with `value` property and `subscribe` method |
| **RefLike**         | `{ value }`            | An object with `value` property (e.g., Vue ref)        |
| **Plain Value**     | `5`, `'hello'`         | A static value                                         |

### Subscribable Interface

```typescript
interface Subscribable<T> {
  readonly value: T
  subscribe(callback: (value: T) => void): () => void
}
```

### Methods

| Method                         | Description                                   |
| ------------------------------ | --------------------------------------------- |
| `toBe(value, options?)`        | Wait until the source equals the given value  |
| `toMatch(condition, options?)` | Wait until the condition returns true         |
| `toBeTruthy(options?)`         | Wait until the value is truthy                |
| `toBeNull(options?)`           | Wait until the value is null                  |
| `toBeUndefined(options?)`      | Wait until the value is undefined             |
| `toBeNaN(options?)`            | Wait until the value is NaN                   |
| `changed(options?)`            | Wait until the value changes                  |
| `changedTimes(n, options?)`    | Wait until the value changes n times          |
| `toContains(value, options?)`  | Wait until array contains value (arrays only) |
| `not.*`                        | Inverse of any method above                   |

### Options

```typescript
interface UntilToMatchOptions {
  /** Timeout in milliseconds (0 = never timeout) */
  timeout?: number

  /** Reject promise on timeout (default: false) */
  throwOnTimeout?: boolean

  /** Deep comparison depth (true = unlimited, number = specific depth) */
  deep?: boolean | number
}
```

## Usage Examples

### Basic Usage

```typescript
import until from 'untiljs'

// Wait for value to equal something
let count = 0
setTimeout(() => {
  count = 5
}, 1000)
await until(() => count).toBe(5)

// Wait for custom condition
await until(() => count).toMatch(v => v > 3)

// Wait for truthy value
let data = null
setTimeout(() => {
  data = { name: 'John' }
}, 500)
await until(() => data).toBeTruthy()

// Wait for value to change
let value = 'initial'
setTimeout(() => {
  value = 'changed'
}, 1000)
await until(() => value).changed()

// Wait for multiple changes
await until(() => value).changedTimes(3)
```

### Vue 3 Integration

Vue refs work directly because they are RefLike objects:

```typescript
import { ref, computed } from 'vue'
import until from 'untiljs'

const count = ref(0)
const doubled = computed(() => count.value * 2)

// Method 1: Pass ref directly (recommended for Vue!)
async function waitForValue() {
  await until(count).toBe(5)
  console.log('Count reached 5!')
}

// Method 2: Use getter function
async function waitForValueGetter() {
  await until(() => count.value).toBe(5)
  console.log('Count reached 5!')
}

// Watch computed values
async function waitForDoubled() {
  await until(doubled).toBe(10)
  console.log('Doubled value reached 10!')
}

// Deep comparison for objects
const user = ref({ profile: { name: '' } })
setTimeout(() => {
  user.value = { profile: { name: 'John' } }
}, 1000)

await until(user).toMatch(v => v.profile.name === 'John', { deep: true })
```

### React Integration

> **Important**: Due to React's closure behavior, using `until(() => stateValue)` directly won't work properly. Use `useRef` or a custom hook instead.

#### ❌ Wrong Way (Won't Work)

```tsx
// This won't detect changes due to React's closure behavior
const [value, setValue] = useState(0)
await until(() => value).toBe(5) // ❌ Always sees old value
```

#### ✅ Correct Way: useUntil Hook

```tsx
import { useState, useRef, useCallback } from 'react'
import until from 'untiljs'

// Custom hook for untiljs
function useUntil<T>(initialValue: T) {
  const ref = useRef(initialValue)
  const [value, setValue] = useState(initialValue)

  const refLike = useRef({
    get value() { return ref.current },
    set value(newValue: T) {
      ref.current = newValue
      setValue(newValue)
    }
  })

  const setValueAndRef = useCallback((newValue: T) => {
    ref.current = newValue
    setValue(newValue)
  }, [])

  return {
    value,
    setValue: setValueAndRef,
    until: () => until(refLike.current)
  }
}

// Usage
function MyComponent() {
  const data = useUntil(0)

  const handleClick = async () => {
    data.setValue(0)
    setTimeout(() => data.setValue(5), 1000)
    await data.until().toBe(5) // ✅ Works correctly!
    console.log('Value is now 5!')
  }

  return <button onClick={handleClick}>Test</button>
}
```

#### ✅ Alternative: Subscribable Store

```tsx
function createSubscribable<T>(initialValue: T) {
  let value = initialValue
  const listeners = new Set<(value: T) => void>()

  return {
    get value() { return value },
    set value(newValue: T) {
      value = newValue
      listeners.forEach(l => l(value))
    },
    subscribe(callback: (value: T) => void) {
      listeners.add(callback)
      callback(value)
      return () => listeners.delete(callback)
    }
  }
}

// Usage with useEffect
const store = createSubscribable(0)
await until(store).toBe(5) // ✅ Most efficient!
```

### RxJS Integration

```typescript
import { BehaviorSubject } from 'rxjs'
import until from 'untiljs'

// Convert BehaviorSubject to Subscribable
const subject = new BehaviorSubject(1)

const subscribable = {
  get value() {
    return subject.value
  },
  subscribe(callback: (value: number) => void) {
    const subscription = subject.subscribe(callback)
    return () => subscription.unsubscribe()
  }
}

await until(subscribable).toBe(2)

// Or use getter function
await until(() => subject.value).toBe(2)
```

### Node.js Usage

```typescript
import until from 'untiljs'
import { EventEmitter } from 'events'

// Wait for event-based state changes
const emitter = new EventEmitter()
let status = 'pending'

emitter.on('ready', () => {
  status = 'ready'
})

setTimeout(() => emitter.emit('ready'), 1000)
await until(() => status).toBe('ready')

// Wait for file changes (with fs.watch)
import fs from 'fs'
import { readFile } from 'fs/promises'

let fileContent = await readFile('./data.txt', 'utf-8')
const watcher = fs.watch('./data.txt', async () => {
  fileContent = await readFile('./data.txt', 'utf-8')
})

await until(() => fileContent).toMatch(content => content.includes('target'))
watcher.close()
```

### Array Methods

```typescript
import until from 'untiljs'

// Wait for array to contain value
let items = ['apple', 'banana']
setTimeout(() => {
  items.push('orange')
}, 500)

await until(() => items).toContains('orange')

// Arrays also support all value methods
let numbers = [1, 2, 3]
setTimeout(() => {
  numbers = [1, 2, 3, 4, 5]
}, 500)

await until(() => numbers).toBe([1, 2, 3, 4, 5], { deep: true })
await until(() => numbers).toMatch(arr => arr.length >= 5)
```

### Timeout Handling

```typescript
import until from 'untiljs'

// Timeout without throwOnTimeout - returns current value
let value = 0
const result = await until(() => value).toBe(5, { timeout: 1000 })
console.log(result) // 0 (current value after timeout)

// Timeout with throwOnTimeout - rejects promise
try {
  await until(() => value).toBe(5, { timeout: 1000, throwOnTimeout: true })
} catch (error) {
  console.error('Timeout!', error)
}
```

### Not Modifier

```typescript
import until from 'untiljs'

// Wait until value is NOT 5
let value = 5
setTimeout(() => {
  value = 10
}, 500)

await until(() => value).not.toBe(5)
console.log(value) // 10

// Wait until value is NOT null
let data = null
setTimeout(() => {
  data = 'loaded'
}, 500)

await until(() => data).not.toBeNull()
console.log(data) // 'loaded'
```

### Deep Comparison

```typescript
import until from 'untiljs'

// Compare nested objects
let config = { server: { port: 3000 } }
setTimeout(() => {
  config = { server: { port: 8080 } }
}, 500)

await until(() => config).toBe({ server: { port: 8080 } }, { deep: true })

// Limit comparison depth
await until(() => config).toBe(
  { server: { port: 8080 } },
  { deep: 2 } // Compare up to 2 levels deep
)
```

## Migration Guide (v1.x → v2.x)

### Breaking Changes

1. **No longer requires `@vue/reactivity`** - The library is now framework-agnostic
2. **Vue refs work directly** - Pass `ref` directly or use `() => ref.value`
3. **Removed `flush` option** - This was Vue-specific and has no generic equivalent
4. **`deep` option now accepts `boolean | number`** - More flexible depth control

### Quick Migration

```typescript
// v1.x
import { ref } from 'vue'
import until from 'untiljs'

const count = ref(0)
await until(count).toBe(5)

// v2.x - Same code still works!
import { ref } from 'vue'
import until from 'untiljs'

const count = ref(0)
await until(count).toBe(5) // Direct ref usage still supported
// OR
await until(() => count.value).toBe(5) // Getter function also works
```

### Comparison Table

| v1.x                        | v2.x                                                          |
| --------------------------- | ------------------------------------------------------------- |
| `until(ref)`                | `until(ref)` (still works!) or `until(() => ref.value)`       |
| `until(ref).toBe(otherRef)` | `until(ref).toBe(otherRef.value)`                             |
| `{ flush: 'sync' }`         | (removed - uses requestAnimationFrame/setImmediate)           |
| `{ deep: true }`            | `{ deep: true }` (unchanged) or `{ deep: 5 }` for depth limit |

## Using unpkg CDN

```html
<script src="https://unpkg.com/untiljs@latest/dist/index.iife.min.js"></script>
<script>
  let value = 0
  setTimeout(() => {
    value = 5
  }, 1000)

  until(() => value)
    .toBe(5)
    .then(() => {
      console.log('Value is 5!')
    })
</script>
```

## Browser Support

| Browser | Version           |
| ------- | ----------------- |
| Chrome  | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari  | Latest 2 versions |
| Edge    | Latest 2 versions |
| Node.js | >= 16             |

## Support & Issues

Please open an issue [here](https://github.com/saqqdy/untiljs/issues).

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/untiljs.svg?style=flat-square
[npm-url]: https://npmjs.org/package/untiljs
[codacy-image]: https://app.codacy.com/project/badge/Grade/f70d4880e4ad4f40aa970eb9ee9d0696
[codacy-url]: https://www.codacy.com/gh/saqqdy/untiljs/dashboard?utm_source=github.com&utm_medium=referral&utm_content=saqqdy/untiljs&utm_campaign=Badge_Grade
[tree-shaking-image]: https://badgen.net/bundlephobia/tree-shaking/untiljs
[tree-shaking-url]: https://bundlephobia.com/package/untiljs
[typescript-url]: https://badgen.net/badge/icon/typescript?icon=typescript&label
[codecov-image]: https://img.shields.io/codecov/c/github/saqqdy/untiljs.svg?style=flat-square
[codecov-url]: https://codecov.io/github/saqqdy/untiljs?branch=master
[download-image]: https://img.shields.io/npm/dm/untiljs.svg?style=flat-square
[download-url]: https://npmjs.org/package/untiljs
[gzip-image]: http://img.badgesize.io/https://unpkg.com/untiljs/dist/index.min.js?compression=gzip&label=gzip%20size:%20JS
[gzip-url]: http://img.badgesize.io/https://unpkg.com/untiljs/dist/index.min.js?compression=gzip&label=gzip%20size:%20JS
[license-image]: https://img.shields.io/badge/License-MIT-blue.svg
[license-url]: LICENSE
[sonar-image]: https://sonarcloud.io/api/project_badges/quality_gate?project=saqqdy_untiljs
[sonar-url]: https://sonarcloud.io/dashboard?id=saqqdy_untiljs
