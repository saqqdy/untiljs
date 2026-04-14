---
layout: doc
title: 在线体验
titleTemplate: 在线体验 UntilJS
---

# 在线体验

交互式体验 UntilJS！尝试不同的方法，看看它们是如何工作的。

<Playground />

## 快速示例

### 基础用法

```typescript
import until from 'untiljs'

// 等待某个值
let count = 0
setTimeout(() => count = 5, 1000)
await until(() => count).toBe(5)

// 等待自定义条件
await until(() => count).toMatch(v => v > 3)

// 等待真值
let data = null
setTimeout(() => data = { name: 'John' }, 500)
await until(() => data).toBeTruthy()
```

### 带超时

```typescript
// 超时不抛出错误
const result = await until(() => value).toBe(5, { timeout: 3000 })

// 超时抛出错误
try {
  await until(() => value).toBe(5, { timeout: 3000, throwOnTimeout: true })
} catch (e) {
  console.log('超时了！')
}
```

### 深度比较

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

### Not 修饰符

```typescript
// 等待不再是 null
let data = null
setTimeout(() => data = 'loaded', 500)
await until(() => data).not.toBeNull()

// 等待不再等于某值
let value = 5
setTimeout(() => value = 10, 500)
await until(() => value).not.toBe(5)
```
