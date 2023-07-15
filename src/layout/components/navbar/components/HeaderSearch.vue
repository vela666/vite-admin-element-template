<template>
  <div :class="{ show: show }" class="header-search">
    <SvgIcon v-show="!show" name="search" @click.stop="click" />

    <el-select
      ref="headerSearchSelect"
      v-model="search"
      filterable
      default-first-option
      placeholder="Search"
      class="header-search-select"
      @change="change">
      <el-option
        v-for="item of options"
        :key="item.path"
        :value="item.path"
        :label="item.title.join(' > ')" />
    </el-select>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import path from 'path-browserify'
import usePermissionStore from '@/store/modules/permission'
import { isExternal, getUrl } from '@/utils/validate'

const router = useRouter()
const permissionStore = usePermissionStore()
const show = ref(false)
const search = ref('')
const options = ref([])
const headerSearchSelect = ref(null)

const routes = computed(() => permissionStore.routes)
const generateRoutes = (routerList, basePath = '/', prefixTitle = []) => {
  let res = []
  for (const item of routerList) {
    // skip hidden item
    if (item.hidden) {
      continue
    }

    const data = {
      path: path.resolve(basePath, item.path),
      title: [...prefixTitle],
    }

    if (item.meta && item.meta.title) {
      data.title = [...data.title, item.meta.title]
      if (item.redirect !== 'noRedirect' && !item.search) {
        // only push the routes with title
        // special case: need to exclude parent router without redirect
        res.push(data)
      }
    }

    // recursive child routerList
    if (item.children) {
      const tempRoutes = generateRoutes(item.children, data.path, data.title)
      if (tempRoutes.length >= 1) {
        res = [...res, ...tempRoutes]
      }
    }
  }
  return res
}

const click = () => {
  show.value = true
  nextTick(() => {
    headerSearchSelect.value && headerSearchSelect.value.focus()
  })
}
const close = () => {
  show.value = false
}
const change = (val) => {
  if (isExternal(val)) {
    window.open(getUrl(val)[0])
  } else {
    router.replace(val)
  }
  show.value = false
}

watch(show, (value) => {
  if (value) {
    document.body.addEventListener('click', close)
  } else {
    document.body.removeEventListener('click', close)
  }
})

onMounted(() => {
  options.value = generateRoutes(routes.value)
})

defineOptions({
  name: 'HeaderSearch',
})
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;

  &:hover {
    background: #f6f6f6;
  }

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    --el-select-input-focus-border-color: transparent;
    font-size: 18px;
    transition: width $layout-transition-time;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    box-shadow: none;
    :deep(.#{$customNameSpace}-input__wrapper) {
      border-radius: 0;
    }
    :deep(.#{$customNameSpace}-input__inner) {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      //border-bottom: 1px solid #d9d9d9;
    }
    /*  ::v-slotted(.foo) {}
      ::v-global(.foo) {}*/
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
