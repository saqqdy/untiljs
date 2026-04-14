# Svelte Integration

Svelte 5 runes work with UntilJS using getter functions.

## Basic Usage with Runes

```svelte
<script>
  import until from 'untiljs'

  let count = $state(0)

  async function waitForValue() {
    count = 0
    setTimeout(() => count = 5, 1000)

    // Use getter function with $state
    await until(() => count).toBe(5)
    console.log('Count reached 5!')
  }
</script>

<p>Count: {count}</p>
<button onclick={waitForValue}>Wait for 5</button>
```

## Using createStore

For reactive stores that work seamlessly with UntilJS:

```svelte
<script>
  import { createStore } from 'untiljs'
  import until from 'untiljs'

  const store = createStore(0)
  let storeValue = $state(store.value)

  // Subscribe to changes
  $effect(() => {
    return store.subscribe(value => storeValue = value)
  })

  async function test() {
    store.value = 0
    setTimeout(() => store.value = 5, 1000)
    await until(store).toBe(5)
    console.log('Store value is now 5!')
  }
</script>

<p>Value: {storeValue}</p>
<button onclick={test}>Test</button>
```

## Stores with Objects

```svelte
<script>
  import { createStore } from 'untiljs'
  import until from 'untiljs'

  const userStore = createStore({ name: '', loading: true })

  let user = $state(userStore.value)

  $effect(() => {
    return userStore.subscribe(value => user = value)
  })

  async function loadUser() {
    userStore.value = { ...userStore.value, loading: true }

    setTimeout(() => {
      userStore.value = { name: 'John', loading: false }
    }, 1000)

    await until(userStore).toMatch(u => !u.loading, { deep: true })
    console.log('User loaded:', user.name)
  }
</script>

{#if user.loading}
  <p>Loading...</p>
{:else}
  <p>User: {user.name}</p>
{/if}

<button onclick={loadUser}>Load User</button>
```

## Svelte 4 and Below

For Svelte 4, use traditional stores:

```svelte
<script>
  import { writable } from 'svelte/store'
  import until from 'untiljs'

  const count = writable(0)

  async function waitForValue() {
    count.set(0)
    setTimeout(() => count.set(5), 1000)

    // Convert Svelte store to subscribable
    const subscribable = {
      get value() {
        let current
        count.subscribe(v => current = v)()
        return current
      },
      subscribe: count.subscribe.bind(count)
    }

    await until(subscribable).toBe(5)
    console.log('Count reached 5!')
  }
</script>

<p>Count: {$count}</p>
<button on:click={waitForValue}>Wait for 5</button>
```
