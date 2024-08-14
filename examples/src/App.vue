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
const val3Value = ref(1)
const testTimeout = async () => {
	setTimeout(() => {
		val3.value = 2
	}, 1000)

	await until(val3).toBe(ref(2), { timeout: 500, throwOnTimeout: true })
	val3Value.value = val3.value
}

const val4 = ref(1)
const val4_toBeTrue = ref(false)
const val4_toMatch5_10 = ref(false)
const val4_changed = ref(false)
const val4_changedTimes2 = ref(false)
const val4_toBeTruthy = ref(false)
const val4_toBeNull = ref(false)
const val4_not_toBeNull = ref(false)
const val4_not_toBeTruthy = ref(false)
const testOthers = async () => {
	setTimeout(() => {
		val4.value = 2
	}, 1000)

	until(val4)
		.toBe(true, { timeout: 1500, throwOnTimeout: true })
		.then(() => {
			val4_toBeTrue.value = true
		})
	until(val4)
		.toMatch(v => v > 5 && v < 10, { timeout: 1500, throwOnTimeout: true })
		.then(() => {
			val4_toMatch5_10.value = true
		})
	until(val4)
		.changed({ timeout: 1500, throwOnTimeout: true })
		.then(() => {
			val4_changed.value = true
		})
	until(val4)
		.changedTimes(2, { timeout: 1500, throwOnTimeout: true })
		.then(() => {
			val4_changedTimes2.value = true
		})
	until(val4)
		.toBeTruthy({ timeout: 1500, throwOnTimeout: true })
		.then(() => {
			val4_toBeTruthy.value = true
		})
	until(val4)
		.toBeNull({ timeout: 1500, throwOnTimeout: true })
		.then(() => {
			val4_toBeNull.value = true
		})

	until(val4)
		.not.toBeNull({ timeout: 1500, throwOnTimeout: true })
		.then(() => {
			val4_not_toBeNull.value = true
		})
	until(val4)
		.not.toBeTruthy({ timeout: 1500, throwOnTimeout: true })
		.then(() => {
			val4_not_toBeTruthy.value = true
		})
}

defineExpose({
	val1,
	val1Changed,
	testToBe,
	val2,
	val2Changed,
	testCustomConditions,
	val3,
	val3Value,
	testTimeout,
	val4,
	val4_toBeTrue,
	val4_toMatch5_10,
	val4_changed,
	val4_changedTimes2,
	val4_toBeTruthy,
	val4_toBeNull,
	val4_not_toBeNull,
	val4_not_toBeTruthy,
	testOthers
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
		<div>val3Value: {{ val3Value }}</div>
		<button type="button" @click="testTimeout">Test timeout</button>
		<p></p>
		<div>val4: {{ val4 }}</div>
		<div>val4_toBeTrue: {{ val4_toBeTrue }}</div>
		<div>val4_toMatch5_10: {{ val4_toMatch5_10 }}</div>
		<div>val4_changed: {{ val4_changed }}</div>
		<div>val4_changedTimes2: {{ val4_changedTimes2 }}</div>
		<div>val4_toBeTruthy: {{ val4_toBeTruthy }}</div>
		<div>val4_toBeNull: {{ val4_toBeNull }}</div>
		<div>val4_not_toBeNull: {{ val4_not_toBeNull }}</div>
		<div>val4_not_toBeTruthy: {{ val4_not_toBeTruthy }}</div>
		<button type="button" @click="testOthers">Test others</button>
		<p></p>
	</div>
</template>
