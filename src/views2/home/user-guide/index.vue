<template>
  <div>
    <el-button @click="flag = !flag">测试</el-button>
    <transition appear name="fade-transform">
      <div v-show="flag">1241</div>
    </transition>
  </div>
</template>

<script setup>
import { computed, watch, reactive, ref, onActivated } from 'vue'
const flag = ref(true)
onActivated(() => {
  console.log('UserGuide')
})

defineOptions({
  name: 'UserGuide',
})
</script>

<style scoped lang="scss"></style>
