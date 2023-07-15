<template>
  <template v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children?.length || onlyOneChild.noShowingChildren) &&
        !item.meta?.alwaysShow
      ">
      <NavLink v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{
            'submenu-title-noDropdown': !isNest,
          }">
          <SvgIcon
            class="mr-15"
            v-if="onlyOneChild.meta.icon || item.meta.icon"
            :name="onlyOneChild.meta.icon || item.meta.icon" />
          <template #title>
            <span>
              {{ onlyOneChild.meta.title }}
            </span>
          </template>
        </el-menu-item>
      </NavLink>
    </template>
    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)">
      <template #title>
        <SvgIcon class="mr-15" v-if="item.meta.icon" :name="item.meta.icon" />
        <span>
          {{ item.meta.title }}
        </span>
      </template>
      <div class="nest-menu">
        <SidebarItem
          v-for="child of item.children"
          :key="child.path"
          :is-nest="true"
          :item="child"
          :base-path="resolvePath(child.path)" />
      </div>
    </el-sub-menu>
  </template>
</template>

<script setup>
import { ref } from 'vue'
import path from 'path-browserify'
import { isExternal } from '@/utils/validate'
import NavLink from './NavLink'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isNest: {
    type: Boolean,
    default: false,
  },
  basePath: {
    type: String,
    default: '',
  },
})

const onlyOneChild = ref(null)
const subMenu = ref(null)

function hasOneShowingChild(children = [], parent) {
  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false
    } else {
      // 临时设置（如果只有一个显示的子级将被使用）
      onlyOneChild.value = item
      return true
    }
  })
  // 当只有一个子路由器时，默认显示子路由器
  if (showingChildren.length === 1) {
    return true
  }
  // 如果没有要显示的子路由器，则显示父级
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }
  return false
}

const resolvePath = (routePath) => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  return path.resolve(props.basePath, routePath)
}

defineOptions({
  name: 'SidebarItem',
})
</script>
<style lang="scss">
/*.router-link-active {
  & ~ * {
    color: $color-primary !important;
  }
}*/
</style>
