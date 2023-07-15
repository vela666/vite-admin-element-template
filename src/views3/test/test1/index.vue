<template>
  <div>test1</div>
</template>

<script setup>
import { computed, watch, reactive, ref, onActivated } from 'vue'

onActivated(() => {
  console.log('Test1')
})

defineOptions({
  name: 'Test1',
})
</script>

<style scoped lang="scss"></style>
