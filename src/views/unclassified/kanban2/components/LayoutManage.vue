<template>
  <DrawerTab v-model="drawerTabVisible" @close="close" ref="drawerTabRef">
    <el-button @click="addGrid">添加</el-button>
    <el-button @click="save">应用</el-button>
    <el-button @click="close">重置</el-button>
    <div class="drag-content">
      <div style="height: 500px; overflow-y: overlay">
        <GridLayout
          margin="5"
          cellHeight="30"
          boxCls="dashboard-container-drawer"
          noResize
          :minRow="4"
          ref="gridLayoutRef"
          externalDragIn=".dashboard-drag-in .dashboard-drag-in-item"
          :dragData="testRight"
          v-model="items" />
      </div>
      <div class="dashboard-drag-in" ref="rightDragRef">
        {{ testRight }}
        <!-- will size to match content -->
        <div
          v-for="item of testRight"
          class="dashboard-drag-in-item"
          :gs-id="item.id"
          :gs-min-w="item.w"
          :gs-min-h="item.h"
          :gs-w="item.w"
          :gs-h="item.h"
          :key="item.id">
          <div class="dashboard-drag-in-content flex-center flex-between">
            <div class="drag-handle">拖我</div>
            <span class="mr-5">{{ item.id }}</span>
            <el-icon style="font-size: 20px" @click="add(item)"
              ><Plus
            /></el-icon>
          </div>
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
import { cloneDeep, debounce } from 'lodash-es'
import GridLayout from './GridLayout.vue'
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['save'])
let observer = null

const drawerTabVisible = ref(false)
const rightDragRef = ref(null)
let items = ref([])

let rightData = ref(
  [
    {
      id: '101',
      w: 6,
      h: 4,
      data: [5],
    },
    {
      id: '102',
      w: 6,
      h: 4,
      data: [7],
    },
  ].map((item) => {
    return {
      ...item,
      // noResize: false,
      minH: item.minH ?? item.h,
      mark: `grid-item-${item.id}`,
    }
  })
)

const testRight = computed(() => {
  return rightData.value.filter(
    (right) => !items.value.map((v) => +v.id).includes(+right.id)
  )
})

const gridDemoRef = ref(null)
const gridLayoutRef = shallowRef(null)
const open = (data) => {
  items.value = cloneDeep(data)
  drawerTabVisible.value = true
  nextTick(() => {
    gridLayoutRef.value.initLayout()
  })
}

const addGrid = (data) => {
  const id = (+items.value.at(-1)?.id || 0) + 1
  const node = {
    x: 0, // 初始位置 x
    y: 0, // 初始位置 y
    // autoPosition: true,
    // w: id % 2 ? 6 : 12,
    w: 12,
    // w: 6,
    h: 1,
    // h: 4,
    id: id + '',
    minH: 2,
  }
  items.value.push(node) // 将新网格项添加到数据数组中
  gridLayoutRef.value.makeLayout(node)
}
const close = () => {
  // observer.disconnect()
}

const save = () => {
  console.log(items.value)
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
      > .dashboard-drag-in-content {
        &:before {
          opacity: 0.5;
        }
      }
    }
  }
  .dashboard-drag-in-content {
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
