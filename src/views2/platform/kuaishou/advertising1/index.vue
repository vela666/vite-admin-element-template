<template>
  <div>
    <el-input v-model="val"></el-input>
    {{ $route.name }}
  </div>
</template>

<script setup>
import { computed, watch, reactive, ref, onActivated } from 'vue'
const val = ref()
onActivated(() => {
  console.log('PlatformToutiaoAdvertising1')
})
defineOptions({
  name: 'PlatformToutiaoAdvertising1',
})
</script>

<style scoped lang="scss"></style>
