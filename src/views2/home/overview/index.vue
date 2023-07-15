<template>
  <div>
    <span v-copy="'嘤嘤嘤'">哈哈哈111</span>
    <div v-tooltip="'aasdadas'">a</div>
    <div v-showTips style="max-width: 20px">sadasdadasdasda</div>
    <div v-for="item of 1000" :key="item">
      {{ item }}
    </div>
  </div>
</template>

<script setup>
import { computed, watch, reactive, ref, onActivated } from 'vue'

onActivated(() => {
  console.log('Overview')
})
defineOptions({
  name: 'Overview',
})
</script>

<style scoped lang="scss"></style>
