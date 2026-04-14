# toMatch()

等待自定义条件返回 true。

## 签名

```typescript
toMatch(condition: (value: T) => boolean, options?: UntilToMatchOptions): Promise<T>
```

## 参数

### condition

- **类型：** `(value: T) => boolean`
- **必需：** 是

接收当前值并在条件满足时返回 `true` 的函数。

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

// 等待 count > 3
const result = await until(() => count).toMatch(v => v > 3)
console.log(result) // 5
```

### 复杂条件

```typescript
import until from 'untiljs'

let user = { name: '', age: 0 }
setTimeout(() => {
  user = { name: 'John', age: 25 }
}, 500)

// 等待成年用户
await until(() => user).toMatch(u => u.age >= 18)
```