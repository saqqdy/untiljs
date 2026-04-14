---
layout: doc
title: Playground
titleTemplate: Try UntilJS Online
---

# Playground

Try UntilJS interactively! Experiment with different methods and see how they work.

<Playground />

## Quick Examples

### Basic Usage

```typescript
import until from 'untiljs'

// Wait for a value
let count = 0
setTimeout(() => count = 5, 1000)
await until(() => count).toBe(5)

// Wait for custom condition
await until(() => count).toMatch(v => v > 3)

// Wait for truthy value
let data = null
setTimeout(() => data = { name: 'John' }, 500)
await until(() => data).toBeTruthy()
```

### With Timeout

```typescript
// Timeout without throwing
const result = await until(() => value).toBe(5, { timeout: 3000 })

// Timeout with throwing
try {
  await until(() => value).toBe(5, { timeout: 3000, throwOnTimeout: true })
} catch (e) {
  console.log('Timed out!')
}
```

### With Deep Comparison

```typescript
let config = { server: { port: 3000 } }
setTimeout(() => {
  config = { server: { port: 8080 } }
}, 500)

await until(() => config).toBe(
  { server: { port: 8080 } },
  { deep: true }
)
```

### Not Modifier

```typescript
// Wait until NOT null
let data = null
setTimeout(() => data = 'loaded', 500)
await until(() => data).not.toBeNull()

// Wait until NOT equal
let value = 5
setTimeout(() => value = 10, 500)
await until(() => value).not.toBe(5)
```
