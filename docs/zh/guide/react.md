# React 集成

由于 React 的闭包行为，直接使用 `until(() => stateValue)` 无法正常工作。UntilJS 为此提供了解决方案。

## 问题所在

React 的闭包行为意味着 getter 函数会捕获旧值：

```tsx
// ❌ 这样不会工作
const [value, setValue] = useState(0)
await until(() => value).toBe(5) // 总是看到旧值
```

## 解决方案 1：useUntil Hook

创建一个将状态包装在 ref 中的自定义 hook：

```tsx
import { useCallback, useRef, useState } from 'react'
import until from 'untiljs'

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
    console.log('值现在是 5！')
  }

  return <button onClick={handleClick}>测试</button>
}
```

## 解决方案 2：createStore（推荐）

UntilJS v2.1+ 提供内置的 `createStore` 函数：

```tsx
import { createStore } from 'untiljs'
import until from 'untiljs'

// 在组件外部创建 store 或在 useRef 中
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

## 完整示例

```tsx
import { useEffect, useState } from 'react'
import until, { createStore } from 'untiljs'

// 为异步数据创建 store
const dataStore = createStore<string | null>(null)
const loadingStore = createStore(false)

function AsyncComponent() {
  const [data, setData] = useState(dataStore.value)
  const [loading, setLoading] = useState(loadingStore.value)

  useEffect(() => {
    const unsub1 = dataStore.subscribe(setData)
    const unsub2 = loadingStore.subscribe(setLoading)
    return () => {
      unsub1()
      unsub2()
    }
  }, [])

  const fetchData = async () => {
    loadingStore.value = true

    // 模拟 API 调用
    setTimeout(() => {
      dataStore.value = 'Hello World'
      loadingStore.value = false
    }, 1000)

    await until(loadingStore).toBe(false)
    console.log('数据已加载:', dataStore.value)
  }

  return (
    <div>
      {loading ? <p>加载中...</p> : <p>数据: {data}</p>}
      <button onClick={fetchData}>获取数据</button>
    </div>
  )
}
```