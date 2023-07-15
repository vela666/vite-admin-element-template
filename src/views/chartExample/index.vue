<template>
  <div>Index</div>
</template>

<script setup>
import { computed, watch, reactive, ref, onActivated } from 'vue'

defineOptions({
  name: 'ChartExample',
})

onActivated(() => {
  console.log('ChartExample')
})
</script>

<style scoped lang="scss"></style>
