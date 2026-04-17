# changedTimes()

等待值变化指定次数。

## 签名

```typescript
changedTimes(n: number, options?: UntilToMatchOptions): Promise<T>
```

## 参数

### n

- **类型：** `number`
- **必需：** 是

值必须变化的次数。

### options

- **类型：** `UntilToMatchOptions`
- **必需：** 否

超时行为的配置选项。

## 返回值

在 n 次变化后，Promise 解析为最终值。

## 示例

### 基本用法

```typescript
import until from 'untiljs'

let count = 0

const interval = setInterval(() => {
  count++
}, 200)

// 等待 3 次变化
const result = await until(() => count).changedTimes(3)
console.log(result) // 3

clearInterval(interval)
```

### 多次状态转换

```typescript
import until from 'untiljs'

let status = 'pending'

async function process() {
  setTimeout(() => { status = 'loading' }, 200)
  setTimeout(() => { status = 'processing' }, 500)
  setTimeout(() => { status = 'complete' }, 800)
}

process()

// 等待 3 次变化: pending → loading → processing → complete
await until(() => status).changedTimes(3)
console.log('处理完成')
```

### 带超时

```typescript
import until from 'untiljs'

let count = 0

const result = await until(() => count).changedTimes(5, { timeout: 10000 })

console.log('计数变化了 5 次，最终值:', result)
```

### 使用 Vue

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const step = ref(0)

async function runSteps() {
  for (let i = 1; i <= 5; i++) {
    setTimeout(() => { step.value = i }, i * 200)
  }

  await until(step).changedTimes(5)
  console.log('全部 5 个步骤完成')
}
```

### 使用 React (createStore)

```typescript
import until, { createStore } from 'untiljs'

const store = createStore(0)

async function incrementMultipleTimes() {
  for (let i = 1; i <= 3; i++) {
    setTimeout(() => { store.value = i }, i * 200)
  }

  await until(store).changedTimes(3)
  console.log('增加了 3 次，最终值:', store.value)
}
```

### 跟踪表单进度

```typescript
import until from 'untiljs'

interface FormData {
  step: number
  completed: boolean
}

let formData = { step: 0, completed: false }

async function fillForm() {
  setTimeout(() => { formData = { ...formData, step: 1 } }, 200)
  setTimeout(() => { formData = { ...formData, step: 2 } }, 400)
  setTimeout(() => { formData = { ...formData, step: 3, completed: true } }, 600)
}

fillForm()

// 等待 3 次 step 变化
await until(() => formData.step).changedTimes(3)
console.log('表单已完成！')
```

## 相关链接

- [changed()](/zh/api/methods/changed)
- [toMatch()](/zh/api/methods/toMatch)
