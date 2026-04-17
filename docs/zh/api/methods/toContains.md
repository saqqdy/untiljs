# toContains()

等待数组包含特定值。

## 签名

```typescript
toContains(value: T, options?: UntilToMatchOptions): Promise<T[]>
```

## 参数

### value

- **类型：** `T`
- **必需：** 是

要在数组中检查的值。

### options

- **类型：** `UntilToMatchOptions`
- **必需：** 否

超时行为的配置选项。

## 返回值

当数组包含该值时，Promise 解析为该数组。

## 示例

### 基本用法

```typescript
import until from 'untiljs'

let items = ['apple', 'banana']
setTimeout(() => {
  items.push('orange')
}, 500)

const result = await until(() => items).toContains('orange')
console.log(result) // ['apple', 'banana', 'orange']
```

### 带超时

```typescript
import until from 'untiljs'

let items: string[] = []

const result = await until(() => items).toContains('target', { timeout: 5000 })
```

### 动态数组更新

```typescript
import until from 'untiljs'

let queue: number[] = []

async function processQueue() {
  // 项目在不同时间到达
  setTimeout(() => { queue.push(1) }, 100)
  setTimeout(() => { queue.push(2) }, 200)
  setTimeout(() => { queue.push(3) }, 300)
}

processQueue()

// 等待特定项目
await until(() => queue).toContains(3)
console.log('项目 3 已到达！')
```

### 使用 Vue

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const notifications = ref<string[]>([])

async function waitForNotification(id: string) {
  await until(notifications).toContains(id)
  console.log('收到通知:', id)
}

// 添加通知
setTimeout(() => {
  notifications.value.push('notification-123')
}, 500)

await waitForNotification('notification-123')
```

### 使用 React (createStore)

```typescript
import until, { createStore } from 'untiljs'

const itemsStore = createStore<string[]>([])

async function addItem() {
  setTimeout(() => {
    itemsStore.value = [...itemsStore.value, 'new-item']
  }, 500)

  await until(itemsStore).toContains('new-item')
  console.log('项目已添加！')
}
```

### 对象数组

对于对象数组，`toContains` 检查引用相等性。使用 `toMatch` 进行属性匹配：

```typescript
import until from 'untiljs'

interface User {
  id: number
  name: string
}

let users: User[] = []
setTimeout(() => {
  users.push({ id: 1, name: 'John' })
}, 500)

// 对对象数组使用 toMatch
await until(() => users).toMatch(arr => arr.some(u => u.id === 1))
```

### 数字数组

```typescript
import until from 'untiljs'

let numbers: number[] = [1, 2, 3]

setTimeout(() => {
  numbers.push(4)
  numbers.push(5)
}, 500)

await until(() => numbers).toContains(5)
console.log('找到 5！')
```

## 相关链接

- [toMatch()](/zh/api/methods/toMatch)
- [not.toContains()](/zh/api/methods/not)
