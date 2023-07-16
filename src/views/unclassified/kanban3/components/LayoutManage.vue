<template>
  <DrawerTab v-model="drawerTabVisible" @close="close" ref="drawerTabRef">
    <el-button @click="save">应用</el-button>
    <el-button @click="close">重置</el-button>
    <div class="drag-content">
      <div ref="wrapper" style="height: 300px; overflow: auto">
        <GridLayout
          ref="gridLayoutRef"
          v-model:layout="layout"
          isBounded
          :isResizable="false"
          :margin="[10, 10]"
          :row-height="27">
          <template #item="{ item }">
            <span class="text">{{ item.i }}</span>
          </template>
        </GridLayout>
      </div>
      <div class="dashboard-drag-in">
        <div
          v-for="item of testRight"
          class="droppable-element"
          draggable="true"
          unselectable="on"
          @drag="dragMove(item)"
          @dragend="dragEnd(item)"
          :key="item.id">
          {{ item.id }}
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
  onBeforeUnmount,
} from 'vue'
import { cloneDeep, debounce, throttle } from 'lodash-es'
import { GridLayout } from 'grid-layout-plus'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['save'])
// 拖动元素的位置
const dragElPos = { x: -1, y: -1 }

const drawerTabVisible = ref(false)
let layout = ref([])
const wrapper = ref()

let rightData = ref([
  {
    id: 101,
    i: '101',
    w: 6,
    h: 4,
    title: '测试1',
  },
  {
    id: 102,
    i: '102',
    w: 6,
    h: 4,
    title: '测试2',
  },
])

const testRight = computed(() => {
  return rightData.value.filter(
    (right) => !layout.value.map((v) => +v.id).includes(+right.id),
  )
})

const gridDemoRef = ref(null)
const gridLayoutRef = shallowRef(null)
const open = (data) => {
  layout.value = cloneDeep(data)
  drawerTabVisible.value = true
  document.addEventListener('dragover', syncMousePosition)
}
const close = () => {
  document.removeEventListener('dragover', syncMousePosition)
}

const save = () => {
  emit('save', cloneDeep(layout.value))
  drawerTabVisible.value = false
}

const syncMousePosition = (event) => {
  console.log(event)
  dragElPos.x = event.clientX
  dragElPos.y = event.clientY
}

const dropId = 'drop'
const dragItem = { x: -1, y: -1, w: 6, h: 4, i: '' }

const dragMove = (node) => {
  const parentRect = wrapper.value?.getBoundingClientRect()
  if (!parentRect || !gridLayoutRef.value) return

  const mouseInGrid =
    dragElPos.x > parentRect.left &&
    dragElPos.x < parentRect.right &&
    dragElPos.y > parentRect.top &&
    dragElPos.y < parentRect.bottom
  if (mouseInGrid && !layout.value.some((item) => item.i === dropId)) {
    layout.value.push({
      x: (layout.value.length * 2) % 12,
      y: layout.value.length + 12, // puts it at the bottom
      w: dragItem.w,
      h: dragItem.h,
      i: dropId,
    })
  }

  const index = layout.value.findIndex((item) => item.i === dropId)
  if (index !== -1) {
    const item = gridLayoutRef.value.getItem(dropId)
    if (!item) return
    try {
      item.wrapper.style.display = 'none'
    } catch (e) {
      console.log(e)
    }

    Object.assign(item.state, {
      top: dragElPos.y - parentRect.top,
      left: dragElPos.x - parentRect.left,
    })
    const newPos = item.calcXY(
      dragElPos.y - parentRect.top,
      dragElPos.x - parentRect.left,
    )

    if (mouseInGrid) {
      gridLayoutRef.value.dragEvent(
        'dragstart',
        dropId,
        newPos.x,
        newPos.y,
        dragItem.h,
        dragItem.w,
      )
      dragItem.i = String(index)
      dragItem.x = layout.value[index].x
      dragItem.y = layout.value[index].y
    } else {
      gridLayoutRef.value.dragEvent(
        'dragend',
        dropId,
        newPos.x,
        newPos.y,
        dragItem.h,
        dragItem.w,
      )
      layout.value = layout.value.filter((item) => item.i !== dropId)
    }
  }
}
const dragEnd = (node) => {
  const parentRect = wrapper.value?.getBoundingClientRect()

  if (!parentRect || !gridLayoutRef.value) return

  const mouseInGrid =
    dragElPos.x > parentRect.left &&
    dragElPos.x < parentRect.right &&
    dragElPos.y > parentRect.top &&
    dragElPos.y < parentRect.bottom

  if (!mouseInGrid) return
  gridLayoutRef.value.dragEvent(
    'dragend',
    dropId,
    dragItem.x,
    dragItem.y,
    dragItem.h,
    dragItem.w,
  )
  layout.value = layout.value.filter((item) => item.i !== dropId)

  layout.value.push({
    x: dragItem.x,
    y: dragItem.y,
    w: dragItem.w,
    h: dragItem.h,
    i: node.i,
    id: node.id,
    'min-h': dragItem.h,
    'min-w': dragItem.w,
    'max-w': dragItem.w,
  })

  gridLayoutRef.value.dragEvent(
    'dragend',
    dragItem.i,
    dragItem.x,
    dragItem.y,
    dragItem.h,
    dragItem.w,
  )

  const item = gridLayoutRef.value.getItem(dropId)

  if (!item) return

  try {
    item.wrapper.style.display = ''
  } catch (e) {
    console.log(e)
  }
}

watch(
  layout,
  debounce((val) => {
    console.log(val)
  }, 300),
  { deep: true },
)

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

.vgl-layout {
  background-color: #eee;
}
:deep(.vgl-item--placeholder) {
  background: rgb(255, 255, 255);
  opacity: 0.5;
}
:deep(.vgl-item:not(.vgl-item--placeholder)) {
  background-color: #ccc;
  border: 1px solid black;
}

:deep(.vgl-item--resizing) {
  opacity: 90%;
}

:deep(.vgl-item--static) {
  background-color: #cce;
}

.text {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  font-size: 24px;
  text-align: center;
}

.layout-json {
  padding: 10px;
  margin-top: 10px;
  background-color: #ddd;
  border: 1px solid black;
}

.columns {
  columns: 120px;
}

.droppable-element {
  width: 150px;
  padding: 10px;
  margin: 10px 0;
  text-align: center;
  background-color: #fdd;
  border: 1px solid black;
}
</style>
