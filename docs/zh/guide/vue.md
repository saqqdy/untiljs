# Vue 集成

UntilJS 与 Vue 2 和 Vue 3 无缝协作。Vue refs 自动被识别为 `RefLike` 对象。

## Vue 3

### 基本用法

```typescript
import { ref, computed } from 'vue'
import until from 'untiljs'

const count = ref(0)

// 方法 1：直接传递 ref（推荐！）
async function waitForValue() {
  await until(count).toBe(5)
  console.log('Count 达到了 5！')
}

// 方法 2：使用 getter 函数
async function waitForValueGetter() {
  await until(() => count.value).toBe(5)
  console.log('Count 达到了 5！')
}
```

### 计算属性

```typescript
import { ref, computed } from 'vue'
import until from 'untiljs'

const count = ref(0)
const doubled = computed(() => count.value * 2)

// 监听计算属性
async function waitForDoubled() {
  await until(doubled).toBe(10)
  console.log('双倍值达到了 10！')
}
```

### 深度比较

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const user = ref({ profile: { name: '' } })
setTimeout(() => {
  user.value = { profile: { name: 'John' } }
}, 1000)

await until(user).toMatch(v => v.profile.name === 'John', { deep: true })
```

### 在组件中使用

```vue
<script setup>
import { ref } from 'vue'
import until from 'untiljs'

const loading = ref(true)
const data = ref(null)

async function fetchData() {
  loading.value = true

  // 模拟 API 调用
  setTimeout(() => {
    data.value = { name: 'John' }
    loading.value = false
  }, 1000)

  await until(loading).toBe(false)
  console.log('数据已加载:', data.value)
}
</script>

<template>
  <div v-if="loading">加载中...</div>
  <div v-else>{{ data }}</div>
  <button @click="fetchData">获取数据</button>
</template>
```

## Vue 2.7+

Vue 2.7+ 原生支持 Composition API：

```vue
<script>
import { ref } from 'vue'
import until from 'untiljs'

export default {
  setup() {
    const count = ref(0)

    const waitForValue = async () => {
      count.value = 0
      setTimeout(() => count.value = 5, 1000)

      await until(() => count.value).toBe(5)
      console.log('Count 达到了 5！')
    }

    return { count, waitForValue }
  }
}
</script>

<template>
  <p>Count: {{ count }}</p>
  <button @click="waitForValue">等待 5</button>
</template>
```

## Vue 2.6 及以下版本

对于 Vue 2.6 及以下版本，需要 `@vue/composition-api` 插件：

```bash
pnpm add @vue/composition-api
```

```javascript
// main.js
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'

Vue.use(VueCompositionAPI)
```

```vue
<script>
import { ref } from '@vue/composition-api'
import until from 'untiljs'

export default {
  setup() {
    const count = ref(0)

    const waitForValue = async () => {
      await until(() => count.value).toBe(5)
    }

    return { count, waitForValue }
  }
}
</script>
```