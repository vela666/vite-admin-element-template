<template>
  <div>
    <el-date-picker
      popper-class="test"
      ref="elDateRef"
      v-model="value1"
      type="daterange"
      start-placeholder="Start Date"
      end-placeholder="End Date"
      :default-value="[new Date(2010, 9, 1), new Date(2010, 10, 1)]">
    </el-date-picker>
  </div>
</template>

<script setup>
import { computed, watch, reactive, ref, onActivated, onMounted } from 'vue'

const value1 = ''
const elDateRef = ref(null)
// console.log(MyExtendedComponent)
defineOptions({
  name: 'ElDate',
})
onMounted(() => {
  console.log(elDateRef.value.$el)
})
onActivated(() => {
  console.log('ElDate')
})
</script>

<style scoped lang="scss"></style>
