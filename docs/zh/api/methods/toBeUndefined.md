# toBeUndefined()

等待值为 `undefined`。

## 签名

```typescript
toBeUndefined(options?: UntilToMatchOptions): Promise<T>
```

## 参数

### options

- **类型：** `UntilToMatchOptions`
- **必需：** 否

超时行为的配置选项。

## 返回值

当值为 undefined 时，Promise 解析为 `undefined`。

## 示例

### 基本用法

```typescript
import until from 'untiljs'

let config = { debug: true }
setTimeout(() => { config = undefined as any }, 500)

const result = await until(() => config).toBeUndefined()
console.log(result) // undefined
```

### 等待删除

```typescript
import until from 'untiljs'

let cache: Record<string, any> = { key: 'value' }

function clearCache() {
  cache = undefined as any
}

setTimeout(clearCache, 1000)

await until(() => cache).toBeUndefined()
console.log('缓存已清除')
```

### 带超时

```typescript
import until from 'untiljs'

let config = { debug: true }

const result = await until(() => config).toBeUndefined({ timeout: 5000 })
```

### 使用 Vue

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const config = ref<Config | undefined>({ debug: true })

async function reset() {
  config.value = undefined
  await until(config).toBeUndefined()
  console.log('配置已重置')
}
```

## 相关链接

- [toBeNull()](/zh/api/methods/toBeNull)
- [toBeTruthy()](/zh/api/methods/toBeTruthy)
- [not.toBeUndefined()](/zh/api/methods/not)
