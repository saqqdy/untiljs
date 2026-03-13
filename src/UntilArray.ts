import type { ElementOf, MaybeRefOrGetter, UntilToMatchOptions, WatchSource } from './types'
import { deepEqual } from './utils'
import { UntilValue } from './UntilValue'

/**
 * Get value from MaybeRefOrGetter
 */
function getValue<T>(r: MaybeRefOrGetter<T>): T {
	if (typeof r === 'function') {
		return (r as () => T)()
	}
	if (r !== null && typeof r === 'object' && 'value' in r) {
		return (r as { value: T }).value
	}
	return r
}

/**
 * UntilArray extends UntilValue to provide both array-specific methods
 * and all the value comparison methods (toBe, toMatch, etc.)
 */
export class UntilArray<T extends unknown[], Not extends boolean = false> extends UntilValue<
	T,
	Not
> {
	constructor(r: WatchSource<T>, isNot?: boolean) {
		super(r, isNot as Not)
	}

	toContains(value: MaybeRefOrGetter<ElementOf<T>>, options?: UntilToMatchOptions) {
		return super.toMatch(v => {
			const array = Array.from(v as unknown[])
			const targetValue = getValue(value)

			// Use deep equality for object comparison
			return array.some(item => deepEqual(item, targetValue, options?.deep ?? true))
		}, options)
	}
}
