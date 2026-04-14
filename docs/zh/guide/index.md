# 介绍

**UntilJS** 是一个基于 Promise 的一次性变化监听库。它框架无关，支持 Vue、React、Angular、Svelte、Node.js 和原生 JavaScript。

## 为什么选择 UntilJS？

在处理异步状态变化时，你经常需要等待特定条件满足。虽然可以使用 `setInterval` 轮询或复杂的事件发射器，但 UntilJS 提供了简洁的基于 Promise 的 API。

### 问题所在

```typescript
// 传统方式 - 轮询
let value = 0
setTimeout(() => { value = 5 }, 1000)

// 你需要这样写：
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

### 解决方案

```typescript
// 使用 UntilJS
import until from 'untiljs'

let value = 0
setTimeout(() => { value = 5 }, 1000)

await until(() => value).toBe(5)
```

## 核心特性

- **框架无关** - 支持任何 JavaScript 框架或环境
- **TypeScript 支持** - 完整的类型定义
- **多种输入类型** - 支持 getter 函数、Subscribable 对象、RefLike 对象和原始值
- **深度比较** - 可配置的对象/数组比较深度
- **超时支持** - 内置超时处理，支持可选的错误抛出
- **可 Tree-shake** - 按需打包
- **零依赖** - 仅依赖轻量级的 `js-cool`
- **完善测试** - 227+ 测试用例

## 使用场景

### 等待异步数据

```typescript
let data = null
fetch('/api/data').then(res => res.json()).then(json => { data = json })

await until(() => data).toBeTruthy()
console.log('数据已加载:', data)
```

### 表单验证

```typescript
const isValid = ref(false)

// 用户正确填写表单后
setTimeout(() => { isValid.value = true }, 1000)

await until(isValid).toBe(true)
console.log('表单验证通过，可以提交')
```

### 事件驱动的状态变化

```typescript
const emitter = new EventEmitter()
let status = 'pending'

emitter.on('ready', () => { status = 'ready' })
setTimeout(() => emitter.emit('ready'), 1000)

await until(() => status).toBe('ready')
```

### WebSocket 消息

```typescript
const ws = new WebSocket('wss://example.com')
let connected = false

ws.onopen = () => { connected = true }

await until(() => connected).toBe(true)
console.log('WebSocket 已连接！')
```

## 浏览器支持

| 浏览器 | 版本 |
| ------- | ----------------- |
| Chrome  | 最新 2 个版本 |
| Firefox | 最新 2 个版本 |
| Safari  | 最新 2 个版本 |
| Edge    | 最新 2 个版本 |
| Node.js | >= 16             |
