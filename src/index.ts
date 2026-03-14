import type { WatchSource } from './types'
import { UntilArray } from './UntilArray'
import { UntilValue } from './UntilValue'
import { toValue } from './utils'

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

export { UntilArray } from './UntilArray'
// Export classes for advanced usage
export { UntilBase } from './UntilBase'

export { UntilValue } from './UntilValue'
// Export utility functions
export { createStore, deepEqual, isRefLike, isSubscribable, toValue, watchSource } from './utils'
export type { Store } from './utils'
