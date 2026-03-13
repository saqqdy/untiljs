import type { RefLike, Subscribable, WatchSource } from './types'

/**
 * Check if a value is a Subscribable
 */
export function isSubscribable<T>(value: unknown): value is Subscribable<T> {
	return (
		value !== null &&
		typeof value === 'object' &&
		'value' in value &&
		typeof (value as Subscribable<T>).subscribe === 'function'
	)
}

/**
 * Check if a value is a RefLike (has value property but no subscribe)
 */
export function isRefLike<T>(value: unknown): value is RefLike<T> {
	return value !== null && typeof value === 'object' && 'value' in value && !isSubscribable(value)
}

/**
 * Check if a value is a getter function
 */
export function isGetter<T>(value: unknown): value is () => T {
	return typeof value === 'function'
}

/**
 * Get the current value from a WatchSource
 * Supports Subscribable, RefLike, getter function, or plain value
 */
export function toValue<T>(source: WatchSource<T>): T {
	if (isSubscribable<T>(source)) {
		return source.value
	}
	if (isRefLike<T>(source)) {
		return source.value
	}
	if (isGetter<T>(source)) {
		return source()
	}
	return source
}

/**
 * Deep equality comparison
 * @param a First value
 * @param b Second value
 * @param depth Depth limit for comparison (true = unlimited, number = specific depth)
 */
export function deepEqual(a: unknown, b: unknown, depth: boolean | number = true): boolean {
	if (Object.is(a, b)) return true

	if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
		return false
	}

	// Handle Date objects specially - compare by time value
	if (a instanceof Date && b instanceof Date) {
		return a.getTime() === b.getTime()
	}

	// Handle RegExp objects specially - compare by source and flags
	if (a instanceof RegExp && b instanceof RegExp) {
		return a.source === b.source && a.flags === b.flags
	}

	// Handle depth limit
	const maxDepth = typeof depth === 'number' ? depth : depth === true ? Infinity : 0
	if (maxDepth <= 0) {
		// At depth limit, use shallow comparison (reference equality already checked above)
		return false
	}

	// Compare arrays
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false
		return a.every((item, index) => deepEqual(item, b[index], maxDepth - 1))
	}

	// One is array, other is not
	if (Array.isArray(a) !== Array.isArray(b)) return false

	// Compare objects
	const keysA = Object.keys(a as object)
	const keysB = Object.keys(b as object)

	if (keysA.length !== keysB.length) return false

	return keysA.every(key => {
		return (
			Object.prototype.hasOwnProperty.call(b, key) &&
			deepEqual(
				(a as Record<string, unknown>)[key],
				(b as Record<string, unknown>)[key],
				maxDepth - 1
			)
		)
	})
}

/**
 * Create a watcher for a WatchSource
 * Returns an unsubscribe function
 *
 * @param source The source to watch
 * @param callback Function to call when value changes
 * @param options Watch options
 */
export function watchSource<T>(
	source: WatchSource<T>,
	callback: (value: T) => void,
	options: { immediate?: boolean; deep?: boolean | number } = {}
): () => void {
	const { immediate = true, deep = false } = options

	// Handle Subscribable
	if (isSubscribable<T>(source)) {
		let previousValue: T | undefined,
			isFirstCall = true

		const unsubscribe = source.subscribe(value => {
			if (isFirstCall) {
				isFirstCall = false
				if (immediate) {
					callback(value)
				}
				previousValue = value
				return
			}

			// Check if value actually changed
			if (deep) {
				if (!deepEqual(previousValue, value, deep)) {
					callback(value)
					previousValue = value
				}
			} else {
				if (!Object.is(previousValue, value)) {
					callback(value)
					previousValue = value
				}
			}
		})

		return unsubscribe
	}

	// Handle RefLike (objects with value property, like Vue ref)
	// These need to be polled like getter functions
	if (isRefLike<T>(source)) {
		let previousValue: T | undefined,
			isFirstCall = true,
			intervalId: ReturnType<typeof setInterval> | null = null,
			isStopped = false

		const checkValue = () => {
			if (isStopped) return

			try {
				const value = source.value

				if (isFirstCall) {
					isFirstCall = false
					previousValue = value
					if (immediate) {
						callback(value)
					}
					return
				}

				// Check if value changed
				if (deep) {
					if (!deepEqual(previousValue, value, deep)) {
						callback(value)
						previousValue = value
					}
				} else {
					if (!Object.is(previousValue, value)) {
						callback(value)
						previousValue = value
					}
				}
			} catch {
				// Ignore errors
			}
		}

		// Check immediately
		checkValue()

		// Poll for changes
		if (typeof requestAnimationFrame !== 'undefined') {
			const checkInRAF = () => {
				if (isStopped) return
				checkValue()
				requestAnimationFrame(checkInRAF)
			}
			requestAnimationFrame(checkInRAF)
		} else if (typeof setImmediate !== 'undefined') {
			const checkInImmediate = () => {
				if (isStopped) return
				checkValue()
				setImmediate(checkInImmediate)
			}
			setImmediate(checkInImmediate)
		} else if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
			const checkInNextTick = () => {
				if (isStopped) return
				checkValue()
				process.nextTick(checkInNextTick)
			}
			process.nextTick(checkInNextTick)
		} else {
			// Fallback to setInterval
			intervalId = setInterval(checkValue, 0)
		}

		return () => {
			isStopped = true
			if (intervalId) {
				clearInterval(intervalId)
			}
		}
	}

	// Handle getter function
	if (isGetter<T>(source)) {
		let previousValue: T | undefined,
			isFirstCall = true,
			intervalId: ReturnType<typeof setInterval> | null = null,
			isStopped = false

		const checkValue = () => {
			if (isStopped) return

			try {
				const value = source()

				if (isFirstCall) {
					isFirstCall = false
					previousValue = value
					if (immediate) {
						callback(value)
					}
					return
				}

				// Check if value changed
				if (deep) {
					if (!deepEqual(previousValue, value, deep)) {
						callback(value)
						previousValue = value
					}
				} else {
					if (!Object.is(previousValue, value)) {
						callback(value)
						previousValue = value
					}
				}
			} catch {
				// Ignore errors from getter
			}
		}

		// Check immediately
		checkValue()

		// Poll for changes
		if (typeof requestAnimationFrame !== 'undefined') {
			const checkInRAF = () => {
				if (isStopped) return
				checkValue()
				requestAnimationFrame(checkInRAF)
			}
			requestAnimationFrame(checkInRAF)
		} else if (typeof setImmediate !== 'undefined') {
			const checkInImmediate = () => {
				if (isStopped) return
				checkValue()
				setImmediate(checkInImmediate)
			}
			setImmediate(checkInImmediate)
		} else if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
			const checkInNextTick = () => {
				if (isStopped) return
				checkValue()
				process.nextTick(checkInNextTick)
			}
			process.nextTick(checkInNextTick)
		} else {
			// Fallback to setInterval
			intervalId = setInterval(checkValue, 0)
		}

		return () => {
			isStopped = true
			if (intervalId) {
				clearInterval(intervalId)
			}
		}
	}

	// Plain value - nothing to watch, just call callback immediately if immediate is true
	if (immediate) {
		callback(source)
	}
	return () => {}
}
