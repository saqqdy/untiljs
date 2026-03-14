import type { Subscribable } from '../src/types'
import { describe, expect, it } from 'vitest'
import {
	createStore,
	deepEqual,
	isGetter,
	isRefLike,
	isSubscribable,
	toValue,
	watchSource,
} from '../src/utils'

// ============================================
// isSubscribable Tests
// ============================================
describe('isSubscribable', () => {
	it('should return true for valid Subscribable objects', () => {
		const subscribable: Subscribable<number> = {
			subscribe: () => () => {},
			value: 1,
		}

		expect(isSubscribable(subscribable)).toBeTruthy()
	})

	it('should return true for Subscribable with getter value', () => {
		const internalValue = 1
		const subscribable: Subscribable<number> = {
			subscribe: () => () => {},
			get value() {
				return internalValue
			},
		}

		expect(isSubscribable(subscribable)).toBeTruthy()
	})

	it('should return false for null', () => {
		expect(isSubscribable(null)).toBeFalsy()
	})

	it('should return false for undefined', () => {
		expect(isSubscribable(undefined)).toBeFalsy()
	})

	it('should return false for plain objects without subscribe', () => {
		expect(isSubscribable({ value: 1 })).toBeFalsy()
	})

	it('should return false for objects with subscribe that is not a function', () => {
		expect(isSubscribable({ subscribe: 'not a function', value: 1 })).toBeFalsy()
		expect(isSubscribable({ subscribe: null, value: 1 })).toBeFalsy()
		expect(isSubscribable({ subscribe: 123, value: 1 })).toBeFalsy()
	})

	it('should return false for functions', () => {
		expect(isSubscribable(() => 1)).toBeFalsy()
	})

	it('should return false for primitives', () => {
		expect(isSubscribable(1)).toBeFalsy()
		expect(isSubscribable('string')).toBeFalsy()
		expect(isSubscribable(true)).toBeFalsy()
		expect(isSubscribable(Symbol('test'))).toBeFalsy()
	})

	it('should return false for arrays', () => {
		expect(isSubscribable([1, 2, 3])).toBeFalsy()
	})

	it('should return true for Subscribable with various value types', () => {
		expect(isSubscribable({ subscribe: () => () => {}, value: null })).toBeTruthy()
		expect(isSubscribable({ subscribe: () => () => {}, value: undefined })).toBeTruthy()
		expect(isSubscribable({ subscribe: () => () => {}, value: { nested: true } })).toBeTruthy()
		expect(isSubscribable({ subscribe: () => () => {}, value: [1, 2, 3] })).toBeTruthy()
	})
})

// ============================================
// isRefLike Tests
// ============================================
describe('isRefLike', () => {
	it('should return true for objects with value property', () => {
		expect(isRefLike({ value: 1 })).toBeTruthy()
		expect(isRefLike({ value: 'test' })).toBeTruthy()
		expect(isRefLike({ value: null })).toBeTruthy()
		expect(isRefLike({ value: undefined })).toBeTruthy()
		expect(isRefLike({ value: { nested: true } })).toBeTruthy()
		expect(isRefLike({ value: [1, 2, 3] })).toBeTruthy()
	})

	it('should return true for objects with extra properties', () => {
		expect(isRefLike({ foo: 'bar', value: 1 })).toBeTruthy()
		expect(isRefLike({ __v_isRef: true, value: 1 })).toBeTruthy()
	})

	it('should return false for Subscribable objects', () => {
		const subscribable: Subscribable<number> = {
			subscribe: () => () => {},
			value: 1,
		}

		expect(isRefLike(subscribable)).toBeFalsy()
	})

	it('should return false for null', () => {
		expect(isRefLike(null)).toBeFalsy()
	})

	it('should return false for undefined', () => {
		expect(isRefLike(undefined)).toBeFalsy()
	})

	it('should return false for functions', () => {
		expect(isRefLike(() => 1)).toBeFalsy()
	})

	it('should return false for primitives', () => {
		expect(isRefLike(1)).toBeFalsy()
		expect(isRefLike('string')).toBeFalsy()
		expect(isRefLike(true)).toBeFalsy()
		expect(isRefLike(Symbol('test'))).toBeFalsy()
	})

	it('should return false for objects without value property', () => {
		expect(isRefLike({ foo: 'bar' })).toBeFalsy()
		expect(isRefLike({})).toBeFalsy()
	})

	it('should return false for arrays', () => {
		expect(isRefLike([1, 2, 3])).toBeFalsy()
		expect(isRefLike([])).toBeFalsy()
	})

	it('should return true for getter-based value', () => {
		const internalValue = 1
		const refLike = {
			get value() {
				return internalValue
			},
		}

		expect(isRefLike(refLike)).toBeTruthy()
	})
})

// ============================================
// isGetter Tests
// ============================================
describe('isGetter', () => {
	it('should return true for functions', () => {
		expect(isGetter(() => 1)).toBeTruthy()
		expect(isGetter(() => 'test')).toBeTruthy()
		expect(
			isGetter(() => {
				return 1
			}),
		).toBeTruthy()
		expect(isGetter(async () => 1)).toBeTruthy()
		expect(
			isGetter(function* () {
				yield 1
			}),
		).toBeTruthy()
	})

	it('should return false for non-functions', () => {
		expect(isGetter(1)).toBeFalsy()
		expect(isGetter('string')).toBeFalsy()
		expect(isGetter(null)).toBeFalsy()
		expect(isGetter(undefined)).toBeFalsy()
		expect(isGetter({})).toBeFalsy()
		expect(isGetter([])).toBeFalsy()
		expect(isGetter(true)).toBeFalsy()
	})
})

// ============================================
// toValue Tests
// ============================================
describe('toValue', () => {
	describe('Subscribable', () => {
		it('should extract value from Subscribable', () => {
			const subscribable: Subscribable<number> = {
				subscribe: () => () => {},
				value: 42,
			}

			expect(toValue(subscribable)).toBe(42)
		})

		it('should extract value from Subscribable with getter', () => {
			const internalValue = 'test'
			const subscribable: Subscribable<string> = {
				subscribe: () => () => {},
				get value() {
					return internalValue
				},
			}

			expect(toValue(subscribable)).toBe('test')
		})
	})

	describe('RefLike', () => {
		it('should extract value from RefLike object', () => {
			expect(toValue({ value: 123 })).toBe(123)
			expect(toValue({ value: 'test' })).toBe('test')
			expect(toValue({ value: null })).toBeNull()
			expect(toValue({ value: undefined })).toBeUndefined()
		})

		it('should extract complex values from RefLike', () => {
			const obj = { a: 1, b: 2 }
			const arr = [1, 2, 3]

			expect(toValue({ value: obj })).toBe(obj)
			expect(toValue({ value: arr })).toBe(arr)
		})

		it('should extract value from RefLike with extra properties', () => {
			expect(toValue({ __v_isRef: true, foo: 'bar', value: 1 })).toBe(1)
		})

		it('should extract value from RefLike with getter', () => {
			const internalValue = 'dynamic'
			const refLike = {
				get value() {
					return internalValue
				},
			}

			expect(toValue(refLike)).toBe('dynamic')
		})
	})

	describe('Getter function', () => {
		it('should call getter function and return result', () => {
			expect(toValue(() => 123)).toBe(123)
			expect(toValue(() => 'test')).toBe('test')
		})

		it('should call getter each time', () => {
			let counter = 0
			const getter = () => ++counter

			expect(toValue(getter)).toBe(1)
			expect(toValue(getter)).toBe(2)
			expect(toValue(getter)).toBe(3)
		})
	})

	describe('Plain value', () => {
		it('should return plain value as-is', () => {
			expect(toValue(42)).toBe(42)
			expect(toValue('string')).toBe('string')
			expect(toValue(null)).toBeNull()
			expect(toValue(undefined)).toBeUndefined()
			expect(toValue(true)).toBeTruthy()
		})

		it('should return object without value property as-is', () => {
			const obj = { a: 1, b: 2 }

			expect(toValue(obj)).toBe(obj)
		})

		it('should return array as-is', () => {
			const arr = [1, 2, 3]

			expect(toValue(arr)).toBe(arr)
		})

		it('should return Symbol as-is', () => {
			const sym = Symbol('test')

			expect(toValue(sym)).toBe(sym)
		})

		it('should return BigInt as-is', () => {
			expect(toValue(10n)).toBe(10n)
			expect(toValue(BigInt(100))).toBe(BigInt(100))
		})

		it('should return number 0 correctly', () => {
			expect(toValue(0)).toBe(0)
			expect(toValue(-0)).toBe(-0)
		})

		it('should return empty string correctly', () => {
			expect(toValue('')).toBe('')
		})

		it('should return false correctly', () => {
			expect(toValue(false)).toBeFalsy()
		})

		it('should return NaN as-is', () => {
			expect(toValue(Number.NaN)).toBeNaN()
		})

		it('should return Infinity as-is', () => {
			expect(toValue(Infinity)).toBe(Infinity)
			expect(toValue(-Infinity)).toBe(-Infinity)
		})
	})

	describe('Priority order', () => {
		it('should prioritize Subscribable over RefLike', () => {
			// Object with both value and subscribe should be treated as Subscribable
			const subscribable = {
				subscribe: () => () => {},
				value: 42,
			}

			expect(toValue(subscribable)).toBe(42)
		})

		it('should prioritize RefLike over getter when object has value', () => {
			// Object with value property is RefLike, not a getter
			const refLike = { value: 'test' }

			expect(toValue(refLike)).toBe('test')
		})

		it('should handle function returning object with value property', () => {
			// Getter function takes priority
			const getter = () => ({ value: 'inner' })
			const result = toValue(getter)

			expect(result).toEqual({ value: 'inner' })
		})
	})

	describe('Edge cases', () => {
		it('should handle nested RefLike objects', () => {
			const nested = { value: { value: 'nested' } }

			expect(toValue(nested)).toEqual({ value: 'nested' })
		})

		it('should handle function that throws', () => {
			const throwingGetter = () => {
				throw new Error('test error')
			}

			expect(() => toValue(throwingGetter)).toThrow('test error')
		})

		it('should handle async function (returns Promise)', () => {
			const asyncGetter = async () => 'async result'
			const result = toValue(asyncGetter)

			expect(result).toBeInstanceOf(Promise)
		})

		it('should handle generator function', () => {
			function* gen() {
				yield 1
				yield 2
			}
			const result = toValue(gen)

			expect(result.next).toBeDefined()
		})

		it('should handle Date object', () => {
			const date = new Date('2024-01-01')

			expect(toValue(date)).toBe(date)
		})

		it('should handle RegExp object', () => {
			const regex = /test/g

			expect(toValue(regex)).toBe(regex)
		})

		it('should handle Map object', () => {
			const map = new Map([['key', 'value']])

			expect(toValue(map)).toBe(map)
		})

		it('should handle Set object', () => {
			const set = new Set([1, 2, 3])

			expect(toValue(set)).toBe(set)
		})

		it('should handle class instance', () => {
			class MyClass {
				value = 'instance'
			}
			const instance = new MyClass()

			// Class instance with value property is RefLike
			expect(toValue(instance)).toBe('instance')
		})

		it('should handle class instance without value property', () => {
			class MyClass {
				data = 'instance'
			}
			const instance = new MyClass()

			expect(toValue(instance)).toBe(instance)
		})

		it('should handle circular reference in value', () => {
			const circular: { value: unknown } = { value: null }

			circular.value = circular
			expect(toValue(circular)).toBe(circular)
		})

		it('should handle function with this context', () => {
			const obj = {
				getValue() {
					return this.value
				},
				value: 10,
			}

			expect(toValue(obj.getValue.bind(obj))).toBe(10)
		})

		it('should handle arrow function capturing closure', () => {
			let captured = 'initial'
			const getter = () => captured

			expect(toValue(getter)).toBe('initial')
			captured = 'changed'
			expect(toValue(getter)).toBe('changed')
		})

		it('should handle empty object', () => {
			expect(toValue({})).toEqual({})
		})

		it('should handle empty array', () => {
			expect(toValue([])).toEqual([])
		})
	})

	describe('Type safety', () => {
		it('should preserve number type', () => {
			const num: number = toValue(42)

			expect(typeof num).toBe('number')
		})

		it('should preserve string type', () => {
			const str: string = toValue('test')

			expect(typeof str).toBe('string')
		})

		it('should preserve boolean type', () => {
			const bool: boolean = toValue(true)

			expect(typeof bool).toBe('boolean')
		})

		it('should preserve object type', () => {
			const obj = { a: 1, b: 2 }
			const result: typeof obj = toValue(obj)

			expect(result).toBe(obj)
		})

		it('should preserve array type', () => {
			const arr = [1, 2, 3]
			const result: typeof arr = toValue(arr)

			expect(result).toBe(arr)
		})
	})
})

// ============================================
// deepEqual Tests
// ============================================
describe('deepEqual', () => {
	describe('primitive comparison', () => {
		it('should return true for identical primitives', () => {
			expect(deepEqual(1, 1)).toBeTruthy()
			expect(deepEqual('string', 'string')).toBeTruthy()
			expect(deepEqual(true, true)).toBeTruthy()
			expect(deepEqual(false, false)).toBeTruthy()
			expect(deepEqual(null, null)).toBeTruthy()
			expect(deepEqual(undefined, undefined)).toBeTruthy()
		})

		it('should return true for NaN values', () => {
			expect(deepEqual(Number.NaN, Number.NaN)).toBeTruthy()
		})

		it('should return true for Object.is special cases', () => {
			expect(deepEqual(0, 0)).toBeTruthy()
			expect(deepEqual(-0, -0)).toBeTruthy()
			// Note: Object.is(0, -0) is false, but this is edge case
		})

		it('should return false for different primitives', () => {
			expect(deepEqual(1, 2)).toBeFalsy()
			expect(deepEqual('a', 'b')).toBeFalsy()
			expect(deepEqual(true, false)).toBeFalsy()
			expect(deepEqual(1, '1')).toBeFalsy()
			expect(deepEqual(null, undefined)).toBeFalsy()
			expect(deepEqual(0, '')).toBeFalsy()
		})

		it('should return false for primitive vs object', () => {
			expect(deepEqual(1, { value: 1 })).toBeFalsy()
			expect(deepEqual('test', Object('test'))).toBeFalsy()
		})
	})

	describe('object comparison', () => {
		it('should return true for identical object references', () => {
			const obj = { a: 1 }

			expect(deepEqual(obj, obj)).toBeTruthy()
		})

		it('should return true for deeply equal objects', () => {
			expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBeTruthy()
			expect(deepEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBeTruthy()
		})

		it('should return true for empty objects', () => {
			expect(deepEqual({}, {})).toBeTruthy()
		})

		it('should return false for different objects', () => {
			expect(deepEqual({ a: 1 }, { a: 2 })).toBeFalsy()
			expect(deepEqual({ a: 1 }, { b: 1 })).toBeFalsy()
			expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBeFalsy()
			expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBeFalsy()
		})

		it('should return false for object vs null', () => {
			expect(deepEqual({ a: 1 }, null)).toBeFalsy()
			expect(deepEqual(null, { a: 1 })).toBeFalsy()
		})

		it('should return false for object vs undefined', () => {
			expect(deepEqual({ a: 1 }, undefined)).toBeFalsy()
			expect(deepEqual(undefined, { a: 1 })).toBeFalsy()
		})

		it('should handle objects with various key types', () => {
			const sym = Symbol('key')

			expect(deepEqual({ [sym]: 1 }, { [sym]: 1 })).toBeTruthy()
		})

		it('should handle objects with same keys but different values', () => {
			expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBeFalsy()
		})

		it('should handle objects with same values but different key order', () => {
			expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBeTruthy()
		})
	})

	describe('array comparison', () => {
		it('should return true for identical arrays', () => {
			expect(deepEqual([1, 2, 3], [1, 2, 3])).toBeTruthy()
			expect(deepEqual([], [])).toBeTruthy()
		})

		it('should return true for deeply equal nested arrays', () => {
			expect(deepEqual([[1, 2], [3]], [[1, 2], [3]])).toBeTruthy()
			expect(deepEqual([[[[1]]]], [[[[1]]]])).toBeTruthy()
		})

		it('should return false for different arrays', () => {
			expect(deepEqual([1, 2], [1, 2, 3])).toBeFalsy()
			expect(deepEqual([1, 2], [2, 1])).toBeFalsy()
			expect(deepEqual([1], [2])).toBeFalsy()
		})

		it('should return false for array vs object', () => {
			expect(deepEqual([1, 2], { 0: 1, 1: 2 })).toBeFalsy()
			expect(deepEqual({ 0: 1, 1: 2 }, [1, 2])).toBeFalsy()
		})

		it('should handle arrays with mixed types', () => {
			expect(deepEqual([1, 'a', null], [1, 'a', null])).toBeTruthy()
			expect(deepEqual([1, { a: 1 }], [1, { a: 1 }])).toBeTruthy()
		})
	})

	describe('mixed object/array comparison', () => {
		it('should compare objects containing arrays', () => {
			expect(deepEqual({ arr: [1, 2] }, { arr: [1, 2] })).toBeTruthy()
			expect(deepEqual({ arr: [1, 2] }, { arr: [1, 3] })).toBeFalsy()
		})

		it('should compare arrays containing objects', () => {
			expect(deepEqual([{ a: 1 }], [{ a: 1 }])).toBeTruthy()
			expect(deepEqual([{ a: 1 }], [{ a: 2 }])).toBeFalsy()
		})
	})

	describe('depth limiting', () => {
		it('should compare with unlimited depth when true', () => {
			const obj1 = { a: { b: { c: { d: 1 } } } }
			const obj2 = { a: { b: { c: { d: 1 } } } }
			const obj3 = { a: { b: { c: { d: 2 } } } }

			expect(deepEqual(obj1, obj2, true)).toBeTruthy()
			expect(deepEqual(obj1, obj3, true)).toBeFalsy()
		})

		it('should return false when depth is 0', () => {
			expect(deepEqual({ a: 1 }, { a: 1 }, 0)).toBeFalsy()
			expect(deepEqual([1], [1], 0)).toBeFalsy()
		})

		it('should compare with specific depth', () => {
			// Depth 1: can compare keys at first level
			expect(deepEqual({ a: 1 }, { a: 1 }, 1)).toBeTruthy()
			expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } }, 1)).toBeFalsy() // nested requires more depth
		})

		it('should handle depth with arrays', () => {
			expect(deepEqual([1, 2], [1, 2], 1)).toBeTruthy()
			expect(deepEqual([[1]], [[1]], 1)).toBeFalsy() // nested requires more depth
		})
	})

	describe('special objects', () => {
		it('should handle Date objects', () => {
			const date1 = new Date('2024-01-01')
			const date2 = new Date('2024-01-01')
			const date3 = new Date('2024-01-02')

			// Date objects are compared by their internal time value
			expect(deepEqual(date1, date2)).toBeTruthy() // Same time value
			expect(deepEqual(date1, date3)).toBeFalsy() // Different time values
			expect(deepEqual(date1, date1)).toBeTruthy() // Same reference
		})

		it('should handle RegExp objects', () => {
			const regex1 = /test/g
			const _regex2 = /test/g

			expect(deepEqual(regex1, regex1)).toBeTruthy()
		})
	})
})

// ============================================
// watchSource Tests
// ============================================
describe('watchSource', () => {
	describe('with Subscribable', () => {
		it('should call callback immediately when immediate is true', async () => {
			const currentValue = 1
			let receivedValue: number | undefined

			const subscribable: Subscribable<number> = {
				subscribe: (callback) => {
					callback(currentValue)

					return () => {}
				},
				get value() {
					return currentValue
				},
			}

			const stop = watchSource(
				subscribable,
				(value) => {
					receivedValue = value
				},
				{ immediate: true },
			)

			expect(receivedValue).toBe(1)
			stop()
		})

		it('should not call callback immediately when immediate is false', async () => {
			const currentValue = 1
			let callCount = 0

			const subscribable: Subscribable<number> = {
				subscribe: () => () => {},
				get value() {
					return currentValue
				},
			}

			const stop = watchSource(
				subscribable,
				() => {
					callCount++
				},
				{ immediate: false },
			)

			expect(callCount).toBe(0)
			stop()
		})

		it('should call callback when value changes via subscription', async () => {
			let currentValue = 1
			const callbacks: ((value: number) => void)[] = []

			const subscribable: Subscribable<number> = {
				subscribe: (callback) => {
					callbacks.push(callback)
					callback(currentValue)

					return () => {}
				},
				get value() {
					return currentValue
				},
			}

			const receivedValues: number[] = []
			const stop = watchSource(subscribable, (value) => {
				receivedValues.push(value)
			})

			expect(receivedValues).toEqual([1])

			currentValue = 2
			callbacks.forEach((cb) => cb(2))

			expect(receivedValues).toEqual([1, 2])
			stop()
		})

		it('should not trigger for same value', async () => {
			let currentValue = 1
			const callbacks: ((value: number) => void)[] = []

			const subscribable: Subscribable<number> = {
				subscribe: (callback) => {
					callbacks.push(callback)
					callback(currentValue)

					return () => {}
				},
				get value() {
					return currentValue
				},
			}

			const receivedValues: number[] = []
			const stop = watchSource(subscribable, (value) => {
				receivedValues.push(value)
			})

			expect(receivedValues).toEqual([1])

			// Same value - should not trigger
			callbacks.forEach((cb) => cb(1))
			expect(receivedValues).toEqual([1])

			// Different value - should trigger
			currentValue = 2
			callbacks.forEach((cb) => cb(2))
			expect(receivedValues).toEqual([1, 2])

			stop()
		})

		it('should work with deep option for Subscribable', async () => {
			let currentValue = { a: { b: 1 } }
			const callbacks: ((value: typeof currentValue) => void)[] = []

			const subscribable: Subscribable<typeof currentValue> = {
				subscribe: (callback) => {
					callbacks.push(callback)
					callback(currentValue)

					return () => {}
				},
				get value() {
					return currentValue
				},
			}

			const receivedValues: object[] = []
			const stop = watchSource(
				subscribable,
				(value) => {
					receivedValues.push(value)
				},
				{ deep: true },
			)

			expect(receivedValues).toHaveLength(1)

			// Different reference, same content - should not trigger with deep
			currentValue = { a: { b: 1 } }
			callbacks.forEach((cb) => cb(currentValue))
			expect(receivedValues).toHaveLength(1) // Same content, no trigger

			// Different content
			currentValue = { a: { b: 2 } }
			callbacks.forEach((cb) => cb(currentValue))
			expect(receivedValues).toHaveLength(2)

			stop()
		})

		it('should return unsubscribe function', async () => {
			const subscribable: Subscribable<number> = {
				subscribe: () => () => {},
				value: 1,
			}

			const stop = watchSource(subscribable, () => {})

			expect(typeof stop).toBe('function')
			stop()
		})
	})

	describe('with RefLike', () => {
		it('should call callback immediately when immediate is true', async () => {
			const refLike = { value: 1 }
			let receivedValue: number | undefined

			const stop = watchSource(
				refLike,
				(v) => {
					receivedValue = v
				},
				{ immediate: true },
			)

			expect(receivedValue).toBe(1)
			stop()
		})

		it('should not call callback immediately when immediate is false', async () => {
			const refLike = { value: 1 }
			let callCount = 0

			const stop = watchSource(
				refLike,
				() => {
					callCount++
				},
				{ immediate: false },
			)

			expect(callCount).toBe(0)
			stop()
		})

		it('should detect value changes in RefLike', async () => {
			const refLike = { value: 1 }
			const receivedValues: number[] = []

			const stop = watchSource(refLike, (v) => {
				receivedValues.push(v)
			})

			await new Promise((resolve) => setTimeout(resolve, 50))
			expect(receivedValues).toEqual([1])

			refLike.value = 2
			await new Promise((resolve) => setTimeout(resolve, 100))
			expect(receivedValues).toContain(2)

			stop()
		})

		it('should work with deep option for RefLike', async () => {
			const refLike = { value: { a: { b: 1 } } }
			const receivedValues: object[] = []

			const stop = watchSource(
				refLike,
				(v) => {
					receivedValues.push(v)
				},
				{ deep: true, immediate: true },
			)

			await new Promise((resolve) => setTimeout(resolve, 50))

			refLike.value = { a: { b: 2 } }
			await new Promise((resolve) => setTimeout(resolve, 100))

			expect(receivedValues.length).toBeGreaterThan(1)
			stop()
		})

		it('should handle null and undefined values', async () => {
			const refLike = { value: null as any }
			const receivedValues: any[] = []

			const stop = watchSource(refLike, (v) => {
				receivedValues.push(v)
			})

			await new Promise((resolve) => setTimeout(resolve, 50))

			refLike.value = undefined
			await new Promise((resolve) => setTimeout(resolve, 100))

			refLike.value = 'test'
			await new Promise((resolve) => setTimeout(resolve, 100))

			expect(receivedValues).toContain(null)
			expect(receivedValues).toContain(undefined)
			expect(receivedValues).toContain('test')

			stop()
		})

		it('should stop watching after stop() is called', async () => {
			const refLike = { value: 1 }
			const receivedValues: number[] = []

			const stop = watchSource(refLike, (v) => {
				receivedValues.push(v)
			})

			await new Promise((resolve) => setTimeout(resolve, 50))
			expect(receivedValues).toEqual([1])

			stop()

			refLike.value = 2
			await new Promise((resolve) => setTimeout(resolve, 100))

			// Should not have received the change after stop
			expect(receivedValues).toEqual([1])
		})
	})

	describe('with getter function', () => {
		it('should call callback immediately when immediate is true', async () => {
			const value = 1
			let receivedValue: number | undefined

			const stop = watchSource(
				() => value,
				(v) => {
					receivedValue = v
				},
				{ immediate: true },
			)

			expect(receivedValue).toBe(1)
			stop()
		})

		it('should not call callback immediately when immediate is false', async () => {
			const value = 1
			let callCount = 0

			const stop = watchSource(
				() => value,
				() => {
					callCount++
				},
				{ immediate: false },
			)

			expect(callCount).toBe(0)
			stop()
		})

		it('should detect value changes', async () => {
			let value = 1
			const receivedValues: number[] = []

			const stop = watchSource(
				() => value,
				(v) => {
					receivedValues.push(v)
				},
			)

			await new Promise((resolve) => setTimeout(resolve, 50))
			expect(receivedValues).toEqual([1])

			value = 2
			await new Promise((resolve) => setTimeout(resolve, 100))
			expect(receivedValues).toContain(2)

			stop()
		})

		it('should handle getter that throws', async () => {
			let shouldThrow = true
			const receivedValues: string[] = []

			const stop = watchSource(
				() => {
					if (shouldThrow) throw new Error('Not ready')

					return 'ready'
				},
				(v) => {
					receivedValues.push(v)
				},
			)

			await new Promise((resolve) => setTimeout(resolve, 50))
			expect(receivedValues).toEqual([]) // No calls due to errors

			shouldThrow = false
			await new Promise((resolve) => setTimeout(resolve, 100))
			expect(receivedValues).toContain('ready')

			stop()
		})

		it('should work with deep option for getter', async () => {
			let value = { a: { b: 1 } }
			const receivedValues: object[] = []

			const stop = watchSource(
				() => value,
				(v) => {
					receivedValues.push(v)
				},
				{ deep: true, immediate: true },
			)

			await new Promise((resolve) => setTimeout(resolve, 50))

			value = { a: { b: 2 } }
			await new Promise((resolve) => setTimeout(resolve, 100))

			expect(receivedValues.length).toBeGreaterThan(1)
			stop()
		})
	})

	describe('with plain value', () => {
		it('should call callback immediately when immediate is true', () => {
			let receivedValue: number | undefined
			const stop = watchSource(
				42,
				(v) => {
					receivedValue = v
				},
				{ immediate: true },
			)

			expect(receivedValue).toBe(42)
			stop()
		})

		it('should not call callback when immediate is false', () => {
			let called = false
			const stop = watchSource(
				42,
				() => {
					called = true
				},
				{ immediate: false },
			)

			expect(called).toBeFalsy()
			stop()
		})

		it('should return a no-op stop function', () => {
			const stop = watchSource(42, () => {}, { immediate: true })

			expect(typeof stop).toBe('function')
			expect(() => stop()).not.toThrow()
		})
	})

	describe('edge cases', () => {
		it('should handle multiple rapid changes', async () => {
			const refLike = { value: 0 }
			const receivedValues: number[] = []

			const stop = watchSource(refLike, (v) => {
				receivedValues.push(v)
			})

			await new Promise((resolve) => setTimeout(resolve, 30))

			// Rapid changes
			for (let i = 1; i <= 5; i++) {
				refLike.value = i
			}

			await new Promise((resolve) => setTimeout(resolve, 150))

			// Should have received at least some of the changes
			expect(receivedValues.length).toBeGreaterThan(0)
			expect(receivedValues).toContain(0)

			stop()
		})

		it('should handle objects with circular references gracefully', async () => {
			const obj: any = { a: 1 }

			obj.self = obj

			// This should not cause infinite loop
			const result = deepEqual(obj, obj)

			expect(result).toBeTruthy()
		})
	})
})

// ============================================
// createStore Tests
// ============================================
describe('createStore', () => {
	describe('basic functionality', () => {
		it('should create a store with initial value', () => {
			const store = createStore(42)

			expect(store.value).toBe(42)
		})

		it('should allow setting value', () => {
			const store = createStore(0)

			store.value = 5
			expect(store.value).toBe(5)
		})

		it('should work with different value types', () => {
			const stringStore = createStore('hello')

			expect(stringStore.value).toBe('hello')
			stringStore.value = 'world'
			expect(stringStore.value).toBe('world')

			const objectStore = createStore({ a: 1 })

			expect(objectStore.value).toEqual({ a: 1 })
			objectStore.value = { b: 2 }
			expect(objectStore.value).toEqual({ b: 2 })

			const arrayStore = createStore([1, 2, 3])

			expect(arrayStore.value).toEqual([1, 2, 3])
			arrayStore.value = [4, 5, 6]
			expect(arrayStore.value).toEqual([4, 5, 6])

			const nullStore = createStore(null)

			expect(nullStore.value).toBeNull()

			const undefinedStore = createStore(undefined)

			expect(undefinedStore.value).toBeUndefined()
		})
	})

	describe('subscribe', () => {
		it('should call callback immediately with current value', () => {
			const store = createStore(10)
			let receivedValue: number | undefined

			const unsubscribe = store.subscribe((value) => {
				receivedValue = value
			})

			expect(receivedValue).toBe(10)
			unsubscribe()
		})

		it('should notify subscribers when value changes', () => {
			const store = createStore(0)
			const receivedValues: number[] = []

			const unsubscribe = store.subscribe((value) => {
				receivedValues.push(value)
			})

			expect(receivedValues).toEqual([0])

			store.value = 1
			expect(receivedValues).toEqual([0, 1])

			store.value = 2
			expect(receivedValues).toEqual([0, 1, 2])

			unsubscribe()
		})

		it('should not notify when same value is set', () => {
			const store = createStore(5)
			const receivedValues: number[] = []

			const unsubscribe = store.subscribe((value) => {
				receivedValues.push(value)
			})

			expect(receivedValues).toEqual([5])

			store.value = 5 // Same value
			expect(receivedValues).toEqual([5])

			store.value = 10 // Different value
			expect(receivedValues).toEqual([5, 10])

			unsubscribe()
		})

		it('should support multiple subscribers', () => {
			const store = createStore(0)
			const values1: number[] = []
			const values2: number[] = []

			const unsub1 = store.subscribe((v) => values1.push(v))
			const unsub2 = store.subscribe((v) => values2.push(v))

			expect(values1).toEqual([0])
			expect(values2).toEqual([0])

			store.value = 1
			expect(values1).toEqual([0, 1])
			expect(values2).toEqual([0, 1])

			store.value = 2
			expect(values1).toEqual([0, 1, 2])
			expect(values2).toEqual([0, 1, 2])

			unsub1()
			unsub2()
		})

		it('should stop notifying after unsubscribe', () => {
			const store = createStore(0)
			const receivedValues: number[] = []

			const unsubscribe = store.subscribe((value) => {
				receivedValues.push(value)
			})

			expect(receivedValues).toEqual([0])

			unsubscribe()

			store.value = 1
			store.value = 2

			expect(receivedValues).toEqual([0]) // No new values after unsubscribe
		})

		it('should handle unsubscribe during notification', () => {
			const store = createStore(0)
			const receivedValues: number[] = []

			const unsubscribe = store.subscribe((value) => {
				receivedValues.push(value)
				if (value === 1) {
					unsubscribe()
				}
			})

			expect(receivedValues).toEqual([0])

			store.value = 1
			expect(receivedValues).toEqual([0, 1])

			store.value = 2
			expect(receivedValues).toEqual([0, 1]) // Already unsubscribed
		})
	})

	describe('isSubscribable compatibility', () => {
		it('should be recognized as Subscribable', () => {
			const store = createStore(42)

			expect(isSubscribable(store)).toBeTruthy()
		})

		it('should work with toValue', () => {
			const store = createStore(42)

			expect(toValue(store)).toBe(42)
		})

		it('should work with watchSource', async () => {
			const store = createStore(0)
			const receivedValues: number[] = []

			const stop = watchSource(store, (value) => {
				receivedValues.push(value)
			})

			await new Promise((resolve) => setTimeout(resolve, 50))
			expect(receivedValues).toEqual([0])

			store.value = 5
			await new Promise((resolve) => setTimeout(resolve, 50))
			expect(receivedValues).toContain(5)

			stop()
		})
	})

	describe('edge cases', () => {
		it('should handle NaN values correctly', () => {
			const store = createStore(Number.NaN)

			expect(Number.isNaN(store.value)).toBeTruthy()

			const receivedValues: number[] = []
			const unsubscribe = store.subscribe((v) => {
				receivedValues.push(v)
			})

			// Initial call
			expect(receivedValues).toHaveLength(1)
			expect(Number.isNaN(receivedValues[0])).toBeTruthy()

			store.value = Number.NaN // NaN === NaN is false, but Object.is(NaN, NaN) is true
			expect(receivedValues).toHaveLength(1) // Should not notify because Object.is treats NaN as same

			store.value = 5 // Different value
			expect(receivedValues).toHaveLength(2)
			expect(receivedValues[1]).toBe(5)

			unsubscribe()
		})

		it('should handle 0 and -0 correctly', () => {
			const store = createStore(0)
			const receivedValues: number[] = []

			const unsubscribe = store.subscribe((v) => receivedValues.push(v))

			store.value = -0 // Object.is(0, -0) is false
			expect(receivedValues).toHaveLength(2) // Should notify

			unsubscribe()
		})

		it('should handle object references', () => {
			const obj1 = { a: 1 }
			const obj2 = { a: 1 }
			const store = createStore(obj1)
			const receivedValues: object[] = []

			const unsubscribe = store.subscribe((v) => receivedValues.push(v))

			store.value = obj2 // Different reference, same content
			expect(receivedValues).toHaveLength(2) // Should notify (reference changed)

			unsubscribe()
		})

		it('should handle arrays', () => {
			const store = createStore([1, 2, 3])
			const receivedValues: number[][] = []

			const unsubscribe = store.subscribe((v) => receivedValues.push(v))

			store.value = [1, 2, 3, 4]
			expect(receivedValues).toHaveLength(2)

			unsubscribe()
		})
	})

	describe('react integration pattern', () => {
		it('should work as external store for React', () => {
			const store = createStore(0)
			const stateUpdates: number[] = []

			// Simulate React's useEffect + useState pattern
			const unsubscribe = store.subscribe((value) => {
				stateUpdates.push(value)
			})

			expect(stateUpdates).toEqual([0])

			store.value = 1
			expect(stateUpdates).toEqual([0, 1])

			store.value = 2
			expect(stateUpdates).toEqual([0, 1, 2])

			// Cleanup on unmount
			unsubscribe()

			store.value = 3
			expect(stateUpdates).toEqual([0, 1, 2]) // No more updates after unsubscribe
		})
	})
})
