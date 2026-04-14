# Vue Integration

UntilJS works seamlessly with Vue 2 and Vue 3. Vue refs are automatically recognized as `RefLike` objects.

## Vue 3

### Basic Usage

```typescript
import { ref, computed } from 'vue'
import until from 'untiljs'

const count = ref(0)

// Method 1: Pass ref directly (recommended!)
async function waitForValue() {
  await until(count).toBe(5)
  console.log('Count reached 5!')
}

// Method 2: Use getter function
async function waitForValueGetter() {
  await until(() => count.value).toBe(5)
  console.log('Count reached 5!')
}
```

### Computed Values

```typescript
import { ref, computed } from 'vue'
import until from 'untiljs'

const count = ref(0)
const doubled = computed(() => count.value * 2)

// Watch computed values
async function waitForDoubled() {
  await until(doubled).toBe(10)
  console.log('Doubled value reached 10!')
}
```

### Deep Comparison

```typescript
import { ref } from 'vue'
import until from 'untiljs'

const user = ref({ profile: { name: '' } })
setTimeout(() => {
  user.value = { profile: { name: 'John' } }
}, 1000)

await until(user).toMatch(v => v.profile.name === 'John', { deep: true })
```

### In Components

```vue
<script setup>
import { ref } from 'vue'
import until from 'untiljs'

const loading = ref(true)
const data = ref(null)

async function fetchData() {
  loading.value = true

  // Simulate API call
  setTimeout(() => {
    data.value = { name: 'John' }
    loading.value = false
  }, 1000)

  await until(loading).toBe(false)
  console.log('Data loaded:', data.value)
}
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else>{{ data }}</div>
  <button @click="fetchData">Fetch Data</button>
</template>
```

## Vue 2.7+

Vue 2.7+ supports Composition API natively:

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
      console.log('Count reached 5!')
    }

    return { count, waitForValue }
  }
}
</script>

<template>
  <p>Count: {{ count }}</p>
  <button @click="waitForValue">Wait for 5</button>
</template>
```

## Vue 2.6 and Below

For Vue 2.6 and below, you need the `@vue/composition-api` plugin:

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
