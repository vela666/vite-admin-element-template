<template>
  <el-menu
    background-color="#304156"
    text-color="#bfcbd9"
    active-text-color="#f4f4f5"
    :default-active="activeMenu"
    :collapse="isCollapse"
    :unique-opened="true"
    :collapse-transition="false"
    :mode="settingsStore.layoutMod"
    class="n-sidebar-menus">
    <SidebarItem
      v-for="item of permissionStore.routes"
      :key="item.path"
      :item="item"
      :base-path="item.path" />
  </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import SidebarItem from './SidebarItem'

import { useRoute } from 'vue-router'
import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'

const route = useRoute()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})
const isCollapse = computed(() => {
  return !appStore.sidebar.opened && settingsStore.layoutMod === 'vertical'
})

defineOptions({
  name: 'NavMenu',
})
</script>
<style lang="scss">
.n-sidebar-menus {
  border: none !important;
  width: 100%;
  overflow: hidden;
  .router-link-active {
    color: $color-primary !important;

    > * {
      color: $color-primary !important;
    }
  }

  .#{$customNameSpace}-sub-menu__title {
    border: none !important;
    &:hover {
      background-color: $color-263445 !important;
    }
  }
  // 菜单很多展示不下时 把 ... 改为 更多
  .#{$customNameSpace}-sub-menu__icon-more {
    &:first-child {
      color: $color-bfcbd9;
      &::after {
        content: '更多';
        font-size: $size-14;
      }
    }
  }

  &
    .nest-menu
    .#{$customNameSpace}-sub-menu
    > .#{$customNameSpace}-sub-menu__title,
  & .#{$customNameSpace}-sub-menu .#{$customNameSpace}-menu-item {
    background-color: $color-1f2d3d !important;

    &:hover {
      background-color: $color-001528 !important;
    }
  }
}
</style>
