# changed()

等待值从初始值发生变化。

## 签名

```typescript
changed(options?: UntilToMatchOptions): Promise<T>
```

## 参数

### options

- **类型：** `UntilToMatchOptions`
- **必需：** 否

超时行为的配置选项。

## 返回值

当值变化时，Promise 解析为新值。

## 示例

### 基本用法

```typescript
import until from 'untiljs'

let value = 'initial'
setTimeout(() => { value = 'changed' }, 1000)

const result = await until(() => value).changed()
console.log(result) // 'changed'
```

### 带超时

```typescript
import until from 'untiljs'

let value = 'initial'

const result = await until(() => value).changed({ timeout: 5000 })

if (result !== 'initial') {
  console.log('值变为:', result)
}
```

### 等待状态变化

```typescript
import until from 'untiljs'

let status = 'pending'

async function process() {
  // 某些异步操作
  setTimeout(() => { status = 'complete' }, 1000)
}

process()

await until(() => status).changed()
console.log('状态已从 pending 改变')
```

### 使用 Vue

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const loading = ref(false)

async function fetchData() {
  loading.value = false

  setTimeout(() => {
    loading.value = true
  }, 500)

  // 等待 loading 变为 true
  await until(loading).changed()

  console.log('加载状态已改变')
}
```

### 使用 React (createStore)

```typescript
import until, { createStore } from 'untiljs'

const store = createStore('initial')

async function updateValue() {
  setTimeout(() => {
    store.value = 'updated'
  }, 1000)

  await until(store).changed()
  console.log('值变为:', store.value)
}
```

## 对象变化

对于对象，使用 `deep` 选项检测深度变化：

```typescript
import until from 'untiljs'

let obj = { count: 0 }
setTimeout(() => {
  obj = { count: 1 }
}, 500)

// 检测引用变化
await until(() => obj).changed()

// 或使用深度比较检测同引用的修改
let obj2 = { count: 0 }
setTimeout(() => {
  obj2.count = 1 // 同一引用，不同内容
}, 500)

// 这不会检测到变化（引用相同）
// 改用 toMatch
await until(() => obj2.count).toMatch(v => v === 1)
```

## 相关链接

- [changedTimes()](/zh/api/methods/changedTimes)
- [toMatch()](/zh/api/methods/toMatch)
