/**
 * untiljs Node.js Examples
 *
 * Run this file with: node examples/nodejs/node-example.mjs
 */

import { EventEmitter } from 'node:events'
import { setTimeout as sleep } from 'node:timers/promises'
import until from '../../dist/index.mjs'

console.log('='.repeat(60))
console.log('untiljs Node.js Examples')
console.log('='.repeat(60))
console.log()

// ============================================
// Example 1: Basic Usage with Variables
// ============================================
async function example1_basicUsage() {
	console.log('Example 1: Basic Usage with Variables')
	console.log('-'.repeat(40))

	let counter = 0

	// Start watching
	const promise = until(() => counter).toBe(5)

	// Simulate async updates
	setTimeout(() => {
		counter = 3
	}, 100)
	setTimeout(() => {
		counter = 5
	}, 200)

	await promise
	console.log(`✓ Counter reached: ${counter}`)
	console.log()
}

// ============================================
// Example 2: EventEmitter Integration
// ============================================
async function example2_eventEmitter() {
	console.log('Example 2: EventEmitter Integration')
	console.log('-'.repeat(40))

	const emitter = new EventEmitter()
	let status = 'pending'

	// Update status when event fires
	emitter.on('ready', (newStatus) => {
		status = newStatus
	})

	// Emit event after delay
	setTimeout(() => {
		emitter.emit('ready', 'ready')
	}, 500)

	await until(() => status).toBe('ready')
	console.log(`✓ Status: ${status}`)
	console.log()
}

// ============================================
// Example 3: Wait for Process State
// ============================================
async function example3_processState() {
	console.log('Example 3: Wait for Process State')
	console.log('-'.repeat(40))

	const processes = ['process1', 'process2']

	// Wait for at least 3 processes
	const promise = until(() => processes.length).toMatch((n) => n >= 3)

	// Add processes
	setTimeout(() => {
		processes.push('process3')
	}, 300)
	setTimeout(() => {
		processes.push('process4')
	}, 600)

	await promise
	console.log(`✓ Processes running: ${processes.join(', ')}`)
	console.log()
}

// ============================================
// Example 4: Polling with Timeout
// ============================================
async function example4_pollingWithTimeout() {
	console.log('Example 4: Polling with Timeout')
	console.log('-'.repeat(40))

	let resource = null

	// Simulate slow resource loading
	setTimeout(() => {
		resource = { id: 1, name: 'Database' }
	}, 300)

	// Wait with timeout
	const result = await until(() => resource).toBeTruthy({ timeout: 500 })

	console.log(`✓ Resource loaded: ${JSON.stringify(result)}`)
	console.log()
}

// ============================================
// Example 5: Custom Subscribable (RxJS-like)
// ============================================
async function example5_customSubscribable() {
	console.log('Example 5: Custom Subscribable (RxJS-like)')
	console.log('-'.repeat(40))

	// Create a simple BehaviorSubject-like object
	function createBehaviorSubject(initialValue) {
		let value = initialValue
		const observers = new Set()

		return {
			next(newValue) {
				this.value = newValue
			},
			subscribe(callback) {
				observers.add(callback)
				callback(value) // Initial call

				return () => observers.delete(callback)
			},
			get value() {
				return value
			},
			set value(newValue) {
				value = newValue
				observers.forEach((cb) => cb(value))
			}
		}
	}

	const subject = createBehaviorSubject(0)

	// Update values
	setTimeout(() => subject.next(10), 200)
	setTimeout(() => subject.next(20), 400)
	setTimeout(() => subject.next(30), 600)

	// Wait for specific value
	await until(subject).toBe(30)
	console.log(`✓ Subject value: ${subject.value}`)
	console.log()
}

// ============================================
// Example 6: Detect Changes
// ============================================
async function example6_detectChanges() {
	console.log('Example 6: Detect Changes')
	console.log('-'.repeat(40))

	let data = { version: 1 }

	// Update data periodically
	const interval = setInterval(() => {
		data = { version: data.version + 1 }
	}, 100)

	// Wait for 3 changes
	await until(() => data).changedTimes(3)
	clearInterval(interval)

	console.log(`✓ Data changed 3 times, version: ${data.version}`)
	console.log()
}

// ============================================
// Example 7: Deep Object Comparison
// ============================================
async function example7_deepComparison() {
	console.log('Example 7: Deep Object Comparison')
	console.log('-'.repeat(40))

	let config = {
		server: {
			host: 'localhost',
			port: 3000,
			status: 'starting'
		}
	}

	// Update nested property
	setTimeout(() => {
		config = {
			server: {
				host: 'localhost',
				port: 3000,
				status: 'running'
			}
		}
	}, 500)

	// Wait for server to be running with deep comparison
	await until(() => config).toMatch((c) => c.server.status === 'running', { deep: true })

	console.log(`✓ Server status: ${config.server.status}`)
	console.log()
}

// ============================================
// Example 8: Not Modifier
// ============================================
async function example8_notModifier() {
	console.log('Example 8: Not Modifier')
	console.log('-'.repeat(40))

	let isLoading = true

	// Set loading to false after delay
	setTimeout(() => {
		isLoading = false
	}, 500)

	// Wait until NOT loading
	await until(() => isLoading).not.toBe(true)
	console.log(`✓ Loading completed: ${isLoading}`)
	console.log()
}

// ============================================
// Example 9: Array Methods
// ============================================
async function example9_arrayMethods() {
	console.log('Example 9: Array Methods')
	console.log('-'.repeat(40))

	const queue = ['task1', 'task2']

	// Add tasks to queue
	setTimeout(() => {
		queue.push('task3')
	}, 200)
	setTimeout(() => {
		queue.push('task4')
	}, 400)

	// Wait for queue to contain 'task4'
	await until(() => queue).toContains('task4')
	console.log(`✓ Queue contains task4: [${queue.join(', ')}]`)
	console.log()
}

// ============================================
// Example 10: Promise.race Pattern
// ============================================
async function example10_promiseRace() {
	console.log('Example 10: Promise.race Pattern')
	console.log('-'.repeat(40))

	let response = null

	// Simulate API response
	const apiResponse = new Promise((resolve) => {
		setTimeout(() => {
			response = { data: 'success' }
			resolve(response)
		}, 800)
	})

	// Race between until and timeout
	const result = await Promise.race([
		until(() => response).toBeTruthy({ timeout: 2000 }),
		sleep(1000).then(() => 'timeout')
	])

	if (result === 'timeout') {
		console.log('✗ Operation timed out')
	} else {
		console.log(`✓ Got response: ${JSON.stringify(result)}`)
	}
	console.log()
}

// ============================================
// Run all examples
// ============================================
async function runAllExamples() {
	try {
		await example1_basicUsage()
		await example2_eventEmitter()
		await example3_processState()
		await example4_pollingWithTimeout()
		await example5_customSubscribable()
		await example6_detectChanges()
		await example7_deepComparison()
		await example8_notModifier()
		await example9_arrayMethods()
		await example10_promiseRace()

		console.log('='.repeat(60))
		console.log('All examples completed successfully!')
		console.log('='.repeat(60))
	} catch (error) {
		console.error('Error running examples:', error)
	}
}

runAllExamples()
