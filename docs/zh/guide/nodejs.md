# Node.js 集成

UntilJS 在 Node.js 环境中运行良好，可以等待各种异步条件。

## 基本用法

```typescript
import until from 'untiljs'

let status = 'pending'
setTimeout(() => { status = 'ready' }, 1000)

await until(() => status).toBe('ready')
console.log('状态现在是 ready！')
```

## 事件发射器

等待基于事件的状态变化：

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

## 文件系统变化

等待文件变化：

```typescript
import until from 'untiljs'
import fs from 'fs'
import { readFile } from 'fs/promises'

let fileContent = await readFile('./data.txt', 'utf-8')

const watcher = fs.watch('./data.txt', async () => {
  fileContent = await readFile('./data.txt', 'utf-8')
})

// 等待特定内容
await until(() => fileContent).toMatch(content => content.includes('target'))
watcher.close()
```

## 子进程

等待子进程完成：

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
console.log('测试完成！')
console.log(output)
```

## WebSocket 连接

```typescript
import until from 'untiljs'
import WebSocket from 'ws'

const ws = new WebSocket('wss://example.com')
let connected = false

ws.on('open', () => {
  connected = true
})

await until(() => connected).toBe(true, { timeout: 5000 })
console.log('WebSocket 已连接！')
```