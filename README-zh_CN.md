<div style="text-align: center;" align="center">

# untiljs

基于 Promise 的一次性变化监听 - **框架无关**

[![NPM version][npm-image]][npm-url]
[![Codacy Badge][codacy-image]][codacy-url]
[![tree shaking][tree-shaking-image]][tree-shaking-url]
![typescript][typescript-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]
[![gzip][gzip-image]][gzip-url]
[![License][license-image]][license-url]

[![Sonar][sonar-image]][sonar-url]

</div>

<div style="text-align: center; margin-bottom: 20px;" align="center">

### **[API 文档](https://www.saqqdy.com/untiljs)** • **[更新日志](./CHANGELOG.md)**

**使用其他语言阅读：[English](./README.md) | 简体中文**

</div>

## 特性

- **框架无关** - 支持 Vue、React、Angular、Svelte、Node.js 和原生 JavaScript
- **TypeScript 支持** - 包含完整的类型定义
- **多种输入类型** - 支持 getter 函数、Subscribable 对象、RefLike 对象和普通值
- **深度比较** - 可配置对象/数组比较的深度
- **超时支持** - 内置超时处理，可选抛出错误
- **Tree-shakeable** - 只打包你使用的代码
- **零依赖** - 仅 `js-cool` 作为轻量级运行时依赖
- **测试完善** - 210+ 测试用例，覆盖全面

## 体验

在线体验 untiljs 搭配使用 vue3.0 [Edit in CodeSandbox](https://codesandbox.io/p/sandbox/github/saqqdy/untiljs/tree/master/examples/vue3)
在线体验 untiljs 搭配使用 react [Edit in CodeSandbox](https://codesandbox.io/p/sandbox/github/saqqdy/untiljs/tree/master/examples/react)

## 安装

```bash
# 使用pnpm
$ pnpm install untiljs

# 使用npm
$ npm install untiljs --save

# 使用 yarn
$ yarn add untiljs
```

## 快速开始

```typescript
import until from 'untiljs'

// 使用 getter 函数的基础用法
let value = 1
setTimeout(() => {
  value = 2
}, 1000)

await until(() => value).toBe(2)
console.log('Value 现在是 2!')
```

## API 参考

### WatchSource

`WatchSource<T>` 可以是以下之一：

| 类型             | 示例                   | 描述                                       |
| ---------------- | ---------------------- | ------------------------------------------ |
| **Getter 函数**  | `() => value`          | 返回当前值的函数                           |
| **Subscribable** | `{ value, subscribe }` | 具有 `value` 属性和 `subscribe` 方法的对象 |
| **RefLike**      | `{ value }`            | 具有 `value` 属性的对象（如 Vue ref）      |
| **普通值**       | `5`, `'hello'`         | 静态值                                     |

### Subscribable 接口

```typescript
interface Subscribable<T> {
  readonly value: T
  subscribe(callback: (value: T) => void): () => void
}
```

### 方法

| 方法                           | 描述                     |
| ------------------------------ | ------------------------ |
| `toBe(value, options?)`        | 等待源值等于给定值       |
| `toMatch(condition, options?)` | 等待条件返回 true        |
| `toBeTruthy(options?)`         | 等待值为真值             |
| `toBeNull(options?)`           | 等待值为 null            |
| `toBeUndefined(options?)`      | 等待值为 undefined       |
| `toBeNaN(options?)`            | 等待值为 NaN             |
| `changed(options?)`            | 等待值发生变化           |
| `changedTimes(n, options?)`    | 等待值变化 n 次          |
| `toContains(value, options?)`  | 等待数组包含值（仅数组） |
| `not.*`                        | 以上任意方法的反向       |

### 选项

```typescript
interface UntilToMatchOptions {
  /** 超时时间（毫秒），0 表示永不超时 */
  timeout?: number

  /** 超时时是否拒绝 Promise（默认: false） */
  throwOnTimeout?: boolean

  /** 深度比较深度（true = 无限制，number = 指定深度） */
  deep?: boolean | number
}
```

## 使用示例

### 基础用法

```typescript
import until from 'untiljs'

// 等待值等于某值
let count = 0
setTimeout(() => {
  count = 5
}, 1000)
await until(() => count).toBe(5)

// 等待自定义条件
await until(() => count).toMatch(v => v > 3)

// 等待真值
let data = null
setTimeout(() => {
  data = { name: 'John' }
}, 500)
await until(() => data).toBeTruthy()

// 等待值变化
let value = 'initial'
setTimeout(() => {
  value = 'changed'
}, 1000)
await until(() => value).changed()

// 等待多次变化
await until(() => value).changedTimes(3)
```

### Vue 3 集成

```typescript
import { ref, computed } from 'vue'
import until from 'untiljs'

const count = ref(0)
const doubled = computed(() => count.value * 2)

// 方式 1: 直接传入 ref（推荐用于 Vue 用户！）
async function waitForValue() {
  await until(count).toBe(5)
  console.log('Count 达到 5!')
}

// 方式 2: 使用 getter 函数
async function waitForValueGetter() {
  await until(() => count.value).toBe(5)
  console.log('Count 达到 5!')
}

// 监听计算属性
async function waitForDoubled() {
  await until(doubled).toBe(10)
  console.log('Doubled 值达到 10!')
}

// 对象深度比较
const user = ref({ profile: { name: '' } })
setTimeout(() => {
  user.value = { profile: { name: 'John' } }
}, 1000)

await until(user).toMatch(v => v.profile.name === 'John', { deep: true })
```

### React 集成

> **重要提示**：由于 React 的闭包行为，直接使用 `until(() => stateValue)` 无法正常工作。请使用 `useRef` 或自定义 Hook。

#### ❌ 错误方式（无法工作）

```tsx
// 由于 React 的闭包行为，这无法检测到变化
const [value, setValue] = useState(0)
await until(() => value).toBe(5) // ❌ 总是看到旧值
```

#### ✅ 正确方式：useUntil Hook

```tsx
import { useCallback, useRef, useState } from 'react'
import until from 'untiljs'

// untiljs 自定义 Hook
function useUntil<T>(initialValue: T) {
  const ref = useRef(initialValue)
  const [value, setValue] = useState(initialValue)

  const refLike = useRef({
    get value() {
      return ref.current
    },
    set value(newValue: T) {
      ref.current = newValue
      setValue(newValue)
    }
  })

  const setValueAndRef = useCallback((newValue: T) => {
    ref.current = newValue
    setValue(newValue)
  }, [])

  return {
    value,
    setValue: setValueAndRef,
    until: () => until(refLike.current)
  }
}

// 使用
function MyComponent() {
  const data = useUntil(0)

  const handleClick = async () => {
    data.setValue(0)
    setTimeout(() => data.setValue(5), 1000)
    await data.until().toBe(5) // ✅ 正常工作！
    console.log('Value 现在是 5!')
  }

  return <button onClick={handleClick}>测试</button>
}
```

#### ✅ 替代方案：Subscribable Store

```tsx
function createSubscribable<T>(initialValue: T) {
  let value = initialValue
  const listeners = new Set<(value: T) => void>()

  return {
    get value() {
      return value
    },
    set value(newValue: T) {
      value = newValue
      listeners.forEach(l => l(value))
    },
    subscribe(callback: (value: T) => void) {
      listeners.add(callback)
      callback(value)
      return () => listeners.delete(callback)
    }
  }
}

// 配合 useEffect 使用
const store = createSubscribable(0)
await until(store).toBe(5) // ✅ 最高效！
```

#### ✅ 内置方案：`createStore`

untiljs v2.1+ 提供了内置的 `createStore` 函数，专为 React 设计：

```tsx
import { createStore } from 'untiljs'
import until from 'untiljs'

// 在组件外部创建 store，或使用 useRef
const store = createStore(0)

function MyComponent() {
  const [value, setValue] = useState(store.value)

  useEffect(() => store.subscribe(setValue), [])

  const handleClick = async () => {
    store.value = 5
    await until(store).toBe(5) // ✅ 简洁高效！
  }

  return <button onClick={handleClick}>测试</button>
}
```

### RxJS 集成

```typescript
import { BehaviorSubject } from 'rxjs'
import until from 'untiljs'

// 将 BehaviorSubject 转换为 Subscribable
const subject = new BehaviorSubject(1)

const subscribable = {
  get value() {
    return subject.value
  },
  subscribe(callback: (value: number) => void) {
    const subscription = subject.subscribe(callback)
    return () => subscription.unsubscribe()
  }
}

await until(subscribable).toBe(2)

// 或使用 getter 函数
await until(() => subject.value).toBe(2)
```

### Node.js 使用

```typescript
import until from 'untiljs'
import { EventEmitter } from 'events'

// 等待基于事件的状态变化
const emitter = new EventEmitter()
let status = 'pending'

emitter.on('ready', () => {
  status = 'ready'
})

setTimeout(() => emitter.emit('ready'), 1000)
await until(() => status).toBe('ready')

// 等待文件变化（使用 fs.watch）
import fs from 'fs'
import { readFile } from 'fs/promises'

let fileContent = await readFile('./data.txt', 'utf-8')
const watcher = fs.watch('./data.txt', async () => {
  fileContent = await readFile('./data.txt', 'utf-8')
})

await until(() => fileContent).toMatch(content => content.includes('target'))
watcher.close()
```

### 数组方法

```typescript
import until from 'untiljs'

// 等待数组包含值
let items = ['apple', 'banana']
setTimeout(() => {
  items.push('orange')
}, 500)

await until(() => items).toContains('orange')

// 数组也支持所有值比较方法
let numbers = [1, 2, 3]
setTimeout(() => {
  numbers = [1, 2, 3, 4, 5]
}, 500)

await until(() => numbers).toBe([1, 2, 3, 4, 5], { deep: true })
await until(() => numbers).toMatch(arr => arr.length >= 5)
```

### 超时处理

```typescript
import until from 'untiljs'

// 超时不抛出错误 - 返回当前值
let value = 0
const result = await until(() => value).toBe(5, { timeout: 1000 })
console.log(result) // 0（超时后的当前值）

// 超时抛出错误 - Promise 会被拒绝
try {
  await until(() => value).toBe(5, { timeout: 1000, throwOnTimeout: true })
} catch (error) {
  console.error('超时!', error)
}
```

### Not 修饰符

```typescript
import until from 'untiljs'

// 等待值不再是 5
let value = 5
setTimeout(() => {
  value = 10
}, 500)

await until(() => value).not.toBe(5)
console.log(value) // 10

// 等待值不再是 null
let data = null
setTimeout(() => {
  data = 'loaded'
}, 500)

await until(() => data).not.toBeNull()
console.log(data) // 'loaded'
```

### 深度比较

```typescript
import until from 'untiljs'

// 比较嵌套对象
let config = { server: { port: 3000 } }
setTimeout(() => {
  config = { server: { port: 8080 } }
}, 500)

await until(() => config).toBe({ server: { port: 8080 } }, { deep: true })

// 限制比较深度
await until(() => config).toBe(
  { server: { port: 8080 } },
  { deep: 2 } // 比较最多 2 层深度
)
```

## 迁移指南 (v1.x → v2.x)

### 重大变更

1. **不再依赖 `@vue/reactivity`** - 库现在是框架无关的
2. **Vue ref 直接支持** - 可以直接传入 `ref` 或使用 `() => ref.value`
3. **移除了 `flush` 选项** - 这是 Vue 特有的，没有通用替代方案
4. **`deep` 选项现在接受 `boolean | number`** - 更灵活的深度控制

### 快速迁移

```typescript
// v1.x
import { ref } from 'vue'
import until from 'untiljs'

const count = ref(0)
await until(count).toBe(5)

// v2.x - 相同代码仍然有效！
import { ref } from 'vue'
import until from 'untiljs'

const count = ref(0)
await until(count).toBe(5) // 直接传入 ref 仍然支持
// 或者
await until(() => count.value).toBe(5) // getter 函数也可以
```

### 对照表

| v1.x                        | v2.x                                                  |
| --------------------------- | ----------------------------------------------------- |
| `until(ref)`                | `until(ref)`（仍然有效！）或 `until(() => ref.value)` |
| `until(ref).toBe(otherRef)` | `until(ref).toBe(otherRef.value)`                     |
| `{ flush: 'sync' }`         | （已移除 - 使用 requestAnimationFrame/setImmediate）  |
| `{ deep: true }`            | `{ deep: true }`（不变）或 `{ deep: 5 }` 限制深度     |

## 使用 unpkg CDN

```html
<script src="https://unpkg.com/untiljs@latest/dist/index.iife.min.js"></script>
<script>
  let value = 0
  setTimeout(() => {
    value = 5
  }, 1000)

  until(() => value)
    .toBe(5)
    .then(() => {
      console.log('Value 是 5!')
    })
</script>
```

## 浏览器支持

| 浏览器  | 版本          |
| ------- | ------------- |
| Chrome  | 最新 2 个版本 |
| Firefox | 最新 2 个版本 |
| Safari  | 最新 2 个版本 |
| Edge    | 最新 2 个版本 |
| Node.js | >= 16         |

## 问题和支持

请在此处 [提交 issue](https://github.com/saqqdy/untiljs/issues)。

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/untiljs.svg?style=flat-square
[npm-url]: https://npmjs.org/package/untiljs
[codacy-image]: https://app.codacy.com/project/badge/Grade/f70d4880e4ad4f40aa970eb9ee9d0696
[codacy-url]: https://www.codacy.com/gh/saqqdy/untiljs/dashboard?utm_source=github.com&utm_medium=referral&utm_content=saqqdy/untiljs&utm_campaign=Badge_Grade
[tree-shaking-image]: https://badgen.net/bundlephobia/tree-shaking/untiljs
[tree-shaking-url]: https://bundlephobia.com/package/untiljs
[typescript-url]: https://badgen.net/badge/icon/typescript?icon=typescript&label
[codecov-image]: https://img.shields.io/codecov/c/github/saqqdy/untiljs.svg?style=flat-square
[codecov-url]: https://codecov.io/github/saqqdy/untiljs?branch=master
[download-image]: https://img.shields.io/npm/dm/untiljs.svg?style=flat-square
[download-url]: https://npmjs.org/package/untiljs
[gzip-image]: http://img.badgesize.io/https://unpkg.com/untiljs/dist/index.min.js?compression=gzip&label=gzip%20size:%20JS
[gzip-url]: http://img.badgesize.io/https://unpkg.com/untiljs/dist/index.min.js?compression=gzip&label=gzip%20size:%20JS
[license-image]: https://img.shields.io/badge/License-MIT-blue.svg
[license-url]: LICENSE
[sonar-image]: https://sonarcloud.io/api/project_badges/quality_gate?project=saqqdy_untiljs
[sonar-url]: https://sonarcloud.io/dashboard?id=saqqdy_untiljs
