# Installation

## Package Managers

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

## CDN

You can also use UntilJS directly via CDN:

```html
<script src="https://unpkg.com/untiljs@latest/dist/index.iife.min.js"></script>
<script>
  let value = 0
  setTimeout(() => { value = 5 }, 1000)

  until(() => value)
    .toBe(5)
    .then(() => {
      console.log('Value is 5!')
    })
</script>
```

## Requirements

- Node.js >= 16 (for Node.js usage)
- Modern browser with ES6+ support

## TypeScript

UntilJS is written in TypeScript and provides full type definitions out of the box. No additional `@types` package is needed.

```typescript
import until, { WatchSource, UntilToMatchOptions } from 'untiljs'

// Types are automatically inferred
const result = await until(() => someValue).toBe(5)
```

## Verifying Installation

```typescript
import until from 'untiljs'

console.log(typeof until) // 'function'
```
