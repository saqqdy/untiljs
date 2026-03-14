/**
 * Void function
 */
export type Fn = () => void

/**
 * Any function
 */
export type AnyFn = (...args: any[]) => any

/**
 * Subscribable interface - represents a reactive data source
 * that can be subscribed to for changes.
 *
 * Compatible with Vue's ref (via adapter), RxJS BehaviorSubject, etc.
 */
export interface Subscribable<T> {
	/**
	 * Subscribe to value changes
	 * @param callback Function to call when value changes
	 * @returns Unsubscribe function
	 */
	subscribe: (callback: (value: T) => void) => () => void
	/**
	 * The current value
	 */
	readonly value: T
}

/**
 * Ref-like object with a value property (e.g., Vue ref, custom reactive objects)
 */
export interface RefLike<T> {
	value: T
}

/**
 * Watch source - can be a Subscribable, RefLike, getter function, or plain value
 */
export type WatchSource<T> = Subscribable<T> | RefLike<T> | (() => T) | T

/**
 * Options for until toMatch operations
 */
export interface UntilToMatchOptions {
	/**
	 * Deep comparison option
	 * - true: deep compare objects/arrays
	 * - number: deep compare up to specified depth
	 * - false: shallow comparison (default)
	 *
	 * @default false
	 */
	deep?: boolean | number

	/**
	 * Reject the promise when timeout
	 *
	 * @default false
	 */
	throwOnTimeout?: boolean

	/**
	 * Milliseconds timeout for promise to resolve/reject if the when condition does not meet.
	 * 0 for never timed out
	 */
	timeout?: number
}

export declare type Falsy = false | void | null | undefined | 0 | 0n | ''

/**
 * Infers the element type of an array
 */
export type ElementOf<T> = T extends (infer E)[] ? E : never

/**
 * Maybe it's a ref-like object with a value property, or a plain value
 */
export type MaybeRef<T> = T | { value: T }

/**
 * Maybe it's a ref-like object, a getter function, or a plain value
 */
export type MaybeRefOrGetter<T> = MaybeRef<T> | (() => T)
