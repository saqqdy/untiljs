<script setup>
import { ref } from 'vue'
import until from 'untiljs'

const val1 = ref(1)
const val1Changed = ref(false)
const testToBe = async () => {
	setTimeout(() => {
		val1.value = 2
	}, 1000)

	await until(val1).toBe(2)
	val1Changed.value = true
}

const val2 = ref(1)
const val2Changed = ref(false)
const testCustomConditions = async () => {
	setTimeout(() => {
		val2.value = 2
	}, 1000)

  	await until(val2).toMatch(value => value > 1)
	val2Changed.value = true
}

const val3 = ref(1)
const val3Changed = ref(false)
const testTimeout = async () => {
	setTimeout(() => {
		val3.value = 2
	}, 1000)

  	await until(val3).not.toBe(ref(2), { timeout: 500, throwOnTimeout: true })
	val3Changed.value = true
}

const val4 = ref(1)
const val4Changed = ref(false)
const testOthers = async () => {
	setTimeout(() => {
		val4.value = 2
	}, 1000)

	await until(val4).toBe(true)
	await until(val4).toMatch(v => v > 5 && v < 10)
	await until(val4).changed()
	await until(val4).changedTimes(2)
	await until(val4).toBeTruthy()
	await until(val4).toBeNull()

	await until(val4).not.toBeNull()
	await until(val4).not.toBeTruthy()
	val4Changed.value = true
}

defineExpose({
	val1,
	val1Changed,
	testToBe,
	val2,
	val2Changed,
	testCustomConditions,
	val3,
	val3Changed,
	testTimeout,
	val4,
	val4Changed,
	testOthers,
})
</script>

<template>
	<div>
		<div>val1: {{ val1 }}</div>
		<div>val1Changed: {{ val1Changed }}</div>
		<button type="button" @click="testToBe">Test .toBe</button>
		<p></p>
		<div>val2: {{ val2 }}</div>
		<div>val2Changed: {{ val2Changed }}</div>
		<button type="button" @click="testCustomConditions">Test custom conditions</button>
		<p></p>
		<div>val3: {{ val3 }}</div>
		<div>val3Changed: {{ val3Changed }}</div>
		<button type="button" @click="testTimeout">Test timeout</button>
		<p></p>
		<div>val4: {{ val4 }}</div>
		<div>val4Changed: {{ val4Changed }}</div>
		<button type="button" @click="testOthers">Test others</button>
		<p></p>
	</div>
</template>
