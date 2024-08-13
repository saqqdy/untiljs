<script setup>
import { ref } from 'vue'

defineExpose({
	cancelledRequestData,
	request1,
	request2,
	request3,
	request4,
	request5,
	lastRequestID,
	doRequestUnique,
	doRequestOrderly
})
</script>

<template>
	<div>
		<button type="button" @click="doRequestUnique">Do Request (cancel similar request)</button>
		<p></p>
		<div>request 1: {{ request1 }}</div>
		<p></p>
		<div>request 2: {{ request2 }}</div>
		<p></p>
		<div>cancelled request data: {{ cancelledRequestData }}</div>
		<p></p>
		<button type="button" @click="doRequestOrderly">Do Request (return in sequence)</button>
		<p></p>
		<div>request 3: {{ request3 }}</div>
		<p></p>
		<div>request 4: {{ request4 }}</div>
		<p></p>
		<div>request 5: {{ request5 }}</div>
		<p></p>
		<div>last request id is: {{ lastRequestID }}</div>
	</div>
</template>
