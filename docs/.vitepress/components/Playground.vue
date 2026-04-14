<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
	defaultMethod?: string
}

const props = withDefaults(defineProps<Props>(), {
	defaultMethod: 'toBe'
})

// Available methods
const methods = [
	{ name: 'toBe', description: 'Wait until equals a value', example: 'toBe(5)' },
	{ name: 'toMatch', description: 'Wait until condition is true', example: 'toMatch(v => v > 3)' },
	{ name: 'toBeTruthy', description: 'Wait until value is truthy', example: 'toBeTruthy()' },
	{ name: 'toBeNull', description: 'Wait until value is null', example: 'toBeNull()' },
	{ name: 'toBeUndefined', description: 'Wait until value is undefined', example: 'toBeUndefined()' },
	{ name: 'toBeNaN', description: 'Wait until value is NaN', example: 'toBeNaN()' },
	{ name: 'changed', description: 'Wait until value changes', example: 'changed()' },
	{ name: 'changedTimes', description: 'Wait until value changes N times', example: 'changedTimes(2)' },
	{ name: 'toContains', description: 'Wait until array contains value', example: 'toContains("item")' }
]

const selectedMethod = ref(props.defaultMethod)
const targetValue = ref('5')
const timeout = ref(5000)
const isRunning = ref(false)
const result = ref<string | null>(null)
const elapsedTime = ref(0)
const copied = ref(false)

let timer: ReturnType<typeof setInterval> | null = null
let startTime = 0

const currentMethod = computed(() =>
	methods.find(m => m.name === selectedMethod.value)
)

const generatedCode = computed(() => {
	const method = selectedMethod.value
	const target = targetValue.value

	let methodCall = ''
	switch (method) {
		case 'toBe':
			methodCall = `toBe(${isNaN(Number(target)) ? `'${target}'` : target})`
			break
		case 'toMatch':
			methodCall = `toMatch(v => v ${target || '> 0'})`
			break
		case 'changedTimes':
			methodCall = `changedTimes(${target || 2})`
			break
		case 'toContains':
			methodCall = `toContains('${target || 'item'}')`
			break
		default:
			methodCall = `${method}()`
	}

	return `import until from 'untiljs'

let value = 0
setTimeout(() => {
  value = ${isNaN(Number(target)) ? `'${target}'` : target}
}, 1000)

await until(() => value).${methodCall}
console.log('Condition met!')`
})

async function runDemo() {
	isRunning.value = true
	result.value = null
	elapsedTime.value = 0
	startTime = Date.now()

	// Update elapsed time
	timer = setInterval(() => {
		elapsedTime.value = Math.floor((Date.now() - startTime) / 100) / 10
	}, 100)

	// Simulate the until behavior
	const method = selectedMethod.value
	const target = targetValue.value

	return new Promise<void>((resolve) => {
		const timeoutId = setTimeout(() => {
			if (timer) clearInterval(timer)
			isRunning.value = false
			result.value = `Timeout after ${timeout.value}ms`
			resolve()
		}, timeout.value)

		// Simulate value change after 1 second
		setTimeout(() => {
			clearTimeout(timeoutId)
			if (timer) clearInterval(timer)
			isRunning.value = false
			elapsedTime.value = Math.floor((Date.now() - startTime) / 100) / 10
			result.value = `Success! Condition met in ${elapsedTime.value}s`
			resolve()
		}, 1000)
	})
}

function stopDemo() {
	if (timer) clearInterval(timer)
	isRunning.value = false
	result.value = 'Cancelled'
}

function copyCode() {
	navigator.clipboard.writeText(generatedCode.value)
	copied.value = true
	setTimeout(() => {
		copied.value = false
	}, 2000)
}

onUnmounted(() => {
	if (timer) clearInterval(timer)
})
</script>

<template>
	<div class="playground">
		<div class="playground-header">
			<span class="playground-title">Playground</span>
			<span class="playground-desc" v-if="currentMethod">{{ currentMethod.name }}() - {{ currentMethod.description }}</span>
		</div>

		<div class="playground-controls">
			<div class="control-group">
				<label>Method</label>
				<select v-model="selectedMethod" class="control-select">
					<option v-for="m in methods" :key="m.name" :value="m.name">
						{{ m.name }}()
					</option>
				</select>
			</div>

			<div class="control-group" v-if="['toBe', 'toMatch', 'changedTimes', 'toContains'].includes(selectedMethod)">
				<label>Target Value</label>
				<input
					v-model="targetValue"
					type="text"
					class="control-input"
					:placeholder="selectedMethod === 'toMatch' ? 'e.g. > 3' : 'e.g. 5'"
				/>
			</div>

			<div class="control-group">
				<label>Timeout (ms)</label>
				<input
					v-model.number="timeout"
					type="number"
					class="control-input"
					min="1000"
					step="1000"
				/>
			</div>

			<div class="control-buttons">
				<button
					class="btn btn-primary"
					@click="runDemo"
					:disabled="isRunning"
				>
					{{ isRunning ? 'Running...' : 'Run Demo' }}
				</button>
				<button
					v-if="isRunning"
					class="btn btn-secondary"
					@click="stopDemo"
				>
					Stop
				</button>
			</div>
		</div>

		<div class="playground-status" v-if="isRunning || result">
			<div class="status-item" v-if="isRunning">
				<span class="status-dot running"></span>
				<span>Waiting for condition... {{ elapsedTime }}s</span>
			</div>
			<div class="status-item" v-else-if="result" :class="{ success: result.includes('Success'), timeout: result.includes('Timeout') }">
				<span class="status-dot" :class="result.includes('Success') ? 'success' : 'timeout'"></span>
				<span>{{ result }}</span>
			</div>
		</div>

		<div class="playground-code">
			<div class="code-header">
				<span>Generated Code</span>
				<button class="copy-btn" @click="copyCode">
					{{ copied ? 'Copied!' : 'Copy' }}
				</button>
			</div>
			<pre><code>{{ generatedCode }}</code></pre>
		</div>

		<div class="playground-tips">
			<h4>Tips</h4>
			<ul>
				<li>Use <code>toMatch()</code> for custom conditions like <code>v > 3</code> or <code>v.includes('text')</code></li>
				<li>Use <code>not.*</code> to invert any condition, e.g., <code>not.toBe(5)</code></li>
				<li>Add <code>{ timeout: 3000, throwOnTimeout: true }</code> to throw on timeout</li>
				<li>Use <code>{ deep: true }</code> for deep object comparison</li>
			</ul>
		</div>
	</div>
</template>

<style scoped>
.playground {
	margin: 24px 0;
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	overflow: hidden;
	background: var(--vp-c-bg-soft);
}

.playground-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px 20px;
	background: var(--vp-c-bg);
	border-bottom: 1px solid var(--vp-c-divider);
}

.playground-title {
	font-size: 16px;
	font-weight: 600;
	color: var(--vp-c-text-1);
}

.playground-desc {
	font-size: 13px;
	color: var(--vp-c-text-2);
	font-family: var(--vp-font-family-mono);
}

.playground-controls {
	display: flex;
	align-items: flex-end;
	gap: 16px;
	padding: 16px 20px;
	background: var(--vp-c-bg);
	border-bottom: 1px solid var(--vp-c-divider);
	flex-wrap: wrap;
}

.control-group {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.control-group label {
	font-size: 12px;
	font-weight: 500;
	color: var(--vp-c-text-2);
}

.control-select,
.control-input {
	padding: 8px 12px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 6px;
	background: var(--vp-c-bg-soft);
	font-size: 14px;
	color: var(--vp-c-text-1);
	min-width: 120px;
}

.control-select:focus,
.control-input:focus {
	outline: none;
	border-color: var(--vp-c-brand-1);
}

.control-buttons {
	display: flex;
	gap: 8px;
	margin-left: auto;
}

.btn {
	padding: 8px 16px;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
}

.btn-primary {
	background: var(--vp-c-brand-1);
	color: white;
	border: none;
}

.btn-primary:hover:not(:disabled) {
	background: var(--vp-c-brand-2);
}

.btn-primary:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.btn-secondary {
	background: var(--vp-c-bg);
	color: var(--vp-c-text-1);
	border: 1px solid var(--vp-c-divider);
}

.btn-secondary:hover {
	background: var(--vp-c-bg-soft);
}

.playground-status {
	padding: 12px 20px;
	background: var(--vp-c-bg);
	border-bottom: 1px solid var(--vp-c-divider);
}

.status-item {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;
}

.status-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: var(--vp-c-text-3);
}

.status-dot.running {
	background: #f59e0b;
	animation: pulse 1s infinite;
}

.status-dot.success {
	background: #22c55e;
}

.status-dot.timeout {
	background: #ef4444;
}

@keyframes pulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.5; }
}

.playground-code {
	background: var(--vp-code-block-bg);
}

.code-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px 16px;
	border-bottom: 1px solid var(--vp-c-divider);
	font-size: 12px;
	color: var(--vp-c-text-2);
}

.copy-btn {
	padding: 4px 8px;
	font-size: 12px;
	background: transparent;
	border: 1px solid var(--vp-c-divider);
	border-radius: 4px;
	color: var(--vp-c-text-2);
	cursor: pointer;
}

.copy-btn:hover {
	background: var(--vp-c-bg-soft);
}

.playground-code pre {
	margin: 0;
	padding: 16px;
	overflow-x: auto;
}

.playground-code code {
	font-family: var(--vp-font-family-mono);
	font-size: 13px;
	line-height: 1.6;
	color: var(--vp-c-text-1);
}

.playground-tips {
	padding: 16px 20px;
	background: var(--vp-c-bg);
	border-top: 1px solid var(--vp-c-divider);
}

.playground-tips h4 {
	font-size: 14px;
	font-weight: 600;
	margin: 0 0 8px 0;
	color: var(--vp-c-text-1);
}

.playground-tips ul {
	margin: 0;
	padding-left: 20px;
}

.playground-tips li {
	font-size: 13px;
	color: var(--vp-c-text-2);
	margin: 4px 0;
}

.playground-tips code {
	background: var(--vp-c-bg-soft);
	padding: 2px 6px;
	border-radius: 4px;
	font-size: 12px;
}
</style>
