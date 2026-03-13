# untiljs React Examples

This example demonstrates how to use untiljs with React properly.

## Running the Example

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Important: React Closure Issue

In React, using `useState` with getter functions like `until(() => stateValue)` has a closure problem. The getter captures the old value from when the function was created, not the current state value.

### ❌ Wrong Way (Won't Work Properly)

```jsx
function MyComponent() {
  const [value, setValue] = useState(0)

  const testToBe = async () => {
    setValue(0)
    setTimeout(() => setValue(5), 1000)
    // ❌ This captures the OLD value due to closure!
    await until(() => value).toBe(5)  // Won't detect the change
  }

  return <button onClick={testToBe}>Test</button>
}
```

### ✅ Correct Way 1: useUntil Hook

Use the custom `useUntil` hook that creates a RefLike object:

```jsx
function useUntil(initialValue) {
  const ref = useRef(initialValue)
  const [value, setValue] = useState(initialValue)

  const refLike = useRef({
    get value() {
      return ref.current
    },
    set value(newValue) {
      ref.current = newValue
      setValue(newValue)
    }
  })

  const setValueAndRef = useCallback((newValue) => {
    ref.current = newValue
    setValue(newValue)
  }, [])

  return {
    value,
    setValue: setValueAndRef,
    ref: refLike.current,
    until: () => until(refLike.current)
  }
}

// Usage
function MyComponent() {
  const data = useUntil(0)

  const testToBe = async () => {
    data.setValue(0)
    setTimeout(() => data.setValue(5), 1000)
    await data.until().toBe(5)  // ✅ Works correctly!
  }

  return <button onClick={testToBe}>Test</button>
}
```

### ✅ Correct Way 2: useRef with RefLike

Use `useRef` to create a RefLike object:

```jsx
function MyComponent() {
  const dataRef = useRef({ value: null })
  const [data, setData] = useState(null)

  const refLike = {
    get value() {
      return dataRef.current.value
    }
  }

  const loadData = async () => {
    // Simulate async operation
    setTimeout(() => {
      dataRef.current.value = { name: 'John' }
      setData(dataRef.current.value)
    }, 1000)

    await until(refLike).toBeTruthy()  // ✅ Works correctly!
  }

  return <button onClick={loadData}>Load Data</button>
}
```

### ✅ Correct Way 3: Subscribable Store

For more efficient watching, create a custom Subscribable store:

```jsx
function createSubscribableStore(initialValue) {
  let value = initialValue
  const listeners = new Set()

  return {
    get value() {
      return value
    },
    set value(newValue) {
      value = newValue
      listeners.forEach(cb => cb(value))
    },
    subscribe(callback) {
      listeners.add(callback)
      callback(value)
      return () => listeners.delete(callback)
    }
  }
}

// Usage with useEffect
function MyComponent() {
  const storeRef = useRef(null)
  if (!storeRef.current) {
    storeRef.current = createSubscribableStore(0)
  }
  const store = storeRef.current

  const [storeValue, setStoreValue] = useState(store.value)

  useEffect(() => {
    return store.subscribe(value => setStoreValue(value))
  }, [store])

  const testToBe = async () => {
    store.value = 0
    setTimeout(() => { store.value = 5 }, 1000)
    await until(store).toBe(5)  // ✅ Most efficient!
  }

  return <button onClick={testToBe}>Test</button>
}
```

## Examples Included

- **Basic Usage**: `toBe`, `toMatch`, `toBeTruthy`, `toBeNull`, `toBeUndefined`, `toBeNaN`
- **Change Detection**: `changed`, `changedTimes`
- **Not Modifier**: `not.toBe`, `not.toBeNull`
- **Timeout Options**: with and without `throwOnTimeout`
- **Deep Comparison**: object and array deep comparison
- **Array Methods**: `toContains`
- **Custom Subscribable Store**: efficient watching pattern
- **Async Data Loading**: waiting for async operations
- **Race Conditions**: using `Promise.race`

## Why This Matters

React's `useState` returns a value that's captured in closures. When `until` polls the getter function, it always sees the old captured value, not the current state. Using `useRef` or a Subscribable store bypasses this issue because:

1. `useRef` returns a mutable object that persists across renders
2. The getter function reads from the ref's current property, which always has the latest value
3. Subscribable stores notify listeners when values change, making watching more efficient
