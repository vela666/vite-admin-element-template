<template>
  <div class="logo-contanier">
    <img :src="settings.logo" alt="" />
  </div>
</template>

<script setup>
import settings from '@/settings'
</script>

<style lang="scss" scoped>
.logo-contanier {
  width: 120px;
  height: 120px;
  vertical-align: middle;
}
img {
  width: 100%;
  height: 100%;
  display: inline-block;
}
</style>
