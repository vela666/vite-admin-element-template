<template>
  <div>
    <el-input v-model="aa" />

    nested <br />
    menu1 <br />
    menu1-2 <br />
    menu1-2-2 <br />
  </div>
</template>

<script setup>
import { onActivated, ref } from 'vue'
const aa = ref('')

onActivated(() => {
  console.log('menu1-2-2')
})
defineOptions({
  name: 'Menu122',
})
</script>
