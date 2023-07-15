<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <SvgIcon name="size" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item of sizeOptions"
          :key="item.value"
          :disabled="appStore.size === item.value"
          :command="item.value">
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import useAppStore from '@/store/modules/app'
import useTagsViewStore from '@/store/modules/tagsView'

import { useRouter, useRoute } from 'vue-router'

const appStore = useAppStore()
const tagsViewStore = useTagsViewStore()
const route = useRoute()
const router = useRouter()
const sizeOptions = ref([
  { label: 'Default', value: 'default' },
  { label: 'Large', value: 'large' },
  { label: 'Small', value: 'small' },
])

const handleSetSize = (val) => {
  appStore.SET_SIZE(val)
  refreshView()
  ElMessage({
    message: '切换成功',
    type: 'success',
    duration: 1000,
  })
}

const refreshView = () => {
  tagsViewStore.DEL_ALL_CACHED_VIEWS(route)
  const { fullPath } = route
  nextTick(() => {
    router.replace({
      path: '/reolad' + fullPath,
    })
  })
}

defineOptions({
  name: 'SizeSelect',
})
</script>
