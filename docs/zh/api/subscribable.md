# Subscribable

可订阅值变化的对象接口。

## 定义

```typescript
interface Subscribable<T> {
  /** 当前值 */
  readonly value: T

  /**
   * 订阅值变化
   * @param callback 值变化时调用的函数
   * @returns 取消订阅函数
   */
  subscribe(callback: (value: T) => void): () => void
}
```

## 属性

### value

subscribable 的当前值。

```typescript
const store = createStore(0)
console.log(store.value) // 0

store.value = 5
console.log(store.value) // 5
```

### subscribe(callback)

订阅值变化。

- **参数：**
  - `callback: (value: T) => void` - 值变化时调用的函数
- **返回：** `() => void` - 取消订阅函数

```typescript
const store = createStore(0)

const unsubscribe = store.subscribe((value) => {
  console.log('新值:', value)
})

store.value = 5 // 输出: "新值: 5"

unsubscribe() // 停止监听
```

## 创建自定义 Subscribable

你可以创建自己的 Subscribable 对象：

```typescript
import until from 'untiljs'

function createCounter(initial = 0) {
  let value = initial
  const listeners = new Set<(value: number) => void>()

  return {
    get value() {
      return value
    },

    set value(newValue: number) {
      value = newValue
      listeners.forEach(listener => listener(value))
    },

    subscribe(callback: (value: number) => void) {
      listeners.add(callback)
      callback(value) // 立即调用当前值
      return () => listeners.delete(callback)
    }
  }
}

// 使用
const counter = createCounter()
await until(counter).toBe(5)
```

## 内置 createStore

UntilJS 提供 `createStore` 用于创建 Subscribable 对象：

```typescript
import until, { createStore } from 'untiljs'

// 简单 store
const store = createStore(0)

// 对象 store
const userStore = createStore({ name: '', age: 0 })

// 复杂类型
interface State {
  loading: boolean
  data: string | null
  error: Error | null
}

const stateStore = createStore<State>({
  loading: false,
  data: null,
  error: null
})
```

## Subscribable vs RefLike

| 特性 | Subscribable | RefLike |
|------|--------------|---------|
| 有 `value` 属性 | ✅ | ✅ |
| 有 `subscribe` 方法 | ✅ | ❌ |
| until 效率更高 | ✅ | 使用轮询 |

尽可能使用 Subscribable 以获得更好的性能。

## RxJS 集成

将 RxJS subjects 转换为 Subscribable：

```typescript
import { BehaviorSubject } from 'rxjs'
import until from 'untiljs'

const subject = new BehaviorSubject(0)

const subscribable = {
  get value() {
    return subject.value
  },
  subscribe(callback: (value: number) => void) {
    const subscription = subject.subscribe(callback)
    return () => subscription.unsubscribe()
  }
}

await until(subscribable).toBe(5)
```

## 相关链接

- [createStore()](/zh/api/create-store)
- [WatchSource](/zh/api/watch-source)
