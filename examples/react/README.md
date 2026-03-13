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
    await until(() => value).toBe(5) // Won't detect the change
  }

  return <button onClick={testToBe}>Test</button>
}
```

### ✅ Recommended: Built-in `createStore`

untiljs v2.1+ provides a built-in `createStore` function for React:

```jsx
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

### ✅ Alternative: useUntil Hook

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

  const setValueAndRef = useCallback(newValue => {
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
    await data.until().toBe(5) // ✅ Works correctly!
  }

  return <button onClick={testToBe}>Test</button>
}
```

## Examples Included

- **createStore (Built-in)**: Recommended approach for React
- **Basic Usage**: `toBe`, `toMatch`, `toBeTruthy`, `toBeNull`, `toBeUndefined`, `toBeNaN`
- **Change Detection**: `changed`, `changedTimes`
- **Not Modifier**: `not.toBe`, `not.toBeNull`
- **Timeout Options**: with and without `throwOnTimeout`
- **Deep Comparison**: object and array deep comparison
- **Array Methods**: `toContains`
- **Async Data Loading**: waiting for async operations
- **Race Conditions**: using `Promise.race`

## Why This Matters

React's `useState` returns a value that's captured in closures. When `until` polls the getter function, it always sees the old captured value, not the current state. Using `createStore` or `useUntil` bypasses this issue because:

1. `createStore` provides a Subscribable object that notifies listeners when values change
2. `useRef` returns a mutable object that persists across renders
3. The getter function reads from the ref's current property, which always has the latest value
