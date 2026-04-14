# Migration Guide (v1 → v2)

Version 2.0 introduces significant changes to make UntilJS framework-agnostic. This guide will help you migrate from v1.x.

## Breaking Changes

1. **No longer requires `@vue/reactivity`** - The library is now framework-agnostic
2. **Vue refs work directly** - Pass `ref` directly or use `() => ref.value`
3. **Removed `flush` option** - This was Vue-specific and has no generic equivalent
4. **`deep` option now accepts `boolean | number`** - More flexible depth control

## Quick Migration

::: code-group

```typescript [v1.x]
import { ref } from 'vue'
import until from 'untiljs'

const count = ref(0)
await until(count).toBe(5)
```

```typescript [v2.x - Same code works!]
import { ref } from 'vue'
import until from 'untiljs'

const count = ref(0)
await until(count).toBe(5) // Direct ref usage still supported
// OR
await until(() => count.value).toBe(5) // Getter function also works
```

:::

## API Changes

### flush Option Removed

The `flush` option was specific to Vue's reactivity system and has been removed.

::: code-group

```typescript [v1.x]
await until(count).toBe(5, { flush: 'sync' })
```

```typescript [v2.x]
await until(count).toBe(5) // Uses requestAnimationFrame/setImmediate
```

:::

### deep Option Enhanced

The `deep` option now supports numeric depth limits.

::: code-group

```typescript [v1.x]
await until(() => obj).toBe(expected, { deep: true })
```

```typescript [v2.x]
await until(() => obj).toBe(expected, { deep: true }) // Still works
// OR
await until(() => obj).toBe(expected, { deep: 3 }) // Limit to 3 levels
```

:::

### Ref Comparison

When comparing refs, you now need to compare their values:

::: code-group

```typescript [v1.x]
const otherRef = ref(5)
await until(count).toBe(otherRef)
```

```typescript [v2.x]
const otherRef = ref(5)
await until(count).toBe(otherRef.value)
```

:::

## New Features in v2

### createStore

A new helper for creating reactive stores in React and other frameworks:

```typescript
import { createStore } from 'untiljs'
import until from 'untiljs'

const store = createStore(0)

// In React
store.value = 5
await until(store).toBe(5)
```

### Better Framework Support

v2 provides dedicated guides for:
- React (with hooks and stores)
- Angular (with signals)
- Svelte (with runes)
- Node.js
- Vanilla JavaScript

## Comparison Table

| v1.x | v2.x |
|------|------|
| `until(ref)` | `until(ref)` (still works!) or `until(() => ref.value)` |
| `until(ref).toBe(otherRef)` | `until(ref).toBe(otherRef.value)` |
| `{ flush: 'sync' }` | (removed - uses requestAnimationFrame/setImmediate) |
| `{ deep: true }` | `{ deep: true }` (unchanged) or `{ deep: 5 }` for depth limit |

## Need Help?

If you encounter any issues during migration, please [open an issue](https://github.com/saqqdy/untiljs/issues) on GitHub.
