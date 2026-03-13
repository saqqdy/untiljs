import { describe, expect, it, vi } from 'vitest'
import { deepEqual, isGetter, isRefLike, isSubscribable, toValue, watchSource } from '../src/utils'
import type { Subscribable, RefLike } from '../src/types'

// ============================================
// isSubscribable Tests
// ============================================
describe('isSubscribable', () => {
	it('should return true for valid Subscribable objects', () => {
		const subscribable: Subscribable<number> = {
			value: 1,
			subscribe: () => () => {}
		}
		expect(isSubscribable(subscribable)).toBe(true)
	})

	it('should return true for Subscribable with getter value', () => {
		let internalValue = 1
		const subscribable: Subscribable<number> = {
			get value() {
				return internalValue
			},
			subscribe: () => () => {}
		}
		expect(isSubscribable(subscribable)).toBe(true)
	})

	it('should return false for null', () => {
		expect(isSubscribable(null)).toBe(false)
	})

	it('should return false for undefined', () => {
		expect(isSubscribable(undefined)).toBe(false)
	})

	it('should return false for plain objects without subscribe', () => {
		expect(isSubscribable({ value: 1 })).toBe(false)
	})

	it('should return false for objects with subscribe that is not a function', () => {
		expect(isSubscribable({ value: 1, subscribe: 'not a function' })).toBe(false)
		expect(isSubscribable({ value: 1, subscribe: null })).toBe(false)
		expect(isSubscribable({ value: 1, subscribe: 123 })).toBe(false)
	})

	it('should return false for functions', () => {
		expect(isSubscribable(() => 1)).toBe(false)
	})

	it('should return false for primitives', () => {
		expect(isSubscribable(1)).toBe(false)
		expect(isSubscribable('string')).toBe(false)
		expect(isSubscribable(true)).toBe(false)
		expect(isSubscribable(Symbol('test'))).toBe(false)
	})

	it('should return false for arrays', () => {
		expect(isSubscribable([1, 2, 3])).toBe(false)
	})

	it('should return true for Subscribable with various value types', () => {
		expect(isSubscribable({ value: null, subscribe: () => () => {} })).toBe(true)
		expect(isSubscribable({ value: undefined, subscribe: () => () => {} })).toBe(true)
		expect(isSubscribable({ value: { nested: true }, subscribe: () => () => {} })).toBe(true)
		expect(isSubscribable({ value: [1, 2, 3], subscribe: () => () => {} })).toBe(true)
	})
})

// ============================================
// isRefLike Tests
// ============================================
describe('isRefLike', () => {
	it('should return true for objects with value property', () => {
		expect(isRefLike({ value: 1 })).toBe(true)
		expect(isRefLike({ value: 'test' })).toBe(true)
		expect(isRefLike({ value: null })).toBe(true)
		expect(isRefLike({ value: undefined })).toBe(true)
		expect(isRefLike({ value: { nested: true } })).toBe(true)
		expect(isRefLike({ value: [1, 2, 3] })).toBe(true)
	})

	it('should return true for objects with extra properties', () => {
		expect(isRefLike({ value: 1, foo: 'bar' })).toBe(true)
		expect(isRefLike({ value: 1, __v_isRef: true })).toBe(true)
	})

	it('should return false for Subscribable objects', () => {
		const subscribable: Subscribable<number> = {
			value: 1,
			subscribe: () => () => {}
		}
		expect(isRefLike(subscribable)).toBe(false)
	})

	it('should return false for null', () => {
		expect(isRefLike(null)).toBe(false)
	})

	it('should return false for undefined', () => {
		expect(isRefLike(undefined)).toBe(false)
	})

	it('should return false for functions', () => {
		expect(isRefLike(() => 1)).toBe(false)
	})

	it('should return false for primitives', () => {
		expect(isRefLike(1)).toBe(false)
		expect(isRefLike('string')).toBe(false)
		expect(isRefLike(true)).toBe(false)
		expect(isRefLike(Symbol('test'))).toBe(false)
	})

	it('should return false for objects without value property', () => {
		expect(isRefLike({ foo: 'bar' })).toBe(false)
		expect(isRefLike({})).toBe(false)
	})

	it('should return false for arrays', () => {
		expect(isRefLike([1, 2, 3])).toBe(false)
		expect(isRefLike([])).toBe(false)
	})

	it('should return true for getter-based value', () => {
		let internalValue = 1
		const refLike = {
			get value() {
				return internalValue
			}
		}
		expect(isRefLike(refLike)).toBe(true)
	})
})

// ============================================
// isGetter Tests
// ============================================
describe('isGetter', () => {
	it('should return true for functions', () => {
		expect(isGetter(() => 1)).toBe(true)
		expect(isGetter(() => 'test')).toBe(true)
		expect(
			isGetter(function () {
				return 1
			})
		).toBe(true)
		expect(isGetter(async () => 1)).toBe(true)
		expect(
			isGetter(function* () {
				yield 1
			})
		).toBe(true)
	})

	it('should return false for non-functions', () => {
		expect(isGetter(1)).toBe(false)
		expect(isGetter('string')).toBe(false)
		expect(isGetter(null)).toBe(false)
		expect(isGetter(undefined)).toBe(false)
		expect(isGetter({})).toBe(false)
		expect(isGetter([])).toBe(false)
		expect(isGetter(true)).toBe(false)
	})
})

// ============================================
// toValue Tests
// ============================================
describe('toValue', () => {
	describe('Subscribable', () => {
		it('should extract value from Subscribable', () => {
			const subscribable: Subscribable<number> = {
				value: 42,
				subscribe: () => () => {}
			}
			expect(toValue(subscribable)).toBe(42)
		})

		it('should extract value from Subscribable with getter', () => {
			let internalValue = 'test'
			const subscribable: Subscribable<string> = {
				get value() {
					return internalValue
				},
				subscribe: () => () => {}
			}
			expect(toValue(subscribable)).toBe('test')
		})
	})

	describe('RefLike', () => {
		it('should extract value from RefLike object', () => {
			expect(toValue({ value: 123 })).toBe(123)
			expect(toValue({ value: 'test' })).toBe('test')
			expect(toValue({ value: null })).toBe(null)
			expect(toValue({ value: undefined })).toBe(undefined)
		})

		it('should extract complex values from RefLike', () => {
			const obj = { a: 1, b: 2 }
			const arr = [1, 2, 3]
			expect(toValue({ value: obj })).toBe(obj)
			expect(toValue({ value: arr })).toBe(arr)
		})

		it('should extract value from RefLike with extra properties', () => {
			expect(toValue({ value: 1, foo: 'bar', __v_isRef: true })).toBe(1)
		})

		it('should extract value from RefLike with getter', () => {
			let internalValue = 'dynamic'
			const refLike = {
				get value() {
					return internalValue
				}
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
			expect(toValue(null)).toBe(null)
			expect(toValue(undefined)).toBe(undefined)
			expect(toValue(true)).toBe(true)
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
			expect(toValue(false)).toBe(false)
		})

		it('should return NaN as-is', () => {
			expect(toValue(NaN)).toBeNaN()
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
				value: 42,
				subscribe: () => () => {}
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
				value: 10,
				getValue: function () {
					return this.value
				}
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
			expect(deepEqual(1, 1)).toBe(true)
			expect(deepEqual('string', 'string')).toBe(true)
			expect(deepEqual(true, true)).toBe(true)
			expect(deepEqual(false, false)).toBe(true)
			expect(deepEqual(null, null)).toBe(true)
			expect(deepEqual(undefined, undefined)).toBe(true)
		})

		it('should return true for NaN values', () => {
			expect(deepEqual(NaN, NaN)).toBe(true)
		})

		it('should return true for Object.is special cases', () => {
			expect(deepEqual(0, 0)).toBe(true)
			expect(deepEqual(-0, -0)).toBe(true)
			// Note: Object.is(0, -0) is false, but this is edge case
		})

		it('should return false for different primitives', () => {
			expect(deepEqual(1, 2)).toBe(false)
			expect(deepEqual('a', 'b')).toBe(false)
			expect(deepEqual(true, false)).toBe(false)
			expect(deepEqual(1, '1')).toBe(false)
			expect(deepEqual(null, undefined)).toBe(false)
			expect(deepEqual(0, '')).toBe(false)
		})

		it('should return false for primitive vs object', () => {
			expect(deepEqual(1, { value: 1 })).toBe(false)
			expect(deepEqual('test', new String('test'))).toBe(false)
		})
	})

	describe('object comparison', () => {
		it('should return true for identical object references', () => {
			const obj = { a: 1 }
			expect(deepEqual(obj, obj)).toBe(true)
		})

		it('should return true for deeply equal objects', () => {
			expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
			expect(deepEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(true)
		})

		it('should return true for empty objects', () => {
			expect(deepEqual({}, {})).toBe(true)
		})

		it('should return false for different objects', () => {
			expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false)
			expect(deepEqual({ a: 1 }, { b: 1 })).toBe(false)
			expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false)
			expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
		})

		it('should return false for object vs null', () => {
			expect(deepEqual({ a: 1 }, null)).toBe(false)
			expect(deepEqual(null, { a: 1 })).toBe(false)
		})

		it('should return false for object vs undefined', () => {
			expect(deepEqual({ a: 1 }, undefined)).toBe(false)
			expect(deepEqual(undefined, { a: 1 })).toBe(false)
		})

		it('should handle objects with various key types', () => {
			const sym = Symbol('key')
			expect(deepEqual({ [sym]: 1 }, { [sym]: 1 })).toBe(true)
		})

		it('should handle objects with same keys but different values', () => {
			expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false)
		})

		it('should handle objects with same values but different key order', () => {
			expect(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true)
		})
	})

	describe('array comparison', () => {
		it('should return true for identical arrays', () => {
			expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true)
			expect(deepEqual([], [])).toBe(true)
		})

		it('should return true for deeply equal nested arrays', () => {
			expect(deepEqual([[1, 2], [3]], [[1, 2], [3]])).toBe(true)
			expect(deepEqual([[[[1]]]], [[[[1]]]])).toBe(true)
		})

		it('should return false for different arrays', () => {
			expect(deepEqual([1, 2], [1, 2, 3])).toBe(false)
			expect(deepEqual([1, 2], [2, 1])).toBe(false)
			expect(deepEqual([1], [2])).toBe(false)
		})

		it('should return false for array vs object', () => {
			expect(deepEqual([1, 2], { 0: 1, 1: 2 })).toBe(false)
			expect(deepEqual({ 0: 1, 1: 2 }, [1, 2])).toBe(false)
		})

		it('should handle arrays with mixed types', () => {
			expect(deepEqual([1, 'a', null], [1, 'a', null])).toBe(true)
			expect(deepEqual([1, { a: 1 }], [1, { a: 1 }])).toBe(true)
		})
	})

	describe('mixed object/array comparison', () => {
		it('should compare objects containing arrays', () => {
			expect(deepEqual({ arr: [1, 2] }, { arr: [1, 2] })).toBe(true)
			expect(deepEqual({ arr: [1, 2] }, { arr: [1, 3] })).toBe(false)
		})

		it('should compare arrays containing objects', () => {
			expect(deepEqual([{ a: 1 }], [{ a: 1 }])).toBe(true)
			expect(deepEqual([{ a: 1 }], [{ a: 2 }])).toBe(false)
		})
	})

	describe('depth limiting', () => {
		it('should compare with unlimited depth when true', () => {
			const obj1 = { a: { b: { c: { d: 1 } } } }
			const obj2 = { a: { b: { c: { d: 1 } } } }
			const obj3 = { a: { b: { c: { d: 2 } } } }

			expect(deepEqual(obj1, obj2, true)).toBe(true)
			expect(deepEqual(obj1, obj3, true)).toBe(false)
		})

		it('should return false when depth is 0', () => {
			expect(deepEqual({ a: 1 }, { a: 1 }, 0)).toBe(false)
			expect(deepEqual([1], [1], 0)).toBe(false)
		})

		it('should compare with specific depth', () => {
			// Depth 1: can compare keys at first level
			expect(deepEqual({ a: 1 }, { a: 1 }, 1)).toBe(true)
			expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } }, 1)).toBe(false) // nested requires more depth
		})

		it('should handle depth with arrays', () => {
			expect(deepEqual([1, 2], [1, 2], 1)).toBe(true)
			expect(deepEqual([[1]], [[1]], 1)).toBe(false) // nested requires more depth
		})
	})

	describe('special objects', () => {
		it('should handle Date objects', () => {
			const date1 = new Date('2024-01-01')
			const date2 = new Date('2024-01-01')
			const date3 = new Date('2024-01-02')

			// Date objects are compared by their internal time value
			expect(deepEqual(date1, date2)).toBe(true) // Same time value
			expect(deepEqual(date1, date3)).toBe(false) // Different time values
			expect(deepEqual(date1, date1)).toBe(true) // Same reference
		})

		it('should handle RegExp objects', () => {
			const regex1 = /test/g
			const regex2 = /test/g

			expect(deepEqual(regex1, regex1)).toBe(true)
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
				get value() {
					return currentValue
				},
				subscribe: callback => {
					callback(currentValue)
					return () => {}
				}
			}

			const stop = watchSource(
				subscribable,
				value => {
					receivedValue = value
				},
				{ immediate: true }
			)

			expect(receivedValue).toBe(1)
			stop()
		})

		it('should not call callback immediately when immediate is false', async () => {
			const currentValue = 1
			let callCount = 0

			const subscribable: Subscribable<number> = {
				get value() {
					return currentValue
				},
				subscribe: () => () => {}
			}

			const stop = watchSource(
				subscribable,
				() => {
					callCount++
				},
				{ immediate: false }
			)

			expect(callCount).toBe(0)
			stop()
		})

		it('should call callback when value changes via subscription', async () => {
			let currentValue = 1
			const callbacks: ((value: number) => void)[] = []

			const subscribable: Subscribable<number> = {
				get value() {
					return currentValue
				},
				subscribe: callback => {
					callbacks.push(callback)
					callback(currentValue)
					return () => {}
				}
			}

			const receivedValues: number[] = []
			const stop = watchSource(subscribable, value => {
				receivedValues.push(value)
			})

			expect(receivedValues).toEqual([1])

			currentValue = 2
			callbacks.forEach(cb => cb(2))

			expect(receivedValues).toEqual([1, 2])
			stop()
		})

		it('should not trigger for same value', async () => {
			let currentValue = 1
			const callbacks: ((value: number) => void)[] = []

			const subscribable: Subscribable<number> = {
				get value() {
					return currentValue
				},
				subscribe: callback => {
					callbacks.push(callback)
					callback(currentValue)
					return () => {}
				}
			}

			const receivedValues: number[] = []
			const stop = watchSource(subscribable, value => {
				receivedValues.push(value)
			})

			expect(receivedValues).toEqual([1])

			// Same value - should not trigger
			callbacks.forEach(cb => cb(1))
			expect(receivedValues).toEqual([1])

			// Different value - should trigger
			currentValue = 2
			callbacks.forEach(cb => cb(2))
			expect(receivedValues).toEqual([1, 2])

			stop()
		})

		it('should work with deep option for Subscribable', async () => {
			let currentValue = { a: { b: 1 } }
			const callbacks: ((value: typeof currentValue) => void)[] = []

			const subscribable: Subscribable<typeof currentValue> = {
				get value() {
					return currentValue
				},
				subscribe: callback => {
					callbacks.push(callback)
					callback(currentValue)
					return () => {}
				}
			}

			const receivedValues: object[] = []
			const stop = watchSource(
				subscribable,
				value => {
					receivedValues.push(value)
				},
				{ deep: true }
			)

			expect(receivedValues.length).toBe(1)

			// Different reference, same content - should not trigger with deep
			currentValue = { a: { b: 1 } }
			callbacks.forEach(cb => cb(currentValue))
			expect(receivedValues.length).toBe(1) // Same content, no trigger

			// Different content
			currentValue = { a: { b: 2 } }
			callbacks.forEach(cb => cb(currentValue))
			expect(receivedValues.length).toBe(2)

			stop()
		})

		it('should return unsubscribe function', async () => {
			const subscribable: Subscribable<number> = {
				value: 1,
				subscribe: () => () => {}
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
				v => {
					receivedValue = v
				},
				{ immediate: true }
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
				{ immediate: false }
			)

			expect(callCount).toBe(0)
			stop()
		})

		it('should detect value changes in RefLike', async () => {
			const refLike = { value: 1 }
			const receivedValues: number[] = []

			const stop = watchSource(refLike, v => {
				receivedValues.push(v)
			})

			await new Promise(resolve => setTimeout(resolve, 50))
			expect(receivedValues).toEqual([1])

			refLike.value = 2
			await new Promise(resolve => setTimeout(resolve, 100))
			expect(receivedValues).toContain(2)

			stop()
		})

		it('should work with deep option for RefLike', async () => {
			const refLike = { value: { a: { b: 1 } } }
			const receivedValues: object[] = []

			const stop = watchSource(
				refLike,
				v => {
					receivedValues.push(v)
				},
				{ deep: true, immediate: true }
			)

			await new Promise(resolve => setTimeout(resolve, 50))

			refLike.value = { a: { b: 2 } }
			await new Promise(resolve => setTimeout(resolve, 100))

			expect(receivedValues.length).toBeGreaterThan(1)
			stop()
		})

		it('should handle null and undefined values', async () => {
			const refLike = { value: null as any }
			const receivedValues: any[] = []

			const stop = watchSource(refLike, v => {
				receivedValues.push(v)
			})

			await new Promise(resolve => setTimeout(resolve, 50))

			refLike.value = undefined
			await new Promise(resolve => setTimeout(resolve, 100))

			refLike.value = 'test'
			await new Promise(resolve => setTimeout(resolve, 100))

			expect(receivedValues).toContain(null)
			expect(receivedValues).toContain(undefined)
			expect(receivedValues).toContain('test')

			stop()
		})

		it('should stop watching after stop() is called', async () => {
			const refLike = { value: 1 }
			const receivedValues: number[] = []

			const stop = watchSource(refLike, v => {
				receivedValues.push(v)
			})

			await new Promise(resolve => setTimeout(resolve, 50))
			expect(receivedValues).toEqual([1])

			stop()

			refLike.value = 2
			await new Promise(resolve => setTimeout(resolve, 100))

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
				v => {
					receivedValue = v
				},
				{ immediate: true }
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
				{ immediate: false }
			)

			expect(callCount).toBe(0)
			stop()
		})

		it('should detect value changes', async () => {
			let value = 1
			const receivedValues: number[] = []

			const stop = watchSource(
				() => value,
				v => {
					receivedValues.push(v)
				}
			)

			await new Promise(resolve => setTimeout(resolve, 50))
			expect(receivedValues).toEqual([1])

			value = 2
			await new Promise(resolve => setTimeout(resolve, 100))
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
				v => {
					receivedValues.push(v)
				}
			)

			await new Promise(resolve => setTimeout(resolve, 50))
			expect(receivedValues).toEqual([]) // No calls due to errors

			shouldThrow = false
			await new Promise(resolve => setTimeout(resolve, 100))
			expect(receivedValues).toContain('ready')

			stop()
		})

		it('should work with deep option for getter', async () => {
			let value = { a: { b: 1 } }
			const receivedValues: object[] = []

			const stop = watchSource(
				() => value,
				v => {
					receivedValues.push(v)
				},
				{ deep: true, immediate: true }
			)

			await new Promise(resolve => setTimeout(resolve, 50))

			value = { a: { b: 2 } }
			await new Promise(resolve => setTimeout(resolve, 100))

			expect(receivedValues.length).toBeGreaterThan(1)
			stop()
		})
	})

	describe('with plain value', () => {
		it('should call callback immediately when immediate is true', () => {
			let receivedValue: number | undefined
			const stop = watchSource(
				42,
				v => {
					receivedValue = v
				},
				{ immediate: true }
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
				{ immediate: false }
			)

			expect(called).toBe(false)
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

			const stop = watchSource(refLike, v => {
				receivedValues.push(v)
			})

			await new Promise(resolve => setTimeout(resolve, 30))

			// Rapid changes
			for (let i = 1; i <= 5; i++) {
				refLike.value = i
			}

			await new Promise(resolve => setTimeout(resolve, 150))

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
			expect(result).toBe(true)
		})
	})
})
