<template>
  <div>
    <el-input v-model="aa" />
    <div @click="test" v-for="item of 100" :key="item">
      {{ item }}
      <SvgIcon name="about" />
    </div>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
const test = () => {
  ElMessage.success('123123')
}
import { onActivated, ref } from 'vue'
const aa = ref('')

onActivated(() => {
  console.log('主页')
})
defineOptions({
  name: 'HomeIndex',
})
</script>

<style scoped lang="scss"></style>
