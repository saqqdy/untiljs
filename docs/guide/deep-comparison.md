# Deep Comparison

UntilJS supports deep comparison for objects and arrays.

## Basic Deep Comparison

```typescript
import until from 'untiljs'

let config = { server: { port: 3000 } }
setTimeout(() => {
  config = { server: { port: 8080 } }
}, 500)

// Without deep: false (reference comparison)
await until(() => config).toBe({ server: { port: 8080 } }) // Won't match!

// With deep: true
await until(() => config).toBe({ server: { port: 8080 } }, { deep: true }) // Matches!
```

## Depth Limit

You can specify a numeric depth limit:

```typescript
import until from 'untiljs'

let obj = {
  level1: {
    level2: {
      level3: {
        value: 0
      }
    }
  }
}

setTimeout(() => {
  obj = {
    level1: {
      level2: {
        level3: {
          value: 5
        }
      }
    }
  }
}, 500)

// Compare only 2 levels deep
await until(() => obj).toBe(
  { level1: { level2: { level3: { value: 5 } } } },
  { deep: 2 } // Only compares level1 and level2
)

// Compare all levels
await until(() => obj).toBe(
  { level1: { level2: { level3: { value: 5 } } } },
  { deep: true } // Unlimited depth
)
```

## Array Deep Comparison

```typescript
import until from 'untiljs'

let numbers = [1, 2, 3]
setTimeout(() => {
  numbers = [1, 2, 3, 4, 5]
}, 500)

await until(() => numbers).toBe([1, 2, 3, 4, 5], { deep: true })
```

## Nested Objects and Arrays

```typescript
import until from 'untiljs'

let data = {
  users: [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ]
}

setTimeout(() => {
  data = {
    users: [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Bob' }
    ]
  }
}, 500)

await until(() => data).toBe(
  {
    users: [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Bob' }
    ]
  },
  { deep: true }
)
```

## Deep with toMatch

```typescript
import until from 'untiljs'

let config = { settings: { theme: 'light' } }
setTimeout(() => {
  config = { settings: { theme: 'dark' } }
}, 500)

// Deep comparison in custom condition
await until(() => config).toMatch(
  v => v.settings.theme === 'dark',
  { deep: true }
)
```

## Performance Considerations

Deep comparison can be slower for large objects. Consider:

1. **Use depth limits** when you know the structure
2. **Use toMatch** with a specific condition instead of toBe
3. **Compare only what you need**

```typescript
// Faster - only compare specific property
await until(() => config.settings.theme).toBe('dark')

// Slower - compare entire object
await until(() => config).toBe(
  { settings: { theme: 'dark' } },
  { deep: true }
)
```

## Deep with Vue Refs

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const user = ref({ profile: { name: '' } })

setTimeout(() => {
  user.value = { profile: { name: 'John' } }
}, 1000)

await until(user).toMatch(
  v => v.profile.name === 'John',
  { deep: true }
)
```
