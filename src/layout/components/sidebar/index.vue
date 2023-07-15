<template>
  <div>
    <Logo :class="settingsStore.layoutMod + '-logo'" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <NavMenu />
    </el-scrollbar>
  </div>
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings'
import Logo from './Logo'
import NavMenu from './NavMenu'

const settingsStore = useSettingsStore()

defineOptions({
  name: 'Sidebar',
})
</script>

<style scoped lang="scss">
.horizontal-logo {
  width: 210px;
  display: flex;
}
</style>
