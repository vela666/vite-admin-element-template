<template>
  <div>
    nested <br />
    menu2 <br />
    <el-input v-model="aa" />
  </div>
</template>

<script setup>
import { ref, onActivated } from 'vue'
const aa = ref('')
onActivated(() => {
  console.log('menu2')
})
defineOptions({
  name: 'Menu2',
})
</script>
