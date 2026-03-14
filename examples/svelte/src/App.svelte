<script>
	import { onMount } from 'svelte'
	import until, { createStore } from 'untiljs'

	// ============================================
	// Svelte works great with untiljs!
	// Use $state runes (Svelte 5) or regular let variables
	// ============================================

	// Basic Usage
	let toBeValue = $state(0)
	let toBeResult = $state('waiting...')

	async function testToBe() {
		toBeResult = 'waiting...'
		toBeValue = 0
		setTimeout(() => toBeValue = 5, 1000)
		// Use getter function with reactive state
		await until(() => toBeValue).toBe(5)
		toBeResult = `Success! Value is now ${toBeValue}`
	}

	let toMatchValue = $state(0)
	let toMatchResult = $state('waiting...')

	async function testToMatch() {
		toMatchResult = 'waiting...'
		toMatchValue = 0
		setTimeout(() => toMatchValue = 10, 1000)
		await until(() => toMatchValue).toMatch(v => v > 5)
		toMatchResult = `Success! Value ${toMatchValue} is greater than 5`
	}

	let truthyValue = $state(null)
	let truthyResult = $state('waiting...')

	async function testTruthy() {
		truthyResult = 'waiting...'
		truthyValue = null
		setTimeout(() => truthyValue = { name: 'John', age: 30 }, 1000)
		await until(() => truthyValue).toBeTruthy()
		truthyResult = `Success! Got object: ${JSON.stringify(truthyValue)}`
	}

	let nullValue = $state('not null')
	let nullResult = $state('waiting...')

	async function testBeNull() {
		nullResult = 'waiting...'
		nullValue = 'not null'
		setTimeout(() => nullValue = null, 1000)
		await until(() => nullValue).toBeNull()
		nullResult = 'Success! Value is now null'
	}

	// Change Detection
	let changedValue = $state('initial')
	let changedResult = $state('waiting...')

	async function testChanged() {
		changedResult = 'waiting...'
		changedValue = 'initial'
		setTimeout(() => changedValue = 'changed!', 1000)
		await until(() => changedValue).changed()
		changedResult = `Success! Value changed to "${changedValue}"`
	}

	let changedTimesValue = $state(0)
	let changedTimesCount = $state(0)
	let changedTimesResult = $state('waiting...')

	async function testChangedTimes() {
		changedTimesResult = 'waiting...'
		changedTimesValue = 0
		changedTimesCount = 0

		let count = 0
		const interval = setInterval(() => {
			count++
			changedTimesValue = count
			changedTimesCount = count
		}, 200)

		await until(() => changedTimesValue).changedTimes(3)
		clearInterval(interval)
		changedTimesResult = `Success! Value changed 3 times, final: ${changedTimesValue}`
	}

	// Not Modifier
	let notToBeValue = $state(5)
	let notToBeResult = $state('waiting...')

	async function testNotToBe() {
		notToBeResult = 'waiting...'
		notToBeValue = 5
		setTimeout(() => notToBeValue = 10, 1000)
		await until(() => notToBeValue).not.toBe(5)
		notToBeResult = `Success! Value is no longer 5, it's ${notToBeValue}`
	}

	let notNullValue = $state(null)
	let notNullResult = $state('waiting...')

	async function testNotNull() {
		notNullResult = 'waiting...'
		notNullValue = null
		setTimeout(() => notNullValue = 'has value', 1000)
		await until(() => notNullValue).not.toBeNull()
		notNullResult = `Success! Value is no longer null: "${notNullValue}"`
	}

	// Timeout Options
	let timeoutValue = $state(0)
	let timeoutResult = $state('waiting...')

	async function testTimeout() {
		timeoutResult = 'waiting...'
		timeoutValue = 0

		try {
			await until(() => timeoutValue).toBe(5, { timeout: 500, throwOnTimeout: true })
			timeoutResult = 'Unexpected success'
		} catch (error) {
			timeoutResult = `Timeout occurred! Error: ${error.message || error}`
		}
	}

	let timeoutNoThrowValue = $state(0)
	let timeoutNoThrowResult = $state('waiting...')

	async function testTimeoutNoThrow() {
		timeoutNoThrowResult = 'waiting...'
		timeoutNoThrowValue = 0

		const result = await until(() => timeoutNoThrowValue).toBe(5, { timeout: 500 })
		timeoutNoThrowResult = `Timeout - returned current value: ${result}`
	}

	// createStore (Recommended for Svelte)
	const store = createStore(0)
	let storeValue = $state(store.value)
	let storeResult = $state('waiting...')

	// Subscribe to store changes
	$effect(() => {
		return store.subscribe((value) => {
			storeValue = value
		})
	})

	async function testCreateStore() {
		storeResult = 'waiting...'
		store.value = 0

		setTimeout(() => {
			store.value = 42
		}, 1000)

		await until(store).toBe(42)
		storeResult = `Success! createStore value is ${store.value}`
	}

	// Deep Comparison
	let deepObject = $state({ user: { profile: { name: 'Alice' } } })
	let deepObjectResult = $state('waiting...')

	async function testDeepObject() {
		deepObjectResult = 'waiting...'
		deepObject = { user: { profile: { name: 'Alice' } } }

		setTimeout(() => {
			deepObject = { user: { profile: { name: 'Bob' } } }
		}, 1000)

		await until(() => deepObject).toMatch(v => v.user.profile.name === 'Bob', { deep: true })
		deepObjectResult = `Success! Deep object changed: ${JSON.stringify(deepObject)}`
	}

	let deepArray = $state([1, 2, 3])
	let deepArrayResult = $state('waiting...')

	async function testDeepArray() {
		deepArrayResult = 'waiting...'
		deepArray = [1, 2, 3]

		setTimeout(() => {
			deepArray = [1, 2, 3, 4, 5]
		}, 1000)

		await until(() => deepArray).toBe([1, 2, 3, 4, 5], { deep: true })
		deepArrayResult = `Success! Array now has ${deepArray.length} items: ${deepArray.join(', ')}`
	}

	// Array Methods
	let arrayValue = $state(['apple', 'banana'])
	let arrayResult = $state('waiting...')

	async function testArrayContains() {
		arrayResult = 'waiting...'
		arrayValue = ['apple', 'banana']

		setTimeout(() => {
			arrayValue = [...arrayValue, 'orange', 'grape']
		}, 1000)

		await until(() => arrayValue).toContains('orange')
		arrayResult = `Success! Array now contains 'orange': ${arrayValue.join(', ')}`
	}

	onMount(() => {
		console.log('untiljs Svelte Examples loaded!')
		console.log('Use getter functions: until(() => value).toBe(x)')
		console.log('Or createStore for reactive stores: until(store).toBe(x)')
	})
</script>

<main>
	<div class="container">
		<h1>untiljs Svelte Examples</h1>
		<p class="description">
			<strong>Framework Agnostic!</strong> Use <code>createStore</code> or getter functions for Svelte.
		</p>

		<h2>Basic Usage</h2>
		<section class="examples-grid">
			<div class="example-card">
				<h3>toBe</h3>
				<p>Value: {toBeValue}</p>
				<p>Result: {toBeResult}</p>
				<button onclick={testToBe}>Test toBe</button>
			</div>

			<div class="example-card">
				<h3>toMatch</h3>
				<p>Value: {toMatchValue}</p>
				<p>Result: {toMatchResult}</p>
				<button onclick={testToMatch}>Test toMatch</button>
			</div>

			<div class="example-card">
				<h3>toBeTruthy</h3>
				<p>Value: {JSON.stringify(truthyValue)}</p>
				<p>Result: {truthyResult}</p>
				<button onclick={testTruthy}>Test toBeTruthy</button>
			</div>

			<div class="example-card">
				<h3>toBeNull</h3>
				<p>Value: {nullValue}</p>
				<p>Result: {nullResult}</p>
				<button onclick={testBeNull}>Test toBeNull</button>
			</div>
		</section>

		<h2>Change Detection</h2>
		<section class="examples-grid">
			<div class="example-card">
				<h3>changed</h3>
				<p>Value: "{changedValue}"</p>
				<p>Result: {changedResult}</p>
				<button onclick={testChanged}>Test changed</button>
			</div>

			<div class="example-card">
				<h3>changedTimes(3)</h3>
				<p>Value: {changedTimesValue}</p>
				<p>Changes: {changedTimesCount}</p>
				<p>Result: {changedTimesResult}</p>
				<button onclick={testChangedTimes}>Test changedTimes</button>
			</div>
		</section>

		<h2>Not Modifier</h2>
		<section class="examples-grid">
			<div class="example-card">
				<h3>not.toBe</h3>
				<p>Value: {notToBeValue}</p>
				<p>Result: {notToBeResult}</p>
				<button onclick={testNotToBe}>Test not.toBe</button>
			</div>

			<div class="example-card">
				<h3>not.toBeNull</h3>
				<p>Value: "{notNullValue}"</p>
				<p>Result: {notNullResult}</p>
				<button onclick={testNotNull}>Test not.toBeNull</button>
			</div>
		</section>

		<h2>Timeout Options</h2>
		<section class="examples-grid">
			<div class="example-card">
				<h3>Timeout with throwOnTimeout</h3>
				<p>Value: {timeoutValue}</p>
				<p>Result: {timeoutResult}</p>
				<button onclick={testTimeout}>Test Timeout</button>
			</div>

			<div class="example-card">
				<h3>Timeout without throw</h3>
				<p>Value: {timeoutNoThrowValue}</p>
				<p>Result: {timeoutNoThrowResult}</p>
				<button onclick={testTimeoutNoThrow}>Test Timeout</button>
			</div>
		</section>

		<h2>createStore (Recommended)</h2>
		<section class="examples-grid">
			<div class="example-card">
				<h3>createStore</h3>
				<p>Value: {storeValue}</p>
				<p>Result: {storeResult}</p>
				<button onclick={testCreateStore}>Test createStore</button>
			</div>
		</section>

		<h2>Deep Comparison</h2>
		<section class="examples-grid">
			<div class="example-card">
				<h3>Deep Object</h3>
				<p>Object: {JSON.stringify(deepObject)}</p>
				<p>Result: {deepObjectResult}</p>
				<button onclick={testDeepObject}>Test Deep</button>
			</div>

			<div class="example-card">
				<h3>Deep Array</h3>
				<p>Array: [{deepArray.join(', ')}]</p>
				<p>Result: {deepArrayResult}</p>
				<button onclick={testDeepArray}>Test Deep Array</button>
			</div>
		</section>

		<h2>Array Methods</h2>
		<section class="examples-grid">
			<div class="example-card">
				<h3>toContains</h3>
				<p>Array: [{arrayValue.join(', ')}]</p>
				<p>Result: {arrayResult}</p>
				<button onclick={testArrayContains}>Test toContains</button>
			</div>
		</section>
	</div>
</main>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	h1 {
		color: #ff3e00;
		border-bottom: 2px solid #ff3e00;
		padding-bottom: 10px;
	}

	h2 {
		color: #333;
		margin-top: 30px;
		border-bottom: 1px solid #ddd;
		padding-bottom: 5px;
	}

	.description {
		background: #f8f9fa;
		padding: 15px;
		border-radius: 8px;
		margin-bottom: 20px;
	}

	.description code {
		background: #e9ecef;
		padding: 2px 6px;
		border-radius: 4px;
	}

	.examples-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 20px;
		margin-bottom: 30px;
	}

	.example-card {
		border: 1px solid #e1e4e8;
		border-radius: 8px;
		padding: 15px;
		background: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.example-card h3 {
		margin: 0 0 10px 0;
		color: #ff3e00;
		font-size: 16px;
	}

	.example-card p {
		margin: 5px 0;
		font-size: 14px;
		color: #666;
	}

	.example-card button {
		margin-top: 10px;
		padding: 8px 16px;
		background: #ff3e00;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 14px;
	}

	.example-card button:hover {
		background: #d63500;
	}
</style>
