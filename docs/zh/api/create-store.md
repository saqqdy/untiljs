# createStore()

创建可响应的 store，可与 UntilJS 配合使用。

## 签名

```typescript
function createStore<T>(initialValue: T): Subscribable<T>
```

## 参数

### initialValue

- **类型：** `T`
- **必需：** 是

store 的初始值。

## 返回值

返回一个 `Subscribable<T>` 对象：

| 属性/方法 | 描述 |
|-----------------|-------------|
| `value` | 获取或设置当前值 |
| `subscribe(callback)` | 订阅值变化 |

## 为什么使用 createStore？

在 React 和其他框架中，闭包会捕获旧值，`createStore` 提供了一种创建可响应引用的方式，可以与 UntilJS 正常配合使用。

## 示例

### 基本用法

```typescript
import until, { createStore } from 'untiljs'

const store = createStore(0)

// 设置值
store.value = 5

// 获取值
console.log(store.value) // 5

// 使用 until
await until(store).toBe(5)
```

### 在 React 中使用

```tsx
import { useEffect, useState } from 'react'
import until, { createStore } from 'untiljs'

const store = createStore(0)

function MyComponent() {
  const [value, setValue] = useState(store.value)

  useEffect(() => store.subscribe(setValue), [])

  const handleClick = async () => {
    store.value = 5
    await until(store).toBe(5)
    console.log('值是 5！')
  }

  return <button onClick={handleClick}>测试</button>
}
```

### 订阅变化

```typescript
import { createStore } from 'untiljs'

const store = createStore(0)

// subscribe 返回取消订阅函数
const unsubscribe = store.subscribe((value) => {
  console.log('值变化了:', value)
})

store.value = 5 // 输出: "值变化了: 5"
store.value = 10 // 输出: "值变化了: 10"

// 取消订阅
unsubscribe()

store.value = 20 // 无输出
```