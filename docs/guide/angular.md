# Angular Integration

Angular 19+ signals work seamlessly with UntilJS using getter functions.

## Basic Usage with Signals

```typescript
import { Component, signal } from '@angular/core'
import until from 'untiljs'

@Component({
  selector: 'app-example',
  template: `
    <p>Count: {{ count() }}</p>
    <button (click)="waitForValue()">Wait for 5</button>
  `
})
export class ExampleComponent {
  count = signal(0)

  async waitForValue() {
    this.count.set(0)
    setTimeout(() => this.count.set(5), 1000)

    // Use getter function with signals
    await until(() => this.count()).toBe(5)
    console.log('Count reached 5!')
  }
}
```

## Using createStore

For more complex scenarios, use the built-in `createStore`:

```typescript
import { Component } from '@angular/core'
import { createStore } from 'untiljs'
import until from 'untiljs'

@Component({
  selector: 'app-example',
  template: `
    <p>Value: {{ value }}</p>
    <button (click)="test()">Test</button>
  `
})
export class ExampleComponent {
  private store = createStore(0)
  value = this.store.value

  async test() {
    this.store.value = 0
    setTimeout(() => this.store.value = 5, 1000)

    // Store works directly with until
    await until(this.store).toBe(5)

    // Update local value for template
    this.value = this.store.value
  }
}
```

## Service Example

Create a service for shared state:

```typescript
import { Injectable } from '@angular/core'
import { createStore } from 'untiljs'
import until from 'untiljs'

@Injectable({ providedIn: 'root' })
export class DataService {
  private loadingStore = createStore(false)
  private dataStore = createStore<string | null>(null)

  get loading() { return this.loadingStore.value }
  get data() { return this.dataStore.value }

  subscribe(callback: () => void) {
    const unsub1 = this.loadingStore.subscribe(() => callback())
    const unsub2 = this.dataStore.subscribe(() => callback())
    return () => {
      unsub1()
      unsub2()
    }
  }

  async fetchData() {
    this.loadingStore.value = true

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    this.dataStore.value = 'Hello World'
    this.loadingStore.value = false
  }

  async waitForData() {
    await until(this.dataStore).toBeTruthy()
    return this.data
  }
}
```

## RxJS Integration

Convert RxJS observables to work with UntilJS:

```typescript
import { BehaviorSubject } from 'rxjs'
import until from 'untiljs'

// Convert BehaviorSubject to Subscribable
const subject = new BehaviorSubject(1)

const subscribable = {
  get value() {
    return subject.value
  },
  subscribe(callback: (value: number) => void) {
    const subscription = subject.subscribe(callback)
    return () => subscription.unsubscribe()
  }
}

await until(subscribable).toBe(2)

// Or use getter function
await until(() => subject.value).toBe(2)
```
