# API Overview

UntilJS provides a simple, Promise-based API for waiting on value changes.

## Installation

::: code-group

```bash [pnpm]
pnpm add untiljs
```

```bash [npm]
npm install untiljs
```

```bash [yarn]
yarn add untiljs
```

:::

## Quick Reference

### Functions

| Function | Description |
|----------|-------------|
| [until()](/api/until) | Main function to create an Until instance |
| [createStore()](/api/create-store) | Create a reactive store for use with until |

### Types

| Type | Description |
|------|-------------|
| [WatchSource](/api/watch-source) | Types of values that can be watched |
| [Subscribable](/api/subscribable) | Interface for subscribable objects |
| [UntilToMatchOptions](/api/options) | Options for wait methods |

### Methods

| Method | Description |
|--------|-------------|
| [toBe(value, options?)](/api/methods/toBe) | Wait until value equals target |
| [toMatch(condition, options?)](/api/methods/toMatch) | Wait until condition returns true |
| [toBeTruthy(options?)](/api/methods/toBeTruthy) | Wait until value is truthy |
| [toBeNull(options?)](/api/methods/toBeNull) | Wait until value is null |
| [toBeUndefined(options?)](/api/methods/toBeUndefined) | Wait until value is undefined |
| [toBeNaN(options?)](/api/methods/toBeNaN) | Wait until value is NaN |
| [changed(options?)](/api/methods/changed) | Wait until value changes |
| [changedTimes(n, options?)](/api/methods/changedTimes) | Wait until value changes n times |
| [toContains(value, options?)](/api/methods/toContains) | Wait until array contains value |
| [not.*](/api/methods/not) | Inverse of any method above |

## Basic Usage

```typescript
import until from 'untiljs'

// Basic usage
let value = 0
setTimeout(() => { value = 5 }, 1000)

await until(() => value).toBe(5)
```

## Return Value

All methods return a Promise that resolves to:

- The current value when the condition is met
- The current value on timeout (if `throwOnTimeout` is false)
- Rejects on timeout (if `throwOnTimeout` is true)

```typescript
const result = await until(() => value).toBe(5)
console.log(result) // 5
```
