# 安装

## 包管理器

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

你也可以直接通过 CDN 使用 UntilJS：

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

## 环境要求

- Node.js >= 16（用于 Node.js 环境）
- 支持 ES6+ 的现代浏览器

## TypeScript

UntilJS 使用 TypeScript 编写，开箱即用提供完整的类型定义。不需要额外的 `@types` 包。

```typescript
import until, { WatchSource, UntilToMatchOptions } from 'untiljs'

// 类型自动推断
const result = await until(() => someValue).toBe(5)
```

## 验证安装

```typescript
import until from 'untiljs'

console.log(typeof until) // 'function'
```
