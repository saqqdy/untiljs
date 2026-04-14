# 快速上手

## 基本用法

UntilJS 提供简洁的基于 Promise 的 API 用于等待值的变化。

```typescript
import until from 'untiljs'

// 使用 getter 函数的基本用法
let value = 1
setTimeout(() => { value = 2 }, 1000)

await until(() => value).toBe(2)
console.log('值现在是 2！')
```

## WatchSource 类型

`WatchSource<T>` 可以是以下之一：

| 类型 | 示例 | 描述 |
|------|---------|-------------|
| **Getter 函数** | `() => value` | 返回当前值的函数 |
| **Subscribable** | `{ value, subscribe }` | 具有 `value` 属性和 `subscribe` 方法的对象 |
| **RefLike** | `{ value }` | 具有 `value` 属性的对象（如 Vue ref） |
| **原始值** | `5`, `'hello'` | 静态值（永远不会变化） |

## 常用方法

### toBe(value)

等待源值等于给定值：

```typescript
let count = 0
setTimeout(() => { count = 5 }, 1000)

await until(() => count).toBe(5)
```

### toMatch(condition)

等待自定义条件返回 true：

```typescript
let count = 0
setTimeout(() => { count = 5 }, 1000)

await until(() => count).toMatch(v => v > 3)
```

### toTruthy()

等待值为真：

```typescript
let data = null
setTimeout(() => { data = { name: 'John' } }, 500)

await until(() => data).toBeTruthy()
```

### changed()

等待值发生变化：

```typescript
let value = 'initial'
setTimeout(() => { value = 'changed' }, 1000)

await until(() => value).changed()
```

## 配置选项

所有方法都接受一个选项对象：

```typescript
interface UntilToMatchOptions {
  /** 超时时间（毫秒），0 表示永不超时 */
  timeout?: number

  /** 超时时是否拒绝 Promise（默认：false） */
  throwOnTimeout?: boolean

  /** 深度比较深度（true = 无限，数字 = 特定深度） */
  deep?: boolean | number
}
```

### 带选项的示例

```typescript
// 带超时
await until(() => value).toBe(5, { timeout: 1000 })

// 带深度比较
let obj = { nested: { value: 0 } }
setTimeout(() => { obj = { nested: { value: 5 } } }, 500)

await until(() => obj).toBe({ nested: { value: 5 } }, { deep: true })
```

## 取反修饰符

使用 `.not` 反转任何条件：

```typescript
let value = 5
setTimeout(() => { value = 10 }, 500)

await until(() => value).not.toBe(5)
console.log(value) // 10
```

## 数组方法

```typescript
let items = ['apple', 'banana']
setTimeout(() => { items.push('orange') }, 500)

// 等待数组包含值
await until(() => items).toContains('orange')

// 等待特定数组
await until(() => items).toBe(['apple', 'banana', 'orange'], { deep: true })
```
