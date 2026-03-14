# Svelte Example

This example demonstrates how to use untiljs with Svelte 5+.

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

### Using Svelte 5 Runes

Svelte 5 introduces runes (`$state`, `$derived`, `$effect`) which work great with untiljs:

```svelte
<script>
	import until from 'untiljs'

	let count = $state(0)

	async function waitForValue() {
		// Use getter function with reactive state
		await until(() => count).toBe(5)
	}
</script>
```

### Using createStore

The built-in `createStore` function provides a reactive store:

```svelte
<script>
	import { createStore } from 'untiljs'

	const store = createStore(0)

	// Subscribe to changes
	$effect(() => {
		return store.subscribe(value => {
			console.log(value)
		})
	})

	async function waitForValue() {
		await until(store).toBe(5)
	}
</script>
```

## Key Points

1. **Reactive State**: Use getter functions `() => variable` with untiljs
2. **createStore**: Create reactive stores for shared state
3. **$effect**: Use `$effect` for subscribing to store changes
