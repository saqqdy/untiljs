# API 概览

UntilJS 提供简洁的基于 Promise 的 API 用于等待值的变化。

## 安装

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

## 快速参考

### 函数

| 函数 | 描述 |
|----------|-------------|
| [until()](/zh/api/until) | 创建 Until 实例的主函数 |
| [createStore()](/zh/api/create-store) | 创建可响应的 store |

### 类型

| 类型 | 描述 |
|------|-------------|
| [WatchSource](/zh/api/watch-source) | 可监听的值类型 |
| [Subscribable](/zh/api/subscribable) | 可订阅对象的接口 |
| [UntilToMatchOptions](/zh/api/options) | 等待方法的配置选项 |

### 方法

| 方法 | 描述 |
|--------|-------------|
| [toBe(value, options?)](/zh/api/methods/toBe) | 等待值等于目标值 |
| [toMatch(condition, options?)](/zh/api/methods/toMatch) | 等待条件返回 true |
| [toBeTruthy(options?)](/zh/api/methods/toBeTruthy) | 等待值为真 |
| [toBeNull(options?)](/zh/api/methods/toBeNull) | 等待值为 null |
| [toBeUndefined(options?)](/zh/api/methods/toBeUndefined) | 等待值为 undefined |
| [toBeNaN(options?)](/zh/api/methods/toBeNaN) | 等待值为 NaN |
| [changed(options?)](/zh/api/methods/changed) | 等待值发生变化 |
| [changedTimes(n, options?)](/zh/api/methods/changedTimes) | 等待值变化 n 次 |
| [toContains(value, options?)](/zh/api/methods/toContains) | 等待数组包含值 |
| [not.*](/zh/api/methods/not) | 任何方法的反向 |

## 基本用法

```typescript
import until from 'untiljs'

// 基本用法
let value = 0
setTimeout(() => { value = 5 }, 1000)

await until(() => value).toBe(5)
```

## 返回值

所有方法返回一个 Promise，解析为：

- 条件满足时的当前值
- 超时时的当前值（如果 `throwOnTimeout` 为 false）
- 超时时拒绝（如果 `throwOnTimeout` 为 true）

```typescript
const result = await until(() => value).toBe(5)
console.log(result) // 5
```