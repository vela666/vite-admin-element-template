<template>
  <div style="padding: 30px">
    1312
    <!--    <router-view #default="{ Component }">
      <el-alert :closable="false" title="menu 1">
        <component :is="Component" />
      </el-alert>
    </router-view>-->
  </div>
</template>
<script setup>
import { onActivated, ref } from 'vue'

onActivated(() => {
  console.log('menu1')
})
defineOptions({
  name: 'Menu1',
})
</script>
