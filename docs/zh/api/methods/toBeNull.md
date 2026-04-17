# toBeNull()

等待值为 `null`。

## 签名

```typescript
toBeNull(options?: UntilToMatchOptions): Promise<T>
```

## 参数

### options

- **类型：** `UntilToMatchOptions`
- **必需：** 否

超时行为的配置选项。

## 返回值

当值为 null 时，Promise 解析为 `null`。

## 示例

### 基本用法

```typescript
import until from 'untiljs'

let data = { name: 'John' }
setTimeout(() => { data = null }, 500)

const result = await until(() => data).toBeNull()
console.log(result) // null
```

### 等待清理

```typescript
import until from 'untiljs'

let user: User | null = { name: 'John' }

function logout() {
  user = null
}

setTimeout(logout, 1000)

await until(() => user).toBeNull()
console.log('用户已登出')
```

### 带超时

```typescript
import until from 'untiljs'

let data = { name: 'John' }

const result = await until(() => data).toBeNull({ timeout: 5000 })
```

### 使用 Vue

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const user = ref<User | null>({ name: 'John' })

async function logout() {
  user.value = null
  await until(user).toBeNull()
  console.log('登出完成')
}
```

## 相关链接

- [toBeUndefined()](/zh/api/methods/toBeUndefined)
- [toBeTruthy()](/zh/api/methods/toBeTruthy)
- [not.toBeNull()](/zh/api/methods/not)
