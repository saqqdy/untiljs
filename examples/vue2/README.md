# Vue 2 Example

This example demonstrates how to use untiljs with Vue 2.7+.

> **Note**: Vue 2.7+ natively supports Composition API. For Vue 2.6 and below, you need to install `@vue/composition-api` plugin:
>
> ```bash
> # For Vue 2.6 and below
> pnpm add @vue/composition-api
> ```
>
> ```javascript
> // main.js for Vue 2.6 and below
> import Vue from 'vue'
> import VueCompositionAPI from '@vue/composition-api'
>
> Vue.use(VueCompositionAPI)
> ```
>
> Then import from `@vue/composition-api` instead of `vue`:
>
> ```javascript
> // Vue 2.7+
> import { ref } from 'vue'
>
> // Vue 2.6 and below
> import { ref } from '@vue/composition-api'
> ```

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

### Using Composition API (Vue 2.7+)

Vue 2.7 backported the Composition API from Vue 3:

```vue
<script>
import { ref } from 'vue'
import until from 'untiljs'

export default {
	setup() {
		const count = ref(0)

		const waitForValue = async () => {
			// Use getter function with ref
			await until(() => count.value).toBe(5)
		}

		return { count, waitForValue }
	}
}
</script>
```

### Using createStore

The built-in `createStore` function provides a reactive store:

```vue
<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { createStore } from 'untiljs'

export default {
	setup() {
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

		const waitForValue = async () => {
			await until(store).toBe(5)
		}

		return { storeValue, waitForValue }
	}
}
</script>
```

### Using Options API

You can also use untiljs with the traditional Options API:

```vue
<script>
import until from 'untiljs'

export default {
	data() {
		return {
			count: 0
		}
	},
	methods: {
		async waitForValue() {
			// Use getter function with this
			await until(() => this.count).toBe(5)
		}
	}
}
</script>
```

## Key Points

1. **Composition API**: Import from `vue` in Vue 2.7
2. **Getter Functions**: Always use `() => ref.value` syntax
3. **createStore**: Great for shared state across components
4. **Options API**: Use `() => this.property` for reactive data
