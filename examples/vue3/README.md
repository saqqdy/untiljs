# Vue 3 Example

This example demonstrates how to use untiljs with Vue 3.

## Setup

```bash
# Install dependencies
pnpm install

# Link untiljs from parent directory
pnpm link ../../

# Run development server
pnpm dev
```

## Usage Patterns

### Using Composition API

Vue 3's Composition API works great with untiljs:

```vue
<script setup>
import { ref } from 'vue'
import until from 'untiljs'

const count = ref(0)

async function waitForValue() {
  // Use getter function with ref
  await until(() => count.value).toBe(5)
}
</script>
```

### Using createStore

The built-in `createStore` function provides a reactive store:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { createStore } from 'untiljs'

const store = createStore(0)
const storeValue = ref(store.value)

let unsubscribe
onMounted(() => {
  unsubscribe = store.subscribe(value => {
    storeValue.value = value
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

async function waitForValue() {
  await until(store).toBe(5)
}
</script>
```

## Key Points

1. **ref/reactive**: Use getter functions `() => ref.value` with untiljs
2. **createStore**: Create reactive stores for shared state across components
3. **Subscribable**: Implement the Subscribable interface for custom reactive sources

## Tech Stack

- **Vue 3** - Framework
- **Vite** - Build tool
