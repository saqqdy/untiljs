# Vanilla JavaScript

UntilJS works in any JavaScript environment without frameworks.

## Basic Usage

```javascript
import until from 'untiljs'

let value = 0
setTimeout(() => { value = 5 }, 1000)

await until(() => value).toBe(5)
console.log('Value is now 5!')
```

## DOM Elements

Wait for DOM element to appear:

```javascript
import until from 'untiljs'

// Wait for element to exist
await until(() => document.getElementById('my-element')).toBeTruthy()

const element = document.getElementById('my-element')
console.log('Element found:', element)
```

## Custom Events

Wait for custom events:

```javascript
import until from 'untiljs'

let eventFired = false

document.addEventListener('my-custom-event', () => {
  eventFired = true
})

// Trigger event after 1 second
setTimeout(() => {
  document.dispatchEvent(new CustomEvent('my-custom-event'))
}, 1000)

await until(() => eventFired).toBe(true)
console.log('Event fired!')
```

## User Interactions

Wait for user actions:

```javascript
import until from 'untiljs'

let buttonClicked = false

document.getElementById('my-button').addEventListener('click', () => {
  buttonClicked = true
})

await until(() => buttonClicked).toBe(true, { timeout: 30000 })
console.log('Button was clicked!')
```

## Async Data Loading

```javascript
import until from 'untiljs'

let data = null

fetch('/api/data')
  .then(res => res.json())
  .then(json => { data = json })

await until(() => data).toBeTruthy()
console.log('Data loaded:', data)
```

## Web Workers

```javascript
import until from 'untiljs'

const worker = new Worker('worker.js')
let result = null

worker.onmessage = (e) => {
  result = e.data
}

worker.postMessage({ task: 'process' })

await until(() => result).toBeTruthy()
console.log('Worker result:', result)
worker.terminate()
```

## Animation Completion

```javascript
import until from 'untiljs'

const element = document.getElementById('animated')
let animationComplete = false

element.addEventListener('animationend', () => {
  animationComplete = true
})

element.classList.add('animate')

await until(() => animationComplete).toBe(true)
console.log('Animation complete!')
```

## Intersection Observer

```javascript
import until from 'untiljs'

const element = document.getElementById('observe-me')
let isVisible = false

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      isVisible = true
    }
  })
})

observer.observe(element)

await until(() => isVisible).toBe(true)
console.log('Element is visible!')
observer.disconnect()
```

## CDN Usage

Use directly in HTML without a build step:

```html
<!DOCTYPE html>
<html>
<head>
  <title>UntilJS Example</title>
</head>
<body>
  <div id="result">Loading...</div>

  <script src="https://unpkg.com/untiljs@latest/dist/index.iife.min.js"></script>
  <script>
    async function main() {
      let value = 0

      setTimeout(() => {
        value = 5
        document.getElementById('result').textContent = 'Value is now 5!'
      }, 1000)

      await until(() => value).toBe(5)
      console.log('Done!')
    }

    main()
  </script>
</body>
</html>
```

## Creating Subscribable Objects

For better performance in vanilla JS, create subscribable objects:

```javascript
import until, { createStore } from 'untiljs'

// Using createStore
const store = createStore(0)

// Subscribe to changes
store.subscribe(value => {
  console.log('Value changed:', value)
})

// Update value
store.value = 5

// Wait for value
await until(store).toBe(5)

// Manual subscribable
const manualStore = {
  _value: 0,
  _listeners: new Set(),

  get value() {
    return this._value
  },

  set value(newValue) {
    this._value = newValue
    this._listeners.forEach(l => l(newValue))
  },

  subscribe(callback) {
    this._listeners.add(callback)
    callback(this._value)
    return () => this._listeners.delete(callback)
  }
}
```
