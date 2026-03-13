<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import until from 'untiljs'

// ============================================
// Basic Usage Examples
// ============================================

// Example 1: toBe - Pass ref directly (recommended for Vue users!)
const toBeValue = ref(0)
const toBeResult = ref('waiting...')
const testToBe = async () => {
	toBeResult.value = 'waiting...'
	toBeValue.value = 0
	setTimeout(() => {
		toBeValue.value = 5
	}, 1000)
	// You can pass ref directly - no need for () => ref.value
	await until(toBeValue).toBe(5)
	toBeResult.value = `Success! Value is now ${toBeValue.value}`
}

// Example 2: toMatch - Custom condition
const toMatchValue = ref(0)
const toMatchResult = ref('waiting...')
const testToMatch = async () => {
	toMatchResult.value = 'waiting...'
	toMatchValue.value = 0
	setTimeout(() => {
		toMatchValue.value = 10
	}, 1000)
	// Pass ref directly
	await until(toMatchValue).toMatch(v => v > 5)
	toMatchResult.value = `Success! Value ${toMatchValue.value} is greater than 5`
}

// Example 3: toBeTruthy - Wait for truthy value
const truthyValue = ref(null)
const truthyResult = ref('waiting...')
const testTruthy = async () => {
	truthyResult.value = 'waiting...'
	truthyValue.value = null
	setTimeout(() => {
		truthyValue.value = { name: 'John', age: 30 }
	}, 1000)
	await until(truthyValue).toBeTruthy()
	truthyResult.value = `Success! Got object: ${JSON.stringify(truthyValue.value)}`
}

// Example 4: toBeNull - Wait for null
const nullValue = ref('not null')
const nullResult = ref('waiting...')
const testBeNull = async () => {
	nullResult.value = 'waiting...'
	nullValue.value = 'not null'
	setTimeout(() => {
		nullValue.value = null
	}, 1000)
	await until(nullValue).toBeNull()
	nullResult.value = 'Success! Value is now null'
}

// Example 5: toBeUndefined - Wait for undefined
const undefinedValue = ref('defined')
const undefinedResult = ref('waiting...')
const testBeUndefined = async () => {
	undefinedResult.value = 'waiting...'
	undefinedValue.value = 'defined'
	setTimeout(() => {
		undefinedValue.value = undefined
	}, 1000)
	await until(undefinedValue).toBeUndefined()
	undefinedResult.value = 'Success! Value is now undefined'
}

// Example 6: toBeNaN - Wait for NaN
const nanValue = ref(0)
const nanResult = ref('waiting...')
const testBeNaN = async () => {
	nanResult.value = 'waiting...'
	nanValue.value = 0
	setTimeout(() => {
		nanValue.value = NaN
	}, 1000)
	await until(nanValue).toBeNaN()
	nanResult.value = 'Success! Value is now NaN'
}

// ============================================
// Change Detection Examples
// ============================================

// Example 7: changed - Wait for any change
const changedValue = ref('initial')
const changedResult = ref('waiting...')
const testChanged = async () => {
	changedResult.value = 'waiting...'
	changedValue.value = 'initial'
	setTimeout(() => {
		changedValue.value = 'changed!'
	}, 1000)
	await until(changedValue).changed()
	changedResult.value = `Success! Value changed to "${changedValue.value}"`
}

// Example 8: changedTimes - Wait for N changes
const changedTimesValue = ref(0)
const changedTimesCount = ref(0)
const changedTimesResult = ref('waiting...')
const testChangedTimes = async () => {
	changedTimesResult.value = 'waiting...'
	changedTimesValue.value = 0
	changedTimesCount.value = 0

	const interval = setInterval(() => {
		changedTimesValue.value++
		changedTimesCount.value = changedTimesValue.value
	}, 200)

	await until(changedTimesValue).changedTimes(3)
	clearInterval(interval)
	changedTimesResult.value = `Success! Value changed 3 times, final value: ${changedTimesValue.value}`
}

// ============================================
// Not Modifier Examples
// ============================================

// Example 9: not.toBe - Inverse matching
const notToBeValue = ref(5)
const notToBeResult = ref('waiting...')
const testNotToBe = async () => {
	notToBeResult.value = 'waiting...'
	notToBeValue.value = 5
	setTimeout(() => {
		notToBeValue.value = 10
	}, 1000)
	await until(notToBeValue).not.toBe(5)
	notToBeResult.value = `Success! Value is no longer 5, it's ${notToBeValue.value}`
}

// Example 10: not.toBeNull - Wait for non-null
const notNullValue = ref(null)
const notNullResult = ref('waiting...')
const testNotNull = async () => {
	notNullResult.value = 'waiting...'
	notNullValue.value = null
	setTimeout(() => {
		notNullValue.value = 'has value'
	}, 1000)
	await until(notNullValue).not.toBeNull()
	notNullResult.value = `Success! Value is no longer null: "${notNullValue.value}"`
}

// ============================================
// Timeout Examples
// ============================================

// Example 11: Timeout with throwOnTimeout
const timeoutValue = ref(0)
const timeoutResult = ref('waiting...')
const testTimeout = async () => {
	timeoutResult.value = 'waiting...'
	timeoutValue.value = 0

	try {
		// This will timeout because value stays 0
		await until(timeoutValue).toBe(5, { timeout: 500, throwOnTimeout: true })
		timeoutResult.value = 'Unexpected success'
	} catch (error) {
		timeoutResult.value = `Timeout occurred as expected! Error: ${error.message || error}`
	}
}

// Example 12: Timeout without throwOnTimeout (returns current value)
const timeoutNoThrowValue = ref(0)
const timeoutNoThrowResult = ref('waiting...')
const testTimeoutNoThrow = async () => {
	timeoutNoThrowResult.value = 'waiting...'
	timeoutNoThrowValue.value = 0

	const result = await until(timeoutNoThrowValue).toBe(5, { timeout: 500 })
	timeoutNoThrowResult.value = `Timeout without throw - returned current value: ${result}`
}

// ============================================
// Deep Comparison Examples
// ============================================

// Example 13: Deep object comparison
const deepObject = ref({ user: { profile: { name: 'Alice' } } })
const deepObjectResult = ref('waiting...')
const testDeepObject = async () => {
	deepObjectResult.value = 'waiting...'
	deepObject.value = { user: { profile: { name: 'Alice' } } }

	setTimeout(() => {
		deepObject.value = { user: { profile: { name: 'Bob' } } }
	}, 1000)

	await until(deepObject).toMatch(v => v.user.profile.name === 'Bob', { deep: true })
	deepObjectResult.value = `Success! Deep object changed: ${JSON.stringify(deepObject.value)}`
}

// Example 14: Deep array comparison
const deepArray = ref([1, 2, 3])
const deepArrayResult = ref('waiting...')
const testDeepArray = async () => {
	deepArrayResult.value = 'waiting...'
	deepArray.value = [1, 2, 3]

	setTimeout(() => {
		deepArray.value = [1, 2, 3, 4, 5]
	}, 1000)

	await until(deepArray).toBe([1, 2, 3, 4, 5], { deep: true })
	deepArrayResult.value = `Success! Array now has ${deepArray.value.length} items: ${deepArray.value.join(', ')}`
}

// ============================================
// Array Methods Examples
// ============================================

// Example 15: toContains - Wait for array to contain value
const arrayValue = ref(['apple', 'banana'])
const arrayResult = ref('waiting...')
const testArrayContains = async () => {
	arrayResult.value = 'waiting...'
	arrayValue.value = ['apple', 'banana']

	setTimeout(() => {
		arrayValue.value = [...arrayValue.value, 'orange', 'grape']
	}, 1000)

	await until(arrayValue).toContains('orange')
	arrayResult.value = `Success! Array now contains 'orange': ${arrayValue.value.join(', ')}`
}

// ============================================
// Computed Values Examples
// ============================================

// Example 16: Watching computed values
const computedBase = ref(5)
const computedDoubled = computed(() => computedBase.value * 2)
const computedResult = ref('waiting...')
const testComputed = async () => {
	computedResult.value = 'waiting...'
	computedBase.value = 5

	setTimeout(() => {
		computedBase.value = 10
	}, 1000)

	// Computed refs work the same way!
	await until(computedDoubled).toBe(20)
	computedResult.value = `Success! Computed doubled value is ${computedDoubled.value} (base: ${computedBase.value})`
}

// ============================================
// Reactive Object Examples
// ============================================

// Example 17: Watching reactive objects (need getter for reactive)
const reactiveObj = reactive({ status: 'loading', progress: 0 })
const reactiveResult = ref('waiting...')
const testReactive = async () => {
	reactiveResult.value = 'waiting...'
	reactiveObj.status = 'loading'
	reactiveObj.progress = 0

	setTimeout(() => {
		reactiveObj.status = 'ready'
		reactiveObj.progress = 100
	}, 1000)

	// For reactive objects, use getter function
	await until(() => reactiveObj.status).toBe('ready')
	reactiveResult.value = `Success! Status: ${reactiveObj.status}, Progress: ${reactiveObj.progress}%`
}

// ============================================
// Multiple Conditions Examples
// ============================================

// Example 18: Complex condition matching
const complexCondition = ref({ loading: true, data: null, error: null })
const complexResult = ref('waiting...')
const testComplexCondition = async () => {
	complexResult.value = 'waiting...'
	complexCondition.value = { loading: true, data: null, error: null }

	setTimeout(() => {
		complexCondition.value = { loading: false, data: { items: [1, 2, 3] }, error: null }
	}, 1000)

	await until(complexCondition).toMatch(v => !v.loading && v.data !== null && !v.error, {
		deep: true
	})
	complexResult.value = `Success! Data loaded: ${JSON.stringify(complexCondition.value.data)}`
}

// ============================================
// Subscribable Pattern Example
// ============================================

// Example 19: Custom Subscribable (simulating external reactive source)
function createCustomSubscribable(initialValue) {
	let value = initialValue
	const listeners = new Set()

	return {
		get value() {
			return value
		},
		set value(newValue) {
			value = newValue
			listeners.forEach(cb => cb(value))
		},
		subscribe(callback) {
			listeners.add(callback)
			callback(value) // Initial call
			return () => listeners.delete(callback)
		}
	}
}

const customSubscribable = createCustomSubscribable(0)
const subscribableResult = ref('waiting...')
const testSubscribable = async () => {
	subscribableResult.value = 'waiting...'
	customSubscribable.value = 0

	setTimeout(() => {
		customSubscribable.value = 42
	}, 1000)

	// Subscribable objects with .value and .subscribe() are also supported
	await until(customSubscribable).toBe(42)
	subscribableResult.value = `Success! Subscribable value is ${customSubscribable.value}`
}

// ============================================
// Race Conditions Examples
// ============================================

// Example 20: Multiple promises with race
const raceValue = ref(0)
const raceResult = ref('waiting...')
const testRace = async () => {
	raceResult.value = 'waiting...'
	raceValue.value = 0

	// First to complete wins
	const result = await Promise.race([
		until(raceValue).toBe(5, { timeout: 3000 }),
		new Promise(resolve => setTimeout(() => resolve('timeout-first'), 2000))
	])

	raceResult.value = `Race result: ${typeof result === 'number' ? `matched value ${result}` : result}`
}

// Change value after 1 second
setTimeout(() => {
	raceValue.value = 5
}, 1000)

onMounted(() => {
	console.log('untiljs Vue 3 Examples loaded!')
	console.log('You can now use: until(ref) directly - no need for () => ref.value')
})
</script>

<template>
	<div class="container">
		<h1>untiljs Vue 3 Examples</h1>
		<p class="description">
			<strong>Now supports direct ref passing!</strong> Use <code>until(ref)</code> instead of
			<code>until(() => ref.value)</code> for cleaner code.
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

			<div class="example-card">
				<h3>toBeUndefined</h3>
				<p>Value: {{ undefinedValue }}</p>
				<p>Result: {{ undefinedResult }}</p>
				<button @click="testBeUndefined">Test toBeUndefined</button>
			</div>

			<div class="example-card">
				<h3>toBeNaN</h3>
				<p>Value: {{ nanValue }}</p>
				<p>Result: {{ nanResult }}</p>
				<button @click="testBeNaN">Test toBeNaN</button>
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
				<button @click="testTimeout">Test Timeout (throws)</button>
			</div>

			<div class="example-card">
				<h3>Timeout without throwOnTimeout</h3>
				<p>Value: {{ timeoutNoThrowValue }}</p>
				<p>Result: {{ timeoutNoThrowResult }}</p>
				<button @click="testTimeoutNoThrow">Test Timeout (no throw)</button>
			</div>
		</section>

		<h2>Deep Comparison</h2>
		<section class="examples-grid">
			<div class="example-card">
				<h3>Deep Object Comparison</h3>
				<p>Object: {{ JSON.stringify(deepObject) }}</p>
				<p>Result: {{ deepObjectResult }}</p>
				<button @click="testDeepObject">Test Deep Object</button>
			</div>

			<div class="example-card">
				<h3>Deep Array Comparison</h3>
				<p>Array: {{ deepArray }}</p>
				<p>Result: {{ deepArrayResult }}</p>
				<button @click="testDeepArray">Test Deep Array</button>
			</div>
		</section>

		<h2>Array Methods</h2>
		<section class="examples-grid">
			<div class="example-card">
				<h3>toContains</h3>
				<p>Array: {{ arrayValue }}</p>
				<p>Result: {{ arrayResult }}</p>
				<button @click="testArrayContains">Test toContains</button>
			</div>
		</section>

		<h2>Computed & Reactive</h2>
		<section class="examples-grid">
			<div class="example-card">
				<h3>Computed Values</h3>
				<p>Base: {{ computedBase }}, Doubled: {{ computedDoubled }}</p>
				<p>Result: {{ computedResult }}</p>
				<button @click="testComputed">Test Computed</button>
			</div>

			<div class="example-card">
				<h3>Reactive Objects</h3>
				<p>Status: {{ reactiveObj.status }}, Progress: {{ reactiveObj.progress }}%</p>
				<p>Result: {{ reactiveResult }}</p>
				<button @click="testReactive">Test Reactive</button>
			</div>
		</section>

		<h2>Advanced Patterns</h2>
		<section class="examples-grid">
			<div class="example-card">
				<h3>Complex Condition</h3>
				<p>Loading: {{ complexCondition.loading }}</p>
				<p>Has Data: {{ !!complexCondition.data }}</p>
				<p>Error: {{ complexCondition.error }}</p>
				<p>Result: {{ complexResult }}</p>
				<button @click="testComplexCondition">Test Complex</button>
			</div>

			<div class="example-card">
				<h3>Custom Subscribable</h3>
				<p>Value: {{ customSubscribable.value }}</p>
				<p>Result: {{ subscribableResult }}</p>
				<button @click="testSubscribable">Test Subscribable</button>
			</div>

			<div class="example-card">
				<h3>Promise.race</h3>
				<p>Value: {{ raceValue }}</p>
				<p>Result: {{ raceResult }}</p>
				<button @click="testRace">Test Race</button>
			</div>
		</section>
	</div>
</template>

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
	font-size: 14px;
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
	transition: background 0.2s;
}

.example-card button:hover {
	background: #369970;
}
</style>
