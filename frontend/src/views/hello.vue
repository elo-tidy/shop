<script setup lang="ts">
import { ref } from 'vue'
import { callHelloWorld } from '../api/hello-world'

const result = ref(null)

async function testFunction() {
  result.value = await callHelloWorld('TEST')
}
</script>

<template>
  <button @click="testFunction">Tester Hello World</button>
  <pre>test : {{ result }}</pre>
</template>
