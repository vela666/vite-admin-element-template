<template>
  <div
    v-show="settingsStore.sidebarLogo"
    class="sidebar-logo-container"
    :class="[isCollapse ? 'collapse' : '', settingsStore.layoutMod + '-logo']">
    <transition name="sidebarLogoFade">
      <router-link key="expand" :title="title" class="sidebar-logo-link" to="/">
        <img :src="settings.logo" class="sidebar-logo" />
        <span
          v-show="!isCollapse || settingsStore.layoutMod !== 'vertical'"
          class="sidebar-title"
          >{{ title }}
        </span>
      </router-link>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
// import logo from '@/assets/imgs/logo2.png'
import settings from '@/settings'
import defaultSettings from '@/settings'
import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'

const { title } = defaultSettings
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const isCollapse = computed(() => {
  return !appStore.sidebar.opened
})

defineOptions({
  name: 'Logo',
})
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter-from,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 50px;

  .sidebar-logo-link {
    display: flex;
    align-items: center;
    gap: 10px;

    .sidebar-logo {
      width: 26px;
      height: 26px;
    }

    .sidebar-title {
      white-space: nowrap;
      color: #fff;
      font-size: 14px;
    }
  }
}
</style>
