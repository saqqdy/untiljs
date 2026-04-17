# UntilToMatchOptions

配置 UntilJS 方法等待行为的选项。

## 定义

```typescript
interface UntilToMatchOptions {
  /** 超时时间（毫秒）（0 = 永不超时） */
  timeout?: number

  /** 超时时拒绝 Promise（默认：false） */
  throwOnTimeout?: boolean

  /** 深度比较深度（true = 无限深度，数字 = 指定深度） */
  deep?: boolean | number
}
```

## 属性

### timeout

超时时间（毫秒）。默认为 `0`（永不超时）。

```typescript
import until from 'untiljs'

// 1 秒后超时
const result = await until(() => value).toBe(5, { timeout: 1000 })

// 永不超时（默认）
const result = await until(() => value).toBe(5, { timeout: 0 })
```

### throwOnTimeout

超时时是否拒绝 Promise。默认为 `false`。

```typescript
import until from 'untiljs'

// 超时不抛错（返回当前值）
const result = await until(() => value).toBe(5, { timeout: 1000 })

// 超时时抛错
try {
  await until(() => value).toBe(5, {
    timeout: 1000,
    throwOnTimeout: true
  })
} catch (error) {
  console.error('超时！')
}
```

### deep

配置对象和数组的深度比较。

- `false`（默认）：仅引用比较
- `true`：无限深度比较
- `number`：限制比较到指定深度

```typescript
import until from 'untiljs'

let obj = { nested: { value: 0 } }

// 无深度比较（仅引用）
await until(() => obj).toBe({ nested: { value: 5 } }) // 不会匹配！

// 深度比较
await until(() => obj).toBe({ nested: { value: 5 } }, { deep: true })

// 限制深度
await until(() => obj).toBe({ nested: { value: 5 } }, { deep: 2 })
```

## 默认值

| 属性 | 默认值 |
|------|--------|
| `timeout` | `0`（永不） |
| `throwOnTimeout` | `false` |
| `deep` | `false` |

## 使用示例

### 所有选项

```typescript
import until from 'untiljs'

let obj = { nested: { value: 0 } }

const result = await until(() => obj).toBe(
  { nested: { value: 5 } },
  {
    timeout: 5000,
    throwOnTimeout: true,
    deep: true
  }
)
```

### 仅超时

```typescript
await until(() => value).toBe(5, { timeout: 1000 })
```

### 仅深度比较

```typescript
await until(() => obj).toBe(expected, { deep: true })
```

### 多次调用使用相同选项

```typescript
import until from 'untiljs'

const defaultOptions = {
  timeout: 5000,
  throwOnTimeout: true
}

await until(() => value1).toBe(5, defaultOptions)
await until(() => value2).toBeTruthy(defaultOptions)
```

## TypeScript

```typescript
import until, { UntilToMatchOptions } from 'untiljs'

const options: UntilToMatchOptions = {
  timeout: 5000,
  throwOnTimeout: true,
  deep: true
}

await until(() => value).toBe(5, options)
```

## 相关链接

- [toBe()](/zh/api/methods/toBe)
- [toMatch()](/zh/api/methods/toMatch)
