<template>
  <div>test2</div>
</template>

<script setup>
import { computed, watch, reactive, ref, onActivated } from 'vue'

onActivated(() => {
  console.log('Test2')
})

defineOptions({
  name: 'Test2',
})
</script>

<style scoped lang="scss"></style>
