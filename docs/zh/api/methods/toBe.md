# toBe()

等待源值等于给定值。

## 签名

```typescript
toBe(value: T, options?: UntilToMatchOptions): Promise<T>
```

## 参数

### value

- **类型：** `T`
- **必需：** 是

等待的目标值。

### options

- **类型：** `UntilToMatchOptions`
- **必需：** 否

超时和比较行为的配置选项。

## 返回值

条件满足时返回 Promise，解析为当前值。

## 示例

### 基本用法

```typescript
import until from 'untiljs'

let count = 0
setTimeout(() => { count = 5 }, 1000)

const result = await until(() => count).toBe(5)
console.log(result) // 5
```

### 带超时

```typescript
import until from 'untiljs'

let count = 0

// 超时时返回当前值
const result = await until(() => count).toBe(5, { timeout: 1000 })
console.log(result) // 0

// 超时时抛出错误
try {
  await until(() => count).toBe(5, { timeout: 1000, throwOnTimeout: true })
} catch (error) {
  console.error('超时！')
}
```

### 带深度比较

```typescript
import until from 'untiljs'

let obj = { nested: { value: 0 } }
setTimeout(() => {
  obj = { nested: { value: 5 } }
}, 500)

// 对象深度比较
await until(() => obj).toBe(
  { nested: { value: 5 } },
  { deep: true }
)
```

### 带 Vue Refs

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const count = ref(0)
setTimeout(() => { count.value = 5 }, 1000)

// 直接传递 ref
await until(count).toBe(5)

// 或使用 getter
await until(() => count.value).toBe(5)
```