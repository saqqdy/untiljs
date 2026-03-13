import { useState, useEffect, useRef, useCallback } from 'react'
import until, { createStore } from 'untiljs'
import './App.css'

// ============================================
// Custom Hook: useUntil - React-friendly hook for untiljs
// ============================================
function useUntil(initialValue) {
	const ref = useRef(initialValue)
	const [value, setValue] = useState(initialValue)

	// Create a RefLike object that untiljs can watch
	const refLike = useRef({
		get value() {
			return ref.current
		},
		set value(newValue) {
			ref.current = newValue
			setValue(newValue)
		}
	})

	// Sync ref with state changes
	const setValueAndRef = useCallback(newValue => {
		ref.current = newValue
		setValue(newValue)
	}, [])

	return {
		value,
		setValue: setValueAndRef,
		ref: refLike.current,
		// For direct until usage
		until: () => until(refLike.current)
	}
}

// ============================================
// Simple reactive container using useRef
// ============================================
function createReactiveRef(initialValue) {
	return {
		_value: initialValue,
		get value() {
			return this._value
		},
		set value(newValue) {
			this._value = newValue
		}
	}
}

// ============================================
// Example Card Component
// ============================================
function ExampleCard({ title, children, onClick, buttonText = 'Test' }) {
	return (
		<div className="example-card">
			<h3>{title}</h3>
			{children}
			<button onClick={onClick}>{buttonText}</button>
		</div>
	)
}

// ============================================
// Basic Usage Examples
// ============================================
function BasicExamples() {
	// toBe - using useUntil hook
	const toBe = useUntil(0)
	const [toBeResult, setToBeResult] = useState('waiting...')
	const testToBe = async () => {
		setToBeResult('waiting...')
		toBe.setValue(0)
		setTimeout(() => toBe.setValue(5), 1000)
		await toBe.until().toBe(5)
		setToBeResult(`Success! Value is now ${toBe.value}`)
	}

	// toMatch
	const toMatch = useUntil(0)
	const [toMatchResult, setToMatchResult] = useState('waiting...')
	const testToMatch = async () => {
		setToMatchResult('waiting...')
		toMatch.setValue(0)
		setTimeout(() => toMatch.setValue(10), 1000)
		await toMatch.until().toMatch(v => v > 5)
		setToMatchResult(`Success! Value ${toMatch.value} is greater than 5`)
	}

	// toBeTruthy
	const truthy = useUntil(null)
	const [truthyResult, setTruthyResult] = useState('waiting...')
	const testTruthy = async () => {
		setTruthyResult('waiting...')
		truthy.setValue(null)
		setTimeout(() => truthy.setValue({ name: 'John', age: 30 }), 1000)
		await truthy.until().toBeTruthy()
		setTruthyResult(`Success! Got object: ${JSON.stringify(truthy.value)}`)
	}

	// toBeNull
	const nullVal = useUntil('not null')
	const [nullResult, setNullResult] = useState('waiting...')
	const testBeNull = async () => {
		setNullResult('waiting...')
		nullVal.setValue('not null')
		setTimeout(() => nullVal.setValue(null), 1000)
		await nullVal.until().toBeNull()
		setNullResult('Success! Value is now null')
	}

	// toBeUndefined
	const undefinedVal = useUntil('defined')
	const [undefinedResult, setUndefinedResult] = useState('waiting...')
	const testBeUndefined = async () => {
		setUndefinedResult('waiting...')
		undefinedVal.setValue('defined')
		setTimeout(() => undefinedVal.setValue(undefined), 1000)
		await undefinedVal.until().toBeUndefined()
		setUndefinedResult('Success! Value is now undefined')
	}

	// toBeNaN
	const nanVal = useUntil(0)
	const [nanResult, setNaNResult] = useState('waiting...')
	const testBeNaN = async () => {
		setNaNResult('waiting...')
		nanVal.setValue(0)
		setTimeout(() => nanVal.setValue(NaN), 1000)
		await nanVal.until().toBeNaN()
		setNaNResult('Success! Value is now NaN')
	}

	return (
		<section className="examples-section">
			<h2>Basic Usage</h2>
			<div className="examples-grid">
				<ExampleCard title="toBe" onClick={testToBe}>
					<p>Value: {toBe.value}</p>
					<p>Result: {toBeResult}</p>
				</ExampleCard>

				<ExampleCard title="toMatch" onClick={testToMatch}>
					<p>Value: {toMatch.value}</p>
					<p>Result: {toMatchResult}</p>
				</ExampleCard>

				<ExampleCard title="toBeTruthy" onClick={testTruthy}>
					<p>Value: {JSON.stringify(truthy.value)}</p>
					<p>Result: {truthyResult}</p>
				</ExampleCard>

				<ExampleCard title="toBeNull" onClick={testBeNull}>
					<p>Value: {JSON.stringify(nullVal.value)}</p>
					<p>Result: {nullResult}</p>
				</ExampleCard>

				<ExampleCard title="toBeUndefined" onClick={testBeUndefined}>
					<p>Value: {JSON.stringify(undefinedVal.value)}</p>
					<p>Result: {undefinedResult}</p>
				</ExampleCard>

				<ExampleCard title="toBeNaN" onClick={testBeNaN}>
					<p>Value: {Number.isNaN(nanVal.value) ? 'NaN' : nanVal.value}</p>
					<p>Result: {nanResult}</p>
				</ExampleCard>
			</div>
		</section>
	)
}

// ============================================
// Change Detection Examples
// ============================================
function ChangeDetectionExamples() {
	// changed
	const changed = useUntil('initial')
	const [changedResult, setChangedResult] = useState('waiting...')
	const testChanged = async () => {
		setChangedResult('waiting...')
		changed.setValue('initial')
		setTimeout(() => changed.setValue('changed!'), 1000)
		await changed.until().changed()
		setChangedResult(`Success! Value changed to "${changed.value}"`)
	}

	// changedTimes
	const changedTimes = useUntil(0)
	const [changedTimesCount, setChangedTimesCount] = useState(0)
	const [changedTimesResult, setChangedTimesResult] = useState('waiting...')
	const testChangedTimes = async () => {
		setChangedTimesResult('waiting...')
		changedTimes.setValue(0)
		setChangedTimesCount(0)

		let count = 0
		const interval = setInterval(() => {
			count++
			changedTimes.setValue(count)
			setChangedTimesCount(count)
		}, 200)

		await changedTimes.until().changedTimes(3)
		clearInterval(interval)
		setChangedTimesResult(`Success! Value changed 3 times, final value: ${changedTimes.value}`)
	}

	return (
		<section className="examples-section">
			<h2>Change Detection</h2>
			<div className="examples-grid">
				<ExampleCard title="changed" onClick={testChanged}>
					<p>Value: "{changed.value}"</p>
					<p>Result: {changedResult}</p>
				</ExampleCard>

				<ExampleCard title="changedTimes(3)" onClick={testChangedTimes}>
					<p>Value: {changedTimes.value}</p>
					<p>Changes: {changedTimesCount}</p>
					<p>Result: {changedTimesResult}</p>
				</ExampleCard>
			</div>
		</section>
	)
}

// ============================================
// Not Modifier Examples
// ============================================
function NotModifierExamples() {
	// not.toBe
	const notToBe = useUntil(5)
	const [notToBeResult, setNotToBeResult] = useState('waiting...')
	const testNotToBe = async () => {
		setNotToBeResult('waiting...')
		notToBe.setValue(5)
		setTimeout(() => notToBe.setValue(10), 1000)
		await notToBe.until().not.toBe(5)
		setNotToBeResult(`Success! Value is no longer 5, it's ${notToBe.value}`)
	}

	// not.toBeNull
	const notNull = useUntil(null)
	const [notNullResult, setNotNullResult] = useState('waiting...')
	const testNotNull = async () => {
		setNotNullResult('waiting...')
		notNull.setValue(null)
		setTimeout(() => notNull.setValue('has value'), 1000)
		await notNull.until().not.toBeNull()
		setNotNullResult(`Success! Value is no longer null: "${notNull.value}"`)
	}

	return (
		<section className="examples-section">
			<h2>Not Modifier</h2>
			<div className="examples-grid">
				<ExampleCard title="not.toBe" onClick={testNotToBe}>
					<p>Value: {notToBe.value}</p>
					<p>Result: {notToBeResult}</p>
				</ExampleCard>

				<ExampleCard title="not.toBeNull" onClick={testNotNull}>
					<p>Value: "{notNull.value}"</p>
					<p>Result: {notNullResult}</p>
				</ExampleCard>
			</div>
		</section>
	)
}

// ============================================
// Timeout Examples
// ============================================
function TimeoutExamples() {
	// Timeout with throwOnTimeout
	const timeout = useUntil(0)
	const [timeoutResult, setTimeoutResult] = useState('waiting...')
	const testTimeout = async () => {
		setTimeoutResult('waiting...')
		timeout.setValue(0)

		try {
			await timeout.until().toBe(5, { timeout: 500, throwOnTimeout: true })
			setTimeoutResult('Unexpected success')
		} catch (error) {
			setTimeoutResult(`Timeout occurred as expected! Error: ${error.message || error}`)
		}
	}

	// Timeout without throwOnTimeout
	const timeoutNoThrow = useUntil(0)
	const [timeoutNoThrowResult, setTimeoutNoThrowResult] = useState('waiting...')
	const testTimeoutNoThrow = async () => {
		setTimeoutNoThrowResult('waiting...')
		timeoutNoThrow.setValue(0)

		const result = await timeoutNoThrow.until().toBe(5, { timeout: 500 })
		setTimeoutNoThrowResult(`Timeout without throw - returned current value: ${result}`)
	}

	return (
		<section className="examples-section">
			<h2>Timeout Options</h2>
			<div className="examples-grid">
				<ExampleCard
					title="Timeout with throwOnTimeout"
					onClick={testTimeout}
					buttonText="Test Timeout (throws)"
				>
					<p>Value: {timeout.value}</p>
					<p>Result: {timeoutResult}</p>
				</ExampleCard>

				<ExampleCard
					title="Timeout without throwOnTimeout"
					onClick={testTimeoutNoThrow}
					buttonText="Test Timeout (no throw)"
				>
					<p>Value: {timeoutNoThrow.value}</p>
					<p>Result: {timeoutNoThrowResult}</p>
				</ExampleCard>
			</div>
		</section>
	)
}

// ============================================
// Deep Comparison Examples
// ============================================
function DeepComparisonExamples() {
	// Deep object comparison
	const deepObject = useUntil({ user: { profile: { name: 'Alice' } } })
	const [deepObjectResult, setDeepObjectResult] = useState('waiting...')
	const testDeepObject = async () => {
		setDeepObjectResult('waiting...')
		deepObject.setValue({ user: { profile: { name: 'Alice' } } })

		setTimeout(() => {
			deepObject.setValue({ user: { profile: { name: 'Bob' } } })
		}, 1000)

		await deepObject.until().toMatch(v => v.user.profile.name === 'Bob', { deep: true })
		setDeepObjectResult(`Success! Deep object changed: ${JSON.stringify(deepObject.value)}`)
	}

	// Deep array comparison
	const deepArray = useUntil([1, 2, 3])
	const [deepArrayResult, setDeepArrayResult] = useState('waiting...')
	const testDeepArray = async () => {
		setDeepArrayResult('waiting...')
		deepArray.setValue([1, 2, 3])

		setTimeout(() => {
			deepArray.setValue([1, 2, 3, 4, 5])
		}, 1000)

		await deepArray.until().toBe([1, 2, 3, 4, 5], { deep: true })
		setDeepArrayResult(
			`Success! Array now has ${deepArray.value.length} items: ${deepArray.value.join(', ')}`
		)
	}

	return (
		<section className="examples-section">
			<h2>Deep Comparison</h2>
			<div className="examples-grid">
				<ExampleCard title="Deep Object Comparison" onClick={testDeepObject}>
					<p>Object: {JSON.stringify(deepObject.value)}</p>
					<p>Result: {deepObjectResult}</p>
				</ExampleCard>

				<ExampleCard title="Deep Array Comparison" onClick={testDeepArray}>
					<p>
						Array: [{Array.isArray(deepArray.value) ? deepArray.value.join(', ') : ''}]
					</p>
					<p>Result: {deepArrayResult}</p>
				</ExampleCard>
			</div>
		</section>
	)
}

// ============================================
// Array Methods Examples
// ============================================
function ArrayMethodsExamples() {
	const arrayVal = useUntil(['apple', 'banana'])
	const [arrayResult, setArrayResult] = useState('waiting...')

	const testArrayContains = async () => {
		setArrayResult('waiting...')
		arrayVal.setValue(['apple', 'banana'])

		setTimeout(() => {
			arrayVal.setValue(['apple', 'banana', 'orange', 'grape'])
		}, 1000)

		await arrayVal.until().toContains('orange')
		setArrayResult(`Success! Array now contains 'orange': ${arrayVal.value.join(', ')}`)
	}

	return (
		<section className="examples-section">
			<h2>Array Methods</h2>
			<div className="examples-grid">
				<ExampleCard title="toContains" onClick={testArrayContains}>
					<p>Array: [{Array.isArray(arrayVal.value) ? arrayVal.value.join(', ') : ''}]</p>
					<p>Result: {arrayResult}</p>
				</ExampleCard>
			</div>
		</section>
	)
}

// ============================================
// createStore Examples (Built-in Solution)
// ============================================
function CreateStoreExamples() {
	// Create a store that persists across renders using built-in createStore
	const storeRef = useRef(null)
	if (!storeRef.current) {
		storeRef.current = createStore(0)
	}
	const store = storeRef.current

	const [storeValue, setStoreValue] = useState(store.value)
	const [storeResult, setStoreResult] = useState('waiting...')

	useEffect(() => {
		return store.subscribe(value => setStoreValue(value))
	}, [store])

	const testCreateStore = async () => {
		setStoreResult('waiting...')
		store.value = 0

		setTimeout(() => {
			store.value = 42
		}, 1000)

		await until(store).toBe(42)
		setStoreResult(`Success! createStore value is ${store.value}`)
	}

	return (
		<section className="examples-section">
			<h2>createStore (Built-in)</h2>
			<p className="description">
				<strong>Recommended for React!</strong> Use the built-in <code>createStore</code>{' '}
				function for clean React integration.
			</p>
			<div className="examples-grid">
				<ExampleCard title="createStore" onClick={testCreateStore}>
					<p>Value: {storeValue}</p>
					<p>Result: {storeResult}</p>
				</ExampleCard>
			</div>
		</section>
	)
}

// ============================================
// Async Data Loading Example
// ============================================
function AsyncDataExample() {
	const dataRef = useRef({ value: null })
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(false)
	const [loaded, setLoaded] = useState(false)

	// Create a ref-like object for until
	const refLike = {
		get value() {
			return dataRef.current.value
		}
	}

	const simulateDataLoad = useCallback(async () => {
		setLoading(true)
		setData(null)
		dataRef.current.value = null
		setLoaded(false)

		// Simulate API call
		setTimeout(() => {
			const newData = { users: ['Alice', 'Bob', 'Charlie'], count: 3 }
			dataRef.current.value = newData
			setData(newData)
			setLoading(false)
		}, 1500)

		// Wait for data to be loaded
		await until(refLike).toBeTruthy()
		setLoaded(true)
	}, [])

	return (
		<section className="examples-section">
			<h2>Async Data Loading</h2>
			<div className="examples-grid">
				<ExampleCard
					title="Wait for Data"
					onClick={simulateDataLoad}
					buttonText="Load Data"
				>
					<p>Loading: {loading.toString()}</p>
					<p>Loaded: {loaded.toString()}</p>
					<p>Data: {data ? JSON.stringify(data) : 'null'}</p>
				</ExampleCard>
			</div>
		</section>
	)
}

// ============================================
// Race Condition Example
// ============================================
function RaceConditionExample() {
	const raceRef = useRef({ value: 0 })
	const [raceValue, setRaceValue] = useState(0)
	const [raceResult, setRaceResult] = useState('waiting...')

	// Create a ref-like object for until
	const refLike = {
		get value() {
			return raceRef.current.value
		}
	}

	const testRace = async () => {
		setRaceResult('waiting...')
		raceRef.current.value = 0
		setRaceValue(0)

		// Change value after 1 second
		setTimeout(() => {
			raceRef.current.value = 5
			setRaceValue(5)
		}, 1000)

		// First to complete wins
		const result = await Promise.race([
			until(refLike).toBe(5, { timeout: 3000 }),
			new Promise(resolve => setTimeout(() => resolve('timeout-first'), 2000))
		])

		setRaceResult(
			`Race result: ${typeof result === 'number' ? `matched value ${result}` : result}`
		)
	}

	return (
		<section className="examples-section">
			<h2>Race Condition</h2>
			<div className="examples-grid">
				<ExampleCard title="Promise.race" onClick={testRace}>
					<p>Value: {raceValue}</p>
					<p>Result: {raceResult}</p>
				</ExampleCard>
			</div>
		</section>
	)
}

// ============================================
// Main App Component
// ============================================
function App() {
	return (
		<div className="container">
			<h1>untiljs React Examples</h1>
			<p className="description">
				<strong>Framework Agnostic!</strong> In React, use <code>createStore</code>{' '}
				(recommended) or <code>useUntil</code> hook for proper reactivity.
			</p>

			<CreateStoreExamples />
			<BasicExamples />
			<ChangeDetectionExamples />
			<NotModifierExamples />
			<TimeoutExamples />
			<DeepComparisonExamples />
			<ArrayMethodsExamples />
			<AsyncDataExample />
			<RaceConditionExample />
		</div>
	)
}

export default App
