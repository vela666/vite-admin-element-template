<template>
  <div>
    <div>
      <el-button @click="addNewKanBan">添加仪表</el-button>
      <el-button @click="managementKanBan">管理仪表</el-button>
      <el-button @click="save">应用</el-button>
      <div class="layout-json">
        Displayed as <code>[x, y, w, h]</code>:
        <div class="columns">
          <div v-for="item in layout" :key="item.i" class="layout-item">
            <b>{{ item.i }}</b
            >: [{{ item.x }}, {{ item.y }}, {{ item.w }}, {{ item.h }}]
          </div>
        </div>
      </div>
    </div>
    <div class="test" ref="wrapper">
      <GridLayout
        ref="gridLayoutRef"
        v-model:layout="layout"
        isBounded
        vertical-compact
        :margin="[20, 20]"
        @layout-updated="layoutUpdatedEvent"
        :row-height="90">
        <GridItem
          v-for="item of layout"
          :key="item.i"
          :x="item.x"
          :col-num="12"
          :y="item.y"
          :static="false"
          :w="item.w"
          :h="item.h"
          :min-h="item.minH"
          :min-w="item.w"
          :max-w="item.w"
          :is-resizable="item.w >= 6"
          @resize="gridItemReize"
          drag-allow-from=".drag-handle"
          drag-ignore-from=".no-drag"
          :i="item.i">
          <div class="drag-handle">拖我</div>
          {{ item.i }}
        </GridItem>
      </GridLayout>
    </div>
    <LayoutManage :data="layout" ref="layoutManageRef" @save="kanBanSave" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, shallowRef } from 'vue'

import { GridLayout, GridItem } from 'grid-layout-plus'
import LayoutManage from './components/LayoutManage.vue'
import { throttle } from 'lodash-es'

const layout = ref(
  [
    { x: 0, y: 0, w: 12, h: 1, i: '208', id: 208, type: 1 },
    { x: 6, y: 1, w: 6, h: 4, i: '1306', id: 1306, type: 2 },
    { x: 0, y: 5, w: 12, h: 1, i: '207', id: 207, type: 1 },
    { x: 0, y: 1, w: 3, h: 2, i: '2100', id: 2100, type: 2 },
  ].map((item) => ({
    ...item,
    minH: item.h,
  })),
)

const gridLayoutRef = ref()
const layoutManageRef = shallowRef(null)

const addNewKanBan = () => {
  const id = (+layout.value.at(-1)?.id || 0) + 1
  const node = {
    x: -1, // 初始位置 x
    y: -1, // 初始位置 y
    // autoPosition: true,
    w: id % 2 ? 6 : 3,
    // w: 6,
    h: id % 2 ? 4 : 2,
    // h: 4,
    i: id + '',
    id: id,
    minH: id % 2 ? 4 : 2,
  }
  layout.value.push(node) // 将新网格项添加到数据数组中
  // save()
}

const managementKanBan = () => {
  layoutManageRef.value.open(layout.value)
}

const save = () => {
  console.log(layout.value)
}

const kanBanSave = (data) => {
  layout.value = data
}

const layoutUpdatedEvent = (newLayout) => {
  console.log(newLayout, 'layoutUpdatedEvent')
}
const gridItemReize = (i, newH, newW, newHPx, newWPx) => {
  requestAnimationFrame(() => {
    document.documentElement.scrollTo({
      top: newHPx,
      behavior: 'smooth',
    })
  })
}
</script>

<style scoped lang="scss">
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
