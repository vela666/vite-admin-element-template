<template>
  <div>Index</div>
</template>

<script setup>
import { computed, watch, reactive, ref, onActivated } from 'vue'

defineOptions({
  name: 'Menu12',
})

onActivated(() => {
  console.log('Menu12')
})
</script>

<style scoped lang="scss"></style>
