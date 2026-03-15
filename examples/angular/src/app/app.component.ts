import { CommonModule } from '@angular/common'
import { Component, signal } from '@angular/core'
import until from 'untiljs'

@Component({
  imports: [CommonModule],
  selector: 'app-root',
  standalone: true,
  styles: `
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    h1 { color: #dd0031; border-bottom: 2px solid #dd0031; padding-bottom: 10px; }
    h2 { color: #333; margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
    .description { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .description code { background: #e9ecef; padding: 2px 6px; border-radius: 4px; }
    .examples-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .example-card { border: 1px solid #e1e4e8; border-radius: 8px; padding: 15px; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .example-card h3 { margin: 0 0 10px 0; color: #dd0031; font-size: 16px; }
    .example-card p { margin: 5px 0; font-size: 14px; color: #666; }
    .example-card button { margin-top: 10px; padding: 8px 16px; background: #dd0031; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .example-card button:hover { background: #c3002f; }
  `,
  template: `
    <div class="container">
      <h1>untiljs Angular Examples</h1>
      <p class="description">
        <strong>Framework Agnostic!</strong> Use signals with getter functions.
      </p>

      <h2>Basic Usage</h2>
      <section class="examples-grid">
        <div class="example-card">
          <h3>toBe</h3>
          <p>Value: {{ toBeValue() }}</p>
          <p>Result: {{ toBeResult() }}</p>
          <button (click)="testToBe()">Test toBe</button>
        </div>

        <div class="example-card">
          <h3>toMatch</h3>
          <p>Value: {{ toMatchValue() }}</p>
          <p>Result: {{ toMatchResult() }}</p>
          <button (click)="testToMatch()">Test toMatch</button>
        </div>

        <div class="example-card">
          <h3>toBeTruthy</h3>
          <p>Value: {{ truthyValue() | json }}</p>
          <p>Result: {{ truthyResult() }}</p>
          <button (click)="testTruthy()">Test toBeTruthy</button>
        </div>

        <div class="example-card">
          <h3>toBeNull</h3>
          <p>Value: {{ nullValue() }}</p>
          <p>Result: {{ nullResult() }}</p>
          <button (click)="testBeNull()">Test toBeNull</button>
        </div>
      </section>

      <h2>Change Detection</h2>
      <section class="examples-grid">
        <div class="example-card">
          <h3>changed</h3>
          <p>Value: "{{ changedValue() }}"</p>
          <p>Result: {{ changedResult() }}</p>
          <button (click)="testChanged()">Test changed</button>
        </div>

        <div class="example-card">
          <h3>changedTimes(3)</h3>
          <p>Value: {{ changedTimesValue() }}</p>
          <p>Result: {{ changedTimesResult() }}</p>
          <button (click)="testChangedTimes()">Test changedTimes</button>
        </div>
      </section>

      <h2>Not Modifier</h2>
      <section class="examples-grid">
        <div class="example-card">
          <h3>not.toBe</h3>
          <p>Value: {{ notToBeValue() }}</p>
          <p>Result: {{ notToBeResult() }}</p>
          <button (click)="testNotToBe()">Test not.toBe</button>
        </div>

        <div class="example-card">
          <h3>not.toBeNull</h3>
          <p>Value: "{{ notNullValue() }}"</p>
          <p>Result: {{ notNullResult() }}</p>
          <button (click)="testNotNull()">Test not.toBeNull</button>
        </div>
      </section>

      <h2>Timeout Options</h2>
      <section class="examples-grid">
        <div class="example-card">
          <h3>Timeout with throwOnTimeout</h3>
          <p>Value: {{ timeoutValue() }}</p>
          <p>Result: {{ timeoutResult() }}</p>
          <button (click)="testTimeout()">Test Timeout</button>
        </div>

        <div class="example-card">
          <h3>Timeout without throw</h3>
          <p>Value: {{ timeoutNoThrowValue() }}</p>
          <p>Result: {{ timeoutNoThrowResult() }}</p>
          <button (click)="testTimeoutNoThrow()">Test Timeout</button>
        </div>
      </section>

      <h2>Deep Comparison</h2>
      <section class="examples-grid">
        <div class="example-card">
          <h3>Deep Object</h3>
          <p>Object: {{ deepObject() | json }}</p>
          <p>Result: {{ deepObjectResult() }}</p>
          <button (click)="testDeepObject()">Test Deep</button>
        </div>

        <div class="example-card">
          <h3>Deep Array</h3>
          <p>Array: {{ deepArray() | json }}</p>
          <p>Result: {{ deepArrayResult() }}</p>
          <button (click)="testDeepArray()">Test Deep Array</button>
        </div>
      </section>
    </div>
  `,
})
export class AppComponent {
  // ============================================
  // Basic Usage
  // ============================================
  toBeValue = signal(0)
  toBeResult = signal('waiting...')

  async testToBe(): Promise<void> {
    this.toBeResult.set('waiting...')
    this.toBeValue.set(0)
    setTimeout(() => this.toBeValue.set(5), 1000)
    await until(() => this.toBeValue()).toBe(5)
    this.toBeResult.set(`Success! Value is now ${this.toBeValue()}`)
  }

  toMatchValue = signal(0)
  toMatchResult = signal('waiting...')

  async testToMatch(): Promise<void> {
    this.toMatchResult.set('waiting...')
    this.toMatchValue.set(0)
    setTimeout(() => this.toMatchValue.set(10), 1000)
    await until(() => this.toMatchValue()).toMatch((v: number) => v > 5)
    this.toMatchResult.set(`Success! Value ${this.toMatchValue()} > 5`)
  }

  truthyValue = signal<unknown>(null)
  truthyResult = signal('waiting...')

  async testTruthy(): Promise<void> {
    this.truthyResult.set('waiting...')
    this.truthyValue.set(null)
    setTimeout(() => this.truthyValue.set({ name: 'John' }), 1000)
    await until(() => this.truthyValue()).toBeTruthy()
    this.truthyResult.set('Success! Got object')
  }

  nullValue = signal<string | null>('not null')
  nullResult = signal('waiting...')

  async testBeNull(): Promise<void> {
    this.nullResult.set('waiting...')
    this.nullValue.set('not null')
    setTimeout(() => this.nullValue.set(null), 1000)
    await until(() => this.nullValue()).toBeNull()
    this.nullResult.set('Success! Value is null')
  }

  // ============================================
  // Change Detection
  // ============================================
  changedValue = signal('initial')
  changedResult = signal('waiting...')

  async testChanged(): Promise<void> {
    this.changedResult.set('waiting...')
    this.changedValue.set('initial')
    setTimeout(() => this.changedValue.set('changed!'), 1000)
    await until(() => this.changedValue()).changed()
    this.changedResult.set(`Success! Changed to "${this.changedValue()}"`)
  }

  changedTimesValue = signal(0)
  changedTimesResult = signal('waiting...')

  async testChangedTimes(): Promise<void> {
    this.changedTimesResult.set('waiting...')
    this.changedTimesValue.set(0)

    let count = 0
    const interval = setInterval(() => {
      this.changedTimesValue.set(++count)
    }, 200)

    await until(() => this.changedTimesValue()).changedTimes(3)
    clearInterval(interval)
    this.changedTimesResult.set(`Success! Changed 3 times`)
  }

  // ============================================
  // Not Modifier
  // ============================================
  notToBeValue = signal(5)
  notToBeResult = signal('waiting...')

  async testNotToBe(): Promise<void> {
    this.notToBeResult.set('waiting...')
    this.notToBeValue.set(5)
    setTimeout(() => this.notToBeValue.set(10), 1000)
    await until(() => this.notToBeValue()).not.toBe(5)
    this.notToBeResult.set(`Success! Now ${this.notToBeValue()}`)
  }

  notNullValue = signal<string | null>(null)
  notNullResult = signal('waiting...')

  async testNotNull(): Promise<void> {
    this.notNullResult.set('waiting...')
    this.notNullValue.set(null)
    setTimeout(() => this.notNullValue.set('value'), 1000)
    await until(() => this.notNullValue()).not.toBeNull()
    this.notNullResult.set(`Success! Now "${this.notNullValue()}"`)
  }

  // ============================================
  // Timeout Options
  // ============================================
  timeoutValue = signal(0)
  timeoutResult = signal('waiting...')

  async testTimeout(): Promise<void> {
    this.timeoutResult.set('waiting...')
    this.timeoutValue.set(0)

    try {
      await until(() => this.timeoutValue()).toBe(5, { timeout: 500, throwOnTimeout: true })
      this.timeoutResult.set('Unexpected success')
    } catch (error: unknown) {
      const err = error as Error
      this.timeoutResult.set(`Timeout! ${err.message}`)
    }
  }

  timeoutNoThrowValue = signal(0)
  timeoutNoThrowResult = signal('waiting...')

  async testTimeoutNoThrow(): Promise<void> {
    this.timeoutNoThrowResult.set('waiting...')
    this.timeoutNoThrowValue.set(0)

    const result = await until(() => this.timeoutNoThrowValue()).toBe(5, { timeout: 500 })
    this.timeoutNoThrowResult.set(`Timeout - returned: ${result}`)
  }

  // ============================================
  // Deep Comparison
  // ============================================
  deepObject = signal({ user: { profile: { name: 'Alice' } } })
  deepObjectResult = signal('waiting...')

  async testDeepObject(): Promise<void> {
    this.deepObjectResult.set('waiting...')
    this.deepObject.set({ user: { profile: { name: 'Alice' } } })

    setTimeout(() => {
      this.deepObject.set({ user: { profile: { name: 'Bob' } } })
    }, 1000)

    await until(() => this.deepObject()).toMatch(
      (v: { user: { profile: { name: string } } }) => v.user.profile.name === 'Bob',
      { deep: true }
    )
    this.deepObjectResult.set('Success! Object changed')
  }

  deepArray = signal([1, 2, 3])
  deepArrayResult = signal('waiting...')

  async testDeepArray(): Promise<void> {
    this.deepArrayResult.set('waiting...')
    this.deepArray.set([1, 2, 3])

    setTimeout(() => this.deepArray.set([1, 2, 3, 4, 5]), 1000)

    await until(() => this.deepArray()).toBe([1, 2, 3, 4, 5], { deep: true })
    this.deepArrayResult.set(`Success! ${this.deepArray().length} items`)
  }
}
