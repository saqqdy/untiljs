<template>
	<div class="container">
		<h1>untiljs Vue 2 Examples</h1>
		<p class="description">
			<strong>Vue 2.7+ supports Composition API!</strong> Use <code>ref</code> and getter functions with untiljs.
		</p>

		<h2>Basic Usage</h2>
		<section class="examples-grid">
			<div class="example-card">
				<h3>toBe</h3>
				<p>Value: {{ toBeValue }}</p>
				<p>Result: {{ toBeResult }}</p>
				<button @click="testToBe">Test toBe</button>
			</div>

			<div class="example-card">
				<h3>toMatch</h3>
				<p>Value: {{ toMatchValue }}</p>
				<p>Result: {{ toMatchResult }}</p>
				<button @click="testToMatch">Test toMatch</button>
			</div>

			<div class="example-card">
				<h3>toBeTruthy</h3>
				<p>Value: {{ truthyValue }}</p>
				<p>Result: {{ truthyResult }}</p>
				<button @click="testTruthy">Test toBeTruthy</button>
			</div>

			<div class="example-card">
				<h3>toBeNull</h3>
				<p>Value: {{ nullValue }}</p>
				<p>Result: {{ nullResult }}</p>
				<button @click="testBeNull">Test toBeNull</button>
			</div>
		</section>

		<h2>Change Detection</h2>
		<section class="examples-grid">
			<div class="example-card">
				<h3>changed</h3>
				<p>Value: "{{ changedValue }}"</p>
				<p>Result: {{ changedResult }}</p>
				<button @click="testChanged">Test changed</button>
			</div>

			<div class="example-card">
				<h3>changedTimes(3)</h3>
				<p>Value: {{ changedTimesValue }}</p>
				<p>Changes: {{ changedTimesCount }}</p>
				<p>Result: {{ changedTimesResult }}</p>
				<button @click="testChangedTimes">Test changedTimes</button>
			</div>
		</section>

		<h2>Not Modifier</h2>
		<section class="examples-grid">
			<div class="example-card">
				<h3>not.toBe</h3>
				<p>Value: {{ notToBeValue }}</p>
				<p>Result: {{ notToBeResult }}</p>
				<button @click="testNotToBe">Test not.toBe</button>
			</div>

			<div class="example-card">
				<h3>not.toBeNull</h3>
				<p>Value: "{{ notNullValue }}"</p>
				<p>Result: {{ notNullResult }}</p>
				<button @click="testNotNull">Test not.toBeNull</button>
			</div>
		</section>

		<h2>Timeout Options</h2>
		<section class="examples-grid">
			<div class="example-card">
				<h3>Timeout with throwOnTimeout</h3>
				<p>Value: {{ timeoutValue }}</p>
				<p>Result: {{ timeoutResult }}</p>
				<button @click="testTimeout">Test Timeout</button>
			</div>

			<div class="example-card">
				<h3>Timeout without throw</h3>
				<p>Value: {{ timeoutNoThrowValue }}</p>
				<p>Result: {{ timeoutNoThrowResult }}</p>
				<button @click="testTimeoutNoThrow">Test Timeout</button>
			</div>
		</section>

		<h2>createStore (Recommended)</h2>
		<section class="examples-grid">
			<div class="example-card">
				<h3>createStore</h3>
				<p>Value: {{ storeValue }}</p>
				<p>Result: {{ storeResult }}</p>
				<button @click="testCreateStore">Test createStore</button>
			</div>
		</section>

		<h2>Deep Comparison</h2>
		<section class="examples-grid">
			<div class="example-card">
				<h3>Deep Object</h3>
				<p>Object: {{ JSON.stringify(deepObject) }}</p>
				<p>Result: {{ deepObjectResult }}</p>
				<button @click="testDeepObject">Test Deep</button>
			</div>

			<div class="example-card">
				<h3>Deep Array</h3>
				<p>Array: {{ deepArray }}</p>
				<p>Result: {{ deepArrayResult }}</p>
				<button @click="testDeepArray">Test Deep Array</button>
			</div>
		</section>

		<h2>Options API Example</h2>
		<section class="examples-grid">
			<div class="example-card">
				<h3>Options API with data</h3>
				<p>Value: {{ optionsApiValue }}</p>
				<p>Result: {{ optionsApiResult }}</p>
				<button @click="testOptionsApi">Test Options API</button>
			</div>
		</section>
	</div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import until, { createStore } from 'untiljs'

export default {
	name: 'App',
	setup() {
		// ============================================
		// Basic Usage - Vue 2.7 Composition API
		// ============================================
		const toBeValue = ref(0)
		const toBeResult = ref('waiting...')

		const testToBe = async () => {
			toBeResult.value = 'waiting...'
			toBeValue.value = 0
			setTimeout(() => {
				toBeValue.value = 5
			}, 1000)
			// Use getter function with ref
			await until(() => toBeValue.value).toBe(5)
			toBeResult.value = `Success! Value is now ${toBeValue.value}`
		}

		const toMatchValue = ref(0)
		const toMatchResult = ref('waiting...')

		const testToMatch = async () => {
			toMatchResult.value = 'waiting...'
			toMatchValue.value = 0
			setTimeout(() => {
				toMatchValue.value = 10
			}, 1000)
			await until(() => toMatchValue.value).toMatch(v => v > 5)
			toMatchResult.value = `Success! Value ${toMatchValue.value} is greater than 5`
		}

		const truthyValue = ref(null)
		const truthyResult = ref('waiting...')

		const testTruthy = async () => {
			truthyResult.value = 'waiting...'
			truthyValue.value = null
			setTimeout(() => {
				truthyValue.value = { name: 'John', age: 30 }
			}, 1000)
			await until(() => truthyValue.value).toBeTruthy()
			truthyResult.value = `Success! Got object: ${JSON.stringify(truthyValue.value)}`
		}

		const nullValue = ref('not null')
		const nullResult = ref('waiting...')

		const testBeNull = async () => {
			nullResult.value = 'waiting...'
			nullValue.value = 'not null'
			setTimeout(() => {
				nullValue.value = null
			}, 1000)
			await until(() => nullValue.value).toBeNull()
			nullResult.value = 'Success! Value is now null'
		}

		// ============================================
		// Change Detection
		// ============================================
		const changedValue = ref('initial')
		const changedResult = ref('waiting...')

		const testChanged = async () => {
			changedResult.value = 'waiting...'
			changedValue.value = 'initial'
			setTimeout(() => {
				changedValue.value = 'changed!'
			}, 1000)
			await until(() => changedValue.value).changed()
			changedResult.value = `Success! Value changed to "${changedValue.value}"`
		}

		const changedTimesValue = ref(0)
		const changedTimesCount = ref(0)
		const changedTimesResult = ref('waiting...')

		const testChangedTimes = async () => {
			changedTimesResult.value = 'waiting...'
			changedTimesValue.value = 0
			changedTimesCount.value = 0

			let count = 0
			const interval = setInterval(() => {
				count++
				changedTimesValue.value = count
				changedTimesCount.value = count
			}, 200)

			await until(() => changedTimesValue.value).changedTimes(3)
			clearInterval(interval)
			changedTimesResult.value = `Success! Value changed 3 times, final: ${changedTimesValue.value}`
		}

		// ============================================
		// Not Modifier
		// ============================================
		const notToBeValue = ref(5)
		const notToBeResult = ref('waiting...')

		const testNotToBe = async () => {
			notToBeResult.value = 'waiting...'
			notToBeValue.value = 5
			setTimeout(() => {
				notToBeValue.value = 10
			}, 1000)
			await until(() => notToBeValue.value).not.toBe(5)
			notToBeResult.value = `Success! Value is no longer 5, it's ${notToBeValue.value}`
		}

		const notNullValue = ref(null)
		const notNullResult = ref('waiting...')

		const testNotNull = async () => {
			notNullResult.value = 'waiting...'
			notNullValue.value = null
			setTimeout(() => {
				notNullValue.value = 'has value'
			}, 1000)
			await until(() => notNullValue.value).not.toBeNull()
			notNullResult.value = `Success! Value is no longer null: "${notNullValue.value}"`
		}

		// ============================================
		// Timeout Options
		// ============================================
		const timeoutValue = ref(0)
		const timeoutResult = ref('waiting...')

		const testTimeout = async () => {
			timeoutResult.value = 'waiting...'
			timeoutValue.value = 0

			try {
				await until(() => timeoutValue.value).toBe(5, { timeout: 500, throwOnTimeout: true })
				timeoutResult.value = 'Unexpected success'
			} catch (error) {
				timeoutResult.value = `Timeout occurred! Error: ${error.message || error}`
			}
		}

		const timeoutNoThrowValue = ref(0)
		const timeoutNoThrowResult = ref('waiting...')

		const testTimeoutNoThrow = async () => {
			timeoutNoThrowResult.value = 'waiting...'
			timeoutNoThrowValue.value = 0

			const result = await until(() => timeoutNoThrowValue.value).toBe(5, { timeout: 500 })
			timeoutNoThrowResult.value = `Timeout - returned current value: ${result}`
		}

		// ============================================
		// createStore (Recommended for Vue 2)
		// ============================================
		const store = createStore(0)
		const storeValue = ref(store.value)
		const storeResult = ref('waiting...')

		let unsubscribe = null

		const testCreateStore = async () => {
			storeResult.value = 'waiting...'
			store.value = 0

			setTimeout(() => {
				store.value = 42
			}, 1000)

			await until(store).toBe(42)
			storeResult.value = `Success! createStore value is ${store.value}`
		}

		// ============================================
		// Deep Comparison
		// ============================================
		const deepObject = ref({ user: { profile: { name: 'Alice' } } })
		const deepObjectResult = ref('waiting...')

		const testDeepObject = async () => {
			deepObjectResult.value = 'waiting...'
			deepObject.value = { user: { profile: { name: 'Alice' } } }

			setTimeout(() => {
				deepObject.value = { user: { profile: { name: 'Bob' } } }
			}, 1000)

			await until(() => deepObject.value).toMatch(v => v.user.profile.name === 'Bob', { deep: true })
			deepObjectResult.value = `Success! Deep object changed: ${JSON.stringify(deepObject.value)}`
		}

		const deepArray = ref([1, 2, 3])
		const deepArrayResult = ref('waiting...')

		const testDeepArray = async () => {
			deepArrayResult.value = 'waiting...'
			deepArray.value = [1, 2, 3]

			setTimeout(() => {
				deepArray.value = [1, 2, 3, 4, 5]
			}, 1000)

			await until(() => deepArray.value).toBe([1, 2, 3, 4, 5], { deep: true })
			deepArrayResult.value = `Success! Array now has ${deepArray.value.length} items: ${deepArray.value.join(', ')}`
		}

		// ============================================
		// Options API Example (using this.$data)
		// ============================================
		const optionsApiValue = ref(0)
		const optionsApiResult = ref('waiting...')

		const testOptionsApi = async () => {
			optionsApiResult.value = 'waiting...'
			optionsApiValue.value = 0

			setTimeout(() => {
				optionsApiValue.value = 100
			}, 1000)

			await until(() => optionsApiValue.value).toBe(100)
			optionsApiResult.value = `Success! Options API value is ${optionsApiValue.value}`
		}

		onMounted(() => {
			console.log('untiljs Vue 2 Examples loaded!')
			console.log('Vue 2.7+ supports Composition API')
			console.log('Use getter functions: until(() => ref.value).toBe(x)')

			// Subscribe to store
			unsubscribe = store.subscribe((value) => {
				storeValue.value = value
			})
		})

		onUnmounted(() => {
			if (unsubscribe) {
				unsubscribe()
			}
		})

		return {
			// Basic
			toBeValue,
			toBeResult,
			testToBe,
			toMatchValue,
			toMatchResult,
			testToMatch,
			truthyValue,
			truthyResult,
			testTruthy,
			nullValue,
			nullResult,
			testBeNull,
			// Change Detection
			changedValue,
			changedResult,
			testChanged,
			changedTimesValue,
			changedTimesCount,
			changedTimesResult,
			testChangedTimes,
			// Not Modifier
			notToBeValue,
			notToBeResult,
			testNotToBe,
			notNullValue,
			notNullResult,
			testNotNull,
			// Timeout
			timeoutValue,
			timeoutResult,
			testTimeout,
			timeoutNoThrowValue,
			timeoutNoThrowResult,
			testTimeoutNoThrow,
			// createStore
			storeValue,
			storeResult,
			testCreateStore,
			// Deep Comparison
			deepObject,
			deepObjectResult,
			testDeepObject,
			deepArray,
			deepArrayResult,
			testDeepArray,
			// Options API
			optionsApiValue,
			optionsApiResult,
			testOptionsApi
		}
	}
}
</script>

<style scoped>
.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
	color: #42b883;
	border-bottom: 2px solid #42b883;
	padding-bottom: 10px;
}

h2 {
	color: #35495e;
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
	color: #42b883;
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
	background: #42b883;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 14px;
}

.example-card button:hover {
	background: #369970;
}
</style>
