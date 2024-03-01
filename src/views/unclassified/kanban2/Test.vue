<template>
  <div>
    <el-button>asdasd</el-button>
  </div>
</template>

<script setup>
import { computed, watch, reactive, ref, onActivated } from 'vue'

defineOptions({
  name: 'Kanban2',
})

onActivated(() => {
  console.log('Kanban2')
})
</script>

<style scoped lang="scss"></style>
