<template>
  <div
    :class="[classObject, settingsStore.layoutMod + '-layout']"
    class="app-wrapper">
    <div
      v-if="
        appStore.device === 'mobile' &&
        appStore.sidebar.opened &&
        settingsStore.layoutMod === 'vertical'
      "
      class="drawer-bg"
      @click="handleClickOutside(false)" />
    <!--     垂直布局   -->
    <SideBar
      class="sidebar-container vertical"
      v-if="settingsStore.layoutMod === 'vertical'" />

    <div
      ref="mainContainerRef"
      class="main-container"
      :class="{ hasTagsView: settingsStore.tagsView }">
      <div :class="{ 'fixed-header': settingsStore.fixedHeader }">
        <!--    水平布局        -->
        <NavBar
          :class="
            settingsStore.layoutMod === 'vertical'
              ? ''
              : 'sidebar-container horizontal'
          " />
        <TagsView v-if="settingsStore.tagsView" />
      </div>
      <AppMain />
      <Settings />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEventListener } from '@vueuse/core'

import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'

import NavBar from './components/navbar'
import AppMain from './components/AppMain'
import SideBar from './components/sidebar'
import TagsView from './components/tagsView'
import Settings from './components/settings'

import { toggleClass } from '@/utils/dom'

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const mainContainerRef = ref(null)
const hiddenMainContainer = 'hidden-main-container'

const classObject = computed(() => {
  const obj = {
    hideSidebar:
      !appStore.sidebar.opened && settingsStore.layoutMod !== 'horizontal',
    openSidebar:
      !!appStore.sidebar.opened && settingsStore.layoutMod !== 'horizontal',
    // 小屏 页面刷新 侧边栏和右侧内容 过渡效果暂时 移除
    withoutAnimation: appStore.sidebar.withoutAnimation,
    mobile: appStore.device === 'mobile',
  }
  return obj
})

const handleClickOutside = (bool) => {
  appStore.CLOSE_SIDEBAR(bool)
}

const minWidth = 990

const isMobile = () => {
  const rect = document.body.getBoundingClientRect()
  // return rect.width - 1 < minWidth
  return rect.width < minWidth
}

const resizeHandler = () => {
  if (!document.hidden) {
    const flag = isMobile()
    appStore.TOGGLE_DEVICE(flag ? 'mobile' : 'desktop')
    flag && handleClickOutside(true)
  }
}

onMounted(() => {
  const flag = isMobile()
  if (flag) {
    appStore.TOGGLE_DEVICE('mobile')
    handleClickOutside(true)
  }
  toggleClass(false, hiddenMainContainer, mainContainerRef.value)
  useEventListener('resize', resizeHandler)
})

defineOptions({
  name: 'Layout',
})
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  // 如果顶部有调整，需要调整这里的高度
  .app-main {
    min-height: calc(100vh - 56px);
  }
  .hasTagsView {
    .app-main {
      min-height: calc(100vh - 91px);
    }
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 1001;
}

.fixed-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  &.main-container {
    width: 100%;
  }
}
</style>
