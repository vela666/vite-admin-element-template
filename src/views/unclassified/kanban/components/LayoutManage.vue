<template>
  <DrawerTab v-model="drawerTabVisible" @close="close" ref="drawerTabRef">
    <el-button @click="save">应用</el-button>
    <el-button @click="close">重置</el-button>
    <div class="drag-content">
      <div style="height: 500px; overflow-y: overlay">
        <GridLayout
          margin="5"
          cellHeight="30"
          boxCls="dashboard-container-drawer"
          noResize
          ref="gridLayoutRef"
          needExternalDragIn
          v-model="items" />
      </div>
      <div class="dashboard-drag-in">
        {{ testRight }}
        <!-- will size to match content -->
        <div
          v-for="item of testRight"
          class="grid-stack-item"
          :gs-id="item.id"
          :gs-min-w="item.w"
          :gs-min-h="item.h"
          :gs-w="item.w"
          :gs-h="item.h"
          :key="item.id">
          <div class="grid-stack-item-content">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </DrawerTab>
</template>

<script setup>
import {
  computed,
  watch,
  reactive,
  ref,
  onMounted,
  shallowRef,
  nextTick,
} from 'vue'
import { cloneDeep } from 'lodash-es'
import GridLayout from './GridLayout.vue'
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['save'])
const drawerTabVisible = ref(false)
let items = ref([])

let rightData = ref([
  {
    id: 101,
    w: 6,
    h: 4,
    title: '测试1',
  },
  {
    id: 102,
    w: 6,
    h: 4,
    title: '测试2',
  },
])

const testRight = computed(() => {
  return rightData.value.filter(
    (right) => !items.value.map((v) => +v.id).includes(+right.id),
  )
})

const gridDemoRef = ref(null)
const gridLayoutRef = shallowRef(null)
const open = (data) => {
  items.value = cloneDeep(data)
  drawerTabVisible.value = true
  nextTick(() => {
    gridLayoutRef.value.initLayout(true)
  })
}
const close = () => {}

const save = () => {
  emit('save', cloneDeep(items.value))
  drawerTabVisible.value = false
}

defineExpose({
  open,
})

defineOptions({
  name: 'LayoutManage',
})
</script>

<style scoped lang="scss">
.drag-content {
  display: flex;
  min-height: 500px;
  overflow: hidden;
  background-color: $color-fff;
  border: 1px solid #e3e5ed;
  border-radius: 4px;
  > div {
    flex: 1;
    &:last-of-type {
      padding: 12px 24px;
    }
  }
}

.dashboard-drag-in {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .grid-stack-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &.ui-draggable-dragging {
      > .grid-stack-item-content {
        &:before {
          opacity: 0.5;
        }
      }
    }
  }
  .grid-stack-item-content {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    box-shadow: none;
    height: 42px;
    border-radius: 2px;
    cursor: grab;
    z-index: 1;
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-color: #f5f7fa;
    }
  }
}
</style>
