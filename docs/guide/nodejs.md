# Node.js Integration

UntilJS works great in Node.js environments for waiting on various async conditions.

## Basic Usage

```typescript
import until from 'untiljs'

let status = 'pending'
setTimeout(() => { status = 'ready' }, 1000)

await until(() => status).toBe('ready')
console.log('Status is now ready!')
```

## Event Emitters

Wait for event-based state changes:

```typescript
import until from 'untiljs'
import { EventEmitter } from 'events'

const emitter = new EventEmitter()
let status = 'pending'

emitter.on('ready', () => {
  status = 'ready'
})

setTimeout(() => emitter.emit('ready'), 1000)
await until(() => status).toBe('ready')
```

## File System Changes

Wait for file changes:

```typescript
import until from 'untiljs'
import fs from 'fs'
import { readFile } from 'fs/promises'

let fileContent = await readFile('./data.txt', 'utf-8')

const watcher = fs.watch('./data.txt', async () => {
  fileContent = await readFile('./data.txt', 'utf-8')
})

// Wait for specific content
await until(() => fileContent).toMatch(content => content.includes('target'))
watcher.close()
```

## Database Polling

Wait for database state changes:

```typescript
import until from 'untiljs'

interface User {
  id: number
  status: string
}

async function getUser(id: number): Promise<User | null> {
  // Your database query
  return { id, status: 'pending' }
}

async function waitForUserReady(userId: number) {
  await until(async () => {
    const user = await getUser(userId)
    return user?.status
  }).toBe('ready', { timeout: 30000 })
}

// Note: For async getters, you might need a wrapper
async function waitForUserReadyV2(userId: number) {
  let status = 'pending'

  const poll = setInterval(async () => {
    const user = await getUser(userId)
    status = user?.status || 'pending'
  }, 100)

  await until(() => status).toBe('ready', { timeout: 30000 })
  clearInterval(poll)
}
```

## HTTP Requests

Wait for HTTP response:

```typescript
import until from 'untiljs'
import http from 'http'

let data = null

http.get('http://example.com/api', (res) => {
  let body = ''
  res.on('data', chunk => body += chunk)
  res.on('end', () => {
    data = JSON.parse(body)
  })
})

await until(() => data).toBeTruthy()
console.log('Data received:', data)
```

## Child Processes

Wait for child process to complete:

```typescript
import until from 'untiljs'
import { spawn } from 'child_process'

let output = ''
let completed = false

const child = spawn('npm', ['test'])

child.stdout.on('data', (data) => {
  output += data.toString()
})

child.on('close', () => {
  completed = true
})

await until(() => completed).toBe(true)
console.log('Tests completed!')
console.log(output)
```

## WebSocket Connections

```typescript
import until from 'untiljs'
import WebSocket from 'ws'

const ws = new WebSocket('wss://example.com')
let connected = false

ws.on('open', () => {
  connected = true
})

await until(() => connected).toBe(true, { timeout: 5000 })
console.log('WebSocket connected!')
```

## Custom Polling

Create a polling utility:

```typescript
import until from 'untiljs'

async function pollUntil<T>(
  getter: () => T | Promise<T>,
  condition: (value: T) => boolean,
  interval = 100,
  timeout = 30000
): Promise<T> {
  let value: T

  const pollInterval = setInterval(async () => {
    value = await getter()
  }, interval)

  try {
    await until(() => value).toMatch(condition, { timeout })
    return value!
  } finally {
    clearInterval(pollInterval)
  }
}

// Usage
const result = await pollUntil(
  () => fetch('/api/status').then(r => r.json()),
  data => data.status === 'complete',
  500,
  60000
)
```
