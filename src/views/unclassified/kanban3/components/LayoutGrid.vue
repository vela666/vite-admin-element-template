<template>
  <div>LayoutGrid</div>
</template>

<script setup>
import { computed, watch, reactive, ref, onActivated } from 'vue'

defineOptions({
  name: 'Components',
})

onActivated(() => {
  console.log('Components')
})
</script>

<style scoped lang="scss"></style>
