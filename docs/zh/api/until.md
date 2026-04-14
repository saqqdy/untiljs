# until()

创建用于监听值变化的 Until 实例的主函数。

## 签名

```typescript
function until<T>(source: WatchSource<T>): UntilValue<T>
```

## 参数

### source

- **类型：** `WatchSource<T>`
- **必需：** 是

`WatchSource` 可以是以下之一：

| 类型 | 示例 | 描述 |
|------|---------|-------------|
| **Getter 函数** | `() => value` | 返回当前值的函数 |
| **Subscribable** | `{ value, subscribe }` | 具有 `value` 属性和 `subscribe` 方法的对象 |
| **RefLike** | `{ value }` | 具有 `value` 属性的对象（如 Vue ref） |
| **原始值** | `5`, `'hello'` | 静态值（永远不会变化） |

## 返回值

返回一个 `UntilValue<T>` 实例，具有等待条件的方法。

## 示例

### 使用 Getter 函数

```typescript
import until from 'untiljs'

let count = 0
setTimeout(() => { count = 5 }, 1000)

const result = await until(() => count).toBe(5)
console.log(result) // 5
```

### 使用 Vue Ref

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const count = ref(0)
setTimeout(() => { count.value = 5 }, 1000)

// 直接传递 ref
const result = await until(count).toBe(5)

// 或使用 getter 函数
const result2 = await until(() => count.value).toBe(5)
```

### 使用 createStore

```typescript
import until, { createStore } from 'untiljs'

const store = createStore(0)
setTimeout(() => { store.value = 5 }, 1000)

const result = await until(store).toBe(5)
```