# WatchSource

UntilJS 可监听的值类型。

## 定义

```typescript
type WatchSource<T> =
  | (() => T)           // Getter 函数
  | Subscribable<T>     // 可订阅对象
  | RefLike<T>          // Ref 类型对象（如 Vue ref）
  | T                   // 原始值
```

## 类型

### Getter 函数

返回当前值的函数。最常用的方式。

```typescript
import until from 'untiljs'

let count = 0
const source = () => count

await until(source).toBe(5)
// 或内联
await until(() => count).toBe(5)
```

### Subscribable

具有 `value` 属性和 `subscribe` 方法的对象。

```typescript
interface Subscribable<T> {
  readonly value: T
  subscribe(callback: (value: T) => void): () => void
}
```

```typescript
import until, { createStore } from 'untiljs'

const store = createStore(0)

// createStore 返回 Subscribable
await until(store).toBe(5)
```

### RefLike

具有 `value` 属性的对象。Vue refs 属于 RefLike。

```typescript
interface RefLike<T> {
  value: T
}
```

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const count = ref(0)

// Vue refs 是 RefLike
await until(count).toBe(5)
```

### 原始值

永远不会变化的静态值。在 UntilJS 中不太有用。

```typescript
import until from 'untiljs'

// 这会超时，因为值永远不会变化
await until(5).toBe(10, { timeout: 1000 })
```

## 选择正确的类型

| 类型 | 使用场景 | 框架 |
|------|----------|------|
| Getter 函数 | 任何情况 | 所有 |
| Subscribable | 需要响应式 store | React, 原生 JS |
| RefLike | 使用 Vue refs | Vue |
| 原始值 | 永不变化（罕见） | 所有 |

## 最佳实践

### Vue

直接使用 RefLike 或 getter 函数：

```typescript
// 推荐：直接传递 ref
await until(count).toBe(5)

// 也可以：使用 getter
await until(() => count.value).toBe(5)
```

### React

由于闭包行为，使用 Subscribable（createStore）：

```typescript
const store = createStore(0)
await until(store).toBe(5)
```

### Angular Signals

使用 getter 函数：

```typescript
const count = signal(0)
await until(() => count()).toBe(5)
```

### Svelte Runes

使用 getter 函数：

```typescript
let count = $state(0)
await until(() => count).toBe(5)
```

## 相关链接

- [until()](/zh/api/until)
- [Subscribable](/zh/api/subscribable)
