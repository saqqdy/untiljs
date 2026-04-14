# React Integration

Due to React's closure behavior, using `until(() => stateValue)` directly won't work properly. UntilJS provides solutions for this.

## The Problem

React's closure behavior means getter functions capture old values:

```tsx
// ❌ This won't work
const [value, setValue] = useState(0)
await until(() => value).toBe(5) // Always sees old value
```

## Solution 1: useUntil Hook

Create a custom hook that wraps the state in a ref:

```tsx
import { useCallback, useRef, useState } from 'react'
import until from 'untiljs'

function useUntil<T>(initialValue: T) {
  const ref = useRef(initialValue)
  const [value, setValue] = useState(initialValue)

  const refLike = useRef({
    get value() {
      return ref.current
    },
    set value(newValue: T) {
      ref.current = newValue
      setValue(newValue)
    }
  })

  const setValueAndRef = useCallback((newValue: T) => {
    ref.current = newValue
    setValue(newValue)
  }, [])

  return {
    value,
    setValue: setValueAndRef,
    until: () => until(refLike.current)
  }
}

// Usage
function MyComponent() {
  const data = useUntil(0)

  const handleClick = async () => {
    data.setValue(0)
    setTimeout(() => data.setValue(5), 1000)
    await data.until().toBe(5) // ✅ Works!
    console.log('Value is now 5!')
  }

  return <button onClick={handleClick}>Test</button>
}
```

## Solution 2: createStore (Recommended)

UntilJS v2.1+ provides a built-in `createStore` function:

```tsx
import { createStore } from 'untiljs'
import until from 'untiljs'

// Create store outside component or in useRef
const store = createStore(0)

function MyComponent() {
  const [value, setValue] = useState(store.value)

  useEffect(() => store.subscribe(setValue), [])

  const handleClick = async () => {
    store.value = 5
    await until(store).toBe(5) // ✅ Clean and efficient!
  }

  return <button onClick={handleClick}>Test</button>
}
```

## Solution 3: Subscribable Store

Create a custom subscribable store:

```tsx
function createSubscribable<T>(initialValue: T) {
  let value = initialValue
  const listeners = new Set<(value: T) => void>()

  return {
    get value() {
      return value
    },
    set value(newValue: T) {
      value = newValue
      listeners.forEach(l => l(value))
    },
    subscribe(callback: (value: T) => void) {
      listeners.add(callback)
      callback(value)
      return () => listeners.delete(callback)
    }
  }
}

// Usage
const store = createSubscribable(0)
await until(store).toBe(5) // ✅ Most efficient!
```

## Full Example with createStore

```tsx
import { useEffect, useState } from 'react'
import until, { createStore } from 'untiljs'

// Create store for async data
const dataStore = createStore<string | null>(null)
const loadingStore = createStore(false)

function AsyncComponent() {
  const [data, setData] = useState(dataStore.value)
  const [loading, setLoading] = useState(loadingStore.value)

  useEffect(() => {
    const unsub1 = dataStore.subscribe(setData)
    const unsub2 = loadingStore.subscribe(setLoading)
    return () => {
      unsub1()
      unsub2()
    }
  }, [])

  const fetchData = async () => {
    loadingStore.value = true

    // Simulate API call
    setTimeout(() => {
      dataStore.value = 'Hello World'
      loadingStore.value = false
    }, 1000)

    await until(loadingStore).toBe(false)
    console.log('Data loaded:', dataStore.value)
  }

  return (
    <div>
      {loading ? <p>Loading...</p> : <p>Data: {data}</p>}
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  )
}
```
