# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-03-13

### Breaking Changes

- **Framework Agnostic**: Removed dependency on `@vue/reactivity`. The library is now completely framework-agnostic and works with Vue, React, Angular, Svelte, Node.js, and vanilla JavaScript.
- **Removed `flush` option**: This was Vue-specific and has no generic equivalent in a framework-agnostic implementation.
- **`deep` option now accepts `boolean | number`**: More flexible depth control for object/array comparison.

### Added

- **Subscribable Interface**: New interface for reactive data sources that can be subscribed to. Compatible with RxJS BehaviorSubject, custom reactive objects, etc.
- **RefLike Support**: Objects with a `value` property (like Vue refs) are now automatically supported. You can pass refs directly: `until(ref).toBe(5)`.
- **Multiple WatchSource Types**: The library now supports four input types:
  - Getter functions: `() => value`
  - Subscribable objects: `{ value, subscribe }`
  - RefLike objects: `{ value }` (Vue refs, custom reactive objects)
  - Plain values: static values
- **Deep Equality for Date and RegExp**: Added special handling for Date (compares by time value) and RegExp (compares by source and flags) objects.
- **Comprehensive Test Suite**: Added 210+ test cases with Vitest, covering all methods and edge cases.
- **Node.js Examples**: Added `examples/nodejs/node-example.js` demonstrating usage in Node.js environment.
- **Vanilla HTML Example**: Added `examples/vanilla/index.html` for CDN usage demonstration.

### Changed

- **Improved `toValue` function**: Now correctly handles Subscribable, RefLike, getter functions, and plain values with proper priority order.
- **Enhanced `deepEqual` function**: Better performance and correct handling of special objects (Date, RegExp).
- **`UntilArray` extends `UntilValue`**: Array sources now have access to all value comparison methods (`toBe`, `toBeTruthy`, etc.) in addition to `toContains`.
- **`toContains` uses deep equality**: Now properly compares objects in arrays using deep equality.

### Fixed

- Fixed type errors when using `until(ref).toBe()` with RefLike objects containing arrays.
- Fixed deep comparison not working correctly with nested objects at specific depth limits.
- Fixed Date objects comparison (now compares by time value instead of reference).

### Migration Guide

#### Before (v1.x)

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const count = ref(0)

// Direct ref usage
await until(count).toBe(5)

// With another ref as target
const target = ref(5)
await until(count).toBe(target)
```

#### After (v2.x)

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const count = ref(0)

// Method 1: Pass ref directly (still works!)
await until(count).toBe(5)

// Method 2: Use getter function (works everywhere)
await until(() => count.value).toBe(5)

// Plain value or getter
const target = 5
await until(count).toBe(target)
```

---

## [1.1.0] - 2025-01-20

### Fixed

- Cleanup at next tick to avoid memory leak

### Changed

- Updated dependencies

---

## [1.0.0] - 2024-08-14

### Added

- Initial release
- Promise-based one-time watch for changes
- Vue 3 integration with `@vue/reactivity`
- Methods: `toBe`, `toMatch`, `toBeTruthy`, `toBeNull`, `toBeUndefined`, `toBeNaN`, `changed`, `changedTimes`, `not` modifier
- Timeout support with `throwOnTimeout` option
- Deep comparison option
- TypeScript support
