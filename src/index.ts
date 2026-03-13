import type { WatchSource } from './types'
import { toValue } from './utils'
import { UntilArray } from './UntilArray'
import { UntilValue } from './UntilValue'

function util<T extends unknown[]>(r: WatchSource<T>): UntilArray<T>
function util<T, Not extends boolean = false>(r: WatchSource<T>, isNot?: Not): UntilValue<T>
function util<T, Not extends boolean = false>(r: WatchSource<T>, isNot?: Not) {
	const value = toValue(r)
	if (Array.isArray(value)) return new UntilArray(r as WatchSource<T & unknown[]>, isNot)
	return new UntilValue<T>(r, isNot)
}

export default util

// Export types
export type * from './types'

// Export utility functions
export { toValue, isSubscribable, isRefLike, deepEqual, watchSource, createStore } from './utils'
export type { Store } from './utils'

// Export classes for advanced usage
export { UntilBase } from './UntilBase'
export { UntilValue } from './UntilValue'
export { UntilArray } from './UntilArray'
