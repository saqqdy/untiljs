# Introduction

**UntilJS** is a Promise-based library for one-time watching changes in values. It's framework-agnostic and works with Vue, React, Angular, Svelte, Node.js, and vanilla JavaScript.

## Why UntilJS?

When working with asynchronous state changes, you often need to wait for a specific condition to be met. While you could use polling with `setInterval` or complex event emitters, UntilJS provides a clean, Promise-based API that makes this trivial.

### The Problem

```typescript
// Traditional approach - polling
let value = 0
setTimeout(() => { value = 5 }, 1000)

// You'd need something like this:
function waitForValue(target: number) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (value === target) {
        clearInterval(interval)
        resolve(value)
      }
    }, 10)
  })
}

await waitForValue(5)
```

### The Solution

```typescript
// With UntilJS
import until from 'untiljs'

let value = 0
setTimeout(() => { value = 5 }, 1000)

await until(() => value).toBe(5)
```

## Key Features

- **Framework Agnostic** - Works with any JavaScript framework or environment
- **TypeScript Support** - Full type definitions included
- **Multiple Input Types** - Supports getter functions, Subscribable objects, RefLike objects, and plain values
- **Deep Comparison** - Configurable depth for object/array comparison
- **Timeout Support** - Built-in timeout handling with optional error throwing
- **Tree-shakeable** - Only bundle what you use
- **Zero Dependencies** - Only `js-cool` as a lightweight runtime dependency
- **Well Tested** - 227+ test cases with comprehensive coverage

## Use Cases

### Waiting for Async Data

```typescript
let data = null
fetch('/api/data').then(res => res.json()).then(json => { data = json })

await until(() => data).toBeTruthy()
console.log('Data loaded:', data)
```

### Form Validation

```typescript
const isValid = ref(false)

// After user fills the form correctly
setTimeout(() => { isValid.value = true }, 1000)

await until(isValid).toBe(true)
console.log('Form is valid, proceed with submission')
```

### Event-based State Changes

```typescript
const emitter = new EventEmitter()
let status = 'pending'

emitter.on('ready', () => { status = 'ready' })
setTimeout(() => emitter.emit('ready'), 1000)

await until(() => status).toBe('ready')
```

### WebSocket Messages

```typescript
const ws = new WebSocket('wss://example.com')
let connected = false

ws.onopen = () => { connected = true }

await until(() => connected).toBe(true)
console.log('WebSocket connected!')
```

## Browser Support

| Browser | Version           |
| ------- | ----------------- |
| Chrome  | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari  | Latest 2 versions |
| Edge    | Latest 2 versions |
| Node.js | >= 16             |
