# toBeTruthy()

等待值为真值。

## 签名

```typescript
toBeTruthy(options?: UntilToMatchOptions): Promise<T>
```

## 参数

### options

- **类型：** `UntilToMatchOptions`
- **必需：** 否

超时和比较行为的配置选项。

## 返回值

当值为真值时，Promise 解析为当前值。

## 什么是真值？

在 JavaScript 中，真值是在布尔上下文中评估为 `true` 的值：

- 非空字符串：`'hello'`, `'false'`
- 非零数字：`1`, `-1`, `3.14`
- 对象：`{}`, `[]`
- 函数：`() => {}`

假值：
- `false`
- `0`
- `''`（空字符串）
- `null`
- `undefined`
- `NaN`

## 示例

### 基本用法

```typescript
import until from 'untiljs'

let data = null
setTimeout(() => { data = { name: 'John' } }, 500)

const result = await until(() => data).toBeTruthy()
console.log(result) // { name: 'John' }
```

### 等待非空值

```typescript
import until from 'untiljs'

let user: User | null = null

fetch('/api/user')
  .then(res => res.json())
  .then(data => { user = data })

await until(() => user).toBeTruthy()
console.log('用户已加载:', user)
```

### 带超时

```typescript
import until from 'untiljs'

let data = null

const result = await until(() => data).toBeTruthy({ timeout: 5000 })

if (result) {
  console.log('数据已加载:', result)
} else {
  console.log('等待数据超时')
}
```

### 使用 Vue

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const loading = ref(true)
const data = ref<string | null>(null)

async function fetchData() {
  loading.value = true

  setTimeout(() => {
    data.value = 'Hello World'
    loading.value = false
  }, 1000)

  // 等待数据为真值
  await until(data).toBeTruthy()

  console.log('数据已加载:', data.value)
}
```

### 使用 React (createStore)

```typescript
import until, { createStore } from 'untiljs'

const dataStore = createStore<string | null>(null)

async function fetchData() {
  setTimeout(() => {
    dataStore.value = 'Hello World'
  }, 1000)

  await until(dataStore).toBeTruthy()
  console.log('数据已加载:', dataStore.value)
}
```

### DOM 元素

```typescript
import until from 'untiljs'

// 等待元素存在
await until(() => document.getElementById('my-element')).toBeTruthy()

const element = document.getElementById('my-element')
console.log('元素已找到:', element)
```

## 相关链接

- [toBeNull()](/zh/api/methods/toBeNull)
- [toBeUndefined()](/zh/api/methods/toBeUndefined)
- [toMatch()](/zh/api/methods/toMatch)
