<template>
  <div>
    nested <br />
    menu3 <br />
    <el-input v-model="aa" />
  </div>
</template>

<script setup>
import { ref, onActivated } from 'vue'
const aa = ref('')
onActivated(() => {
  console.log('menu3')
})
defineOptions({
  name: 'Menu3',
})
</script>
