<template>
  <div>
    <el-input v-model="aa" />
    1231
    <div>
      nested <br />
      menu1 <br />
      menu1-1 <br />
    </div>
  </div>
</template>
<script setup>
import { onActivated, ref } from 'vue'
const aa = ref('')

onActivated(() => {
  console.log('menu1-1')
})
defineOptions({
  name: 'Menu11',
})
</script>
