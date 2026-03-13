import { waiting } from 'js-cool'
import type { Falsy, MaybeRefOrGetter, UntilToMatchOptions, WatchSource } from './types'
import { deepEqual, watchSource } from './utils'
import { UntilBase } from './UntilBase'

export class UntilValue<T, Not extends boolean = false> extends UntilBase<T> {
	constructor(r: WatchSource<T>, isNot?: boolean) {
		super(r, isNot as Not)
	}

	toBe<P extends T = T>(
		value: MaybeRefOrGetter<P>,
		options?: UntilToMatchOptions
	): Not extends true ? Promise<T> : Promise<P> {
		const { deep = false, timeout, throwOnTimeout } = options ?? {}

		// Get the target value - if it's a getter, we need to watch it too
		const getTargetValue = (): P => {
			if (typeof value === 'function') {
				return (value as () => P)()
			}
			if (value !== null && typeof value === 'object' && 'value' in value) {
				return (value as { value: P }).value
			}
			return value
		}

		// Check if target is subscribable (has subscribe method)
		const isTargetSubscribable =
			value !== null &&
			typeof value === 'object' &&
			typeof (value as { subscribe?: unknown }).subscribe === 'function'

		if (!isTargetSubscribable) {
			// Static target value - use simple toMatch
			const targetValue = getTargetValue()
			return super.toMatch(v => {
				if (deep) {
					return deepEqual(v, targetValue, deep)
				}
				return Object.is(v, targetValue)
			}, options) as Not extends true ? Promise<T> : Promise<P>
		}

		// Dynamic target value - watch both source and target
		let stop: (() => void) | null = null

		const watcher = new Promise<T>(resolve => {
			let sourceValue: T | undefined,
				targetValue: P | undefined,
				sourceReady = false,
				targetReady = false

			const checkAndResolve = () => {
				if (sourceReady && targetReady) {
					const matches = deep
						? deepEqual(sourceValue, targetValue, deep)
						: Object.is(sourceValue, targetValue)

					if (this.isNot !== matches) {
						stop?.()
						resolve(sourceValue as T)
					}
				}
			}

			// Watch source
			const stopSource = watchSource(
				this.r,
				v => {
					sourceValue = v
					sourceReady = true
					checkAndResolve()
				},
				{ immediate: true, deep }
			)

			// Watch target
			const stopTarget = watchSource(
				value as WatchSource<P>,
				v => {
					targetValue = v
					targetReady = true
					checkAndResolve()
				},
				{ immediate: true, deep }
			)

			stop = () => {
				stopSource()
				stopTarget()
			}
		})

		const promises = [watcher]
		if (timeout != null) {
			promises.push(
				waiting(timeout, throwOnTimeout).then(() => {
					stop?.()
					return this.getValue()
				})
			)
		}

		return Promise.race(promises) as Not extends true ? Promise<T> : Promise<P>
	}

	toBeTruthy(options?: UntilToMatchOptions) {
		return super.toMatch(v => Boolean(v), options) as Not extends true
			? Promise<T & Falsy>
			: Promise<Exclude<T, Falsy>>
	}

	toBeNull(options?: UntilToMatchOptions) {
		return this.toBe(null as T, options) as Not extends true
			? Promise<Exclude<T, null>>
			: Promise<null>
	}

	toBeUndefined(options?: UntilToMatchOptions) {
		return this.toBe(undefined as T, options) as Not extends true
			? Promise<Exclude<T, undefined>>
			: Promise<undefined>
	}

	toBeNaN(options?: UntilToMatchOptions): Promise<T> {
		return super.toMatch(Number.isNaN as (v: T) => boolean, options)
	}
}
