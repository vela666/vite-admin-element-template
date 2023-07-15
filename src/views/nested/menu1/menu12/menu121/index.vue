<template>
  <div>
    <el-input v-model="aa" />

    nested <br />
    menu1 <br />
    menu1-2 <br />
    menu1-2-1 <br />
  </div>
</template>

<script setup>
import { onActivated, ref } from 'vue'
const aa = ref('')

onActivated(() => {
  console.log('menu1-2-1')
})
defineOptions({
  name: 'Menu121',
})
</script>
