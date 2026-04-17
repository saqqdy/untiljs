# not.*

`not` 修饰符反转任何等待条件。

## 签名

`not` 上的所有方法与其常规版本具有相同的签名：

```typescript
not.toBe(value: T, options?: UntilToMatchOptions): Promise<T>
not.toMatch(condition: (value: T) => boolean, options?: UntilToMatchOptions): Promise<T>
not.toBeTruthy(options?: UntilToMatchOptions): Promise<T>
not.toBeNull(options?: UntilToMatchOptions): Promise<T>
not.toBeUndefined(options?: UntilToMatchOptions): Promise<T>
not.toBeNaN(options?: UntilToMatchOptions): Promise<T>
not.changed(options?: UntilToMatchOptions): Promise<T>
not.toContains(value: T, options?: UntilToMatchOptions): Promise<T>
```

## 可用方法

| 方法 | 等待直到... |
|------|-------------|
| `not.toBe(value)` | 值不等于目标值 |
| `not.toMatch(condition)` | 条件不满足 |
| `not.toBeTruthy()` | 值不为真值 |
| `not.toBeNull()` | 值不为 null |
| `not.toBeUndefined()` | 值不为 undefined |
| `not.toBeNaN()` | 值不为 NaN |
| `not.changed()` | 值不变化 |
| `not.toContains(value)` | 数组不包含值 |

## 示例

### not.toBe

```typescript
import until from 'untiljs'

let value = 5
setTimeout(() => { value = 10 }, 500)

await until(() => value).not.toBe(5)
console.log(value) // 10
```

### not.toBeNull

```typescript
import until from 'untiljs'

let data = null
setTimeout(() => { data = 'loaded' }, 500)

await until(() => data).not.toBeNull()
console.log(data) // 'loaded'
```

### not.toBeUndefined

```typescript
import until from 'untiljs'

let config = undefined
setTimeout(() => { config = { debug: true } }, 500)

await until(() => config).not.toBeUndefined()
console.log(config) // { debug: true }
```

### not.toBeTruthy

```typescript
import until from 'untiljs'

let loading = true
setTimeout(() => { loading = false }, 500)

await until(() => loading).not.toBeTruthy()
console.log(loading) // false
```

### not.toMatch

```typescript
import until from 'untiljs'

let status = 'pending'
setTimeout(() => { status = 'complete' }, 500)

await until(() => status).not.toMatch(v => v === 'pending')
console.log(status) // 'complete'
```

### not.changed

等待值保持稳定：

```typescript
import until from 'untiljs'

let value = 'stable'

// 如果值在超时期间变化，这将超时
const result = await until(() => value).not.changed({ timeout: 1000 })

// 用于检查稳定性
if (result === 'stable') {
  console.log('值在 1 秒内保持稳定')
}
```

### not.toContains

```typescript
import until from 'untiljs'

let items = ['apple', 'banana', 'orange']
setTimeout(() => {
  items = items.filter(i => i !== 'banana')
}, 500)

await until(() => items).not.toContains('banana')
console.log(items) // ['apple', 'orange']
```

### 带选项

```typescript
import until from 'untiljs'

let value = 5

// 带超时
await until(() => value).not.toBe(5, { timeout: 2000 })

// 带 throwOnTimeout
try {
  await until(() => value).not.toBe(5, { timeout: 1000, throwOnTimeout: true })
} catch (error) {
  console.error('值未及时变化')
}

// 带深度比较
let obj = { nested: { value: 5 } }
setTimeout(() => {
  obj = { nested: { value: 10 } }
}, 500)

await until(() => obj).not.toBe({ nested: { value: 5 } }, { deep: true })
```

## 实用示例

### 等待登出

```typescript
import until from 'untiljs'

async function waitForLogout(isLoggedIn) {
  await until(isLoggedIn).not.toBeTruthy()
  console.log('用户已登出')
}
```

### 等待数据清除

```typescript
import until from 'untiljs'

async function waitForDataClear(data) {
  await until(() => data).not.toBeTruthy()
  console.log('数据已清除')
}
```

### 等待输入变化

```typescript
import until from 'untiljs'

let input = 'initial'

async function waitForInputChange() {
  await until(() => input).not.toBe('initial')
  console.log('输入已从初始值改变')
}
```

## 相关链接

- [toBe()](/zh/api/methods/toBe)
- [toMatch()](/zh/api/methods/toMatch)
- [toBeTruthy()](/zh/api/methods/toBeTruthy)
