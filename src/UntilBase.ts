import type { UntilToMatchOptions, WatchSource } from './types'
import { waiting } from 'js-cool'
import { deepEqual, watchSource } from './utils'

export class UntilBase<T, Not extends boolean = false> {
	protected r: WatchSource<T>
	protected isNot: boolean = false

	constructor(r: WatchSource<T>, isNot: boolean = false) {
		this.r = r
		this.isNot = isNot ?? false
	}

	// toMatch<U extends T = T>(
	// 	condition: (v: T) => v is U,
	// 	options?: UntilToMatchOptions
	// ): Not extends true ? Promise<Exclude<T, U>> : Promise<U>

	// toMatch<U extends T = T>(
	// 	condition: (v: T) => boolean,
	// 	options?: UntilToMatchOptions
	// ): Promise<T>

	toMatch<U extends T = T>(
		condition: (v: T) => boolean,
		{ deep = false, throwOnTimeout, timeout }: UntilToMatchOptions = {},
	): Not extends true ? Promise<Exclude<T, U>> : Promise<U> {
		let stop: (() => void) | null = null

		const watcher = new Promise<T>((resolve) => {
			stop = watchSource(
				this.r,
				(v) => {
					const matches = condition(v)

					if (matches !== this.isNot) {
						stop?.()
						resolve(v)
					}
				},
				{ deep, immediate: true },
			)
		})

		const promises = [watcher]

		if (timeout != null) {
			promises.push(
				waiting(timeout, throwOnTimeout).then(() => {
					stop?.()

					return this.getValue()
				}),
			)
		}

		return Promise.race(promises) as Not extends true ? Promise<Exclude<T, U>> : Promise<U>
	}

	/**
	 * Get the current value from the watch source
	 */
	protected getValue(): T {
		if (typeof this.r === 'function') {
			return (this.r as () => T)()
		}
		if (this.r !== null && typeof this.r === 'object' && 'value' in this.r) {
			return (this.r as { value: T }).value
		}

		return this.r
	}

	changed(options?: UntilToMatchOptions) {
		return this.changedTimes(1, options)
	}

	changedTimes(n: number = 1, options?: UntilToMatchOptions) {
		let count = 0,
			previousValue: T | undefined,
			isFirst = true

		return this.toMatch((v) => {
			if (isFirst) {
				isFirst = false
				previousValue = v

				return false
			}

			const hasChanged = options?.deep
				? !deepEqual(previousValue, v, options.deep)
				: !Object.is(previousValue, v)

			if (hasChanged) {
				count += 1
				previousValue = v
			}

			return count >= n
		}, options)
	}

	get not() {
		this.isNot = !this.isNot

		return this
	}
}
