# toBeNaN()

等待值为 `NaN`。

## 签名

```typescript
toBeNaN(options?: UntilToMatchOptions): Promise<T>
```

## 参数

### options

- **类型：** `UntilToMatchOptions`
- **必需：** 否

超时行为的配置选项。

## 返回值

当值为 NaN 时，Promise 解析为 `NaN`。

## 示例

### 基本用法

```typescript
import until from 'untiljs'

let number = 0
setTimeout(() => { number = NaN }, 500)

const result = await until(() => number).toBeNaN()
console.log(result) // NaN
```

### 等待无效计算

```typescript
import until from 'untiljs'

let result = 0

function divide(a: number, b: number) {
  result = a / b
}

setTimeout(() => divide(1, 0), 1000) // 实际返回 Infinity，不是 NaN
setTimeout(() => divide(NaN, 1), 1500) // 这返回 NaN

await until(() => result).toBeNaN()
console.log('得到 NaN！')
```

### 带超时

```typescript
import until from 'untiljs'

let number = 0

const result = await until(() => number).toBeNaN({ timeout: 5000 })
```

### 使用 Vue

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const value = ref(0)

async function test() {
  value.value = NaN
  await until(value).toBeNaN()
  console.log('值为 NaN')
}
```

## 相关链接

- [not.toBeNaN()](/zh/api/methods/not)
- [toMatch()](/zh/api/methods/toMatch)
