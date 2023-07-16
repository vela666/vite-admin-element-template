<template>
  <main>
    <el-button @click="addNewKanBan">添加仪表</el-button>
    <el-button @click="managementKanBan">管理仪表</el-button>
    <el-button @click="save">应用</el-button>
    <br />
    <GridLayout dragHandle=".handler" ref="gridLayoutRef" v-model="items" />

    <LayoutManage :data="items" ref="layoutManageRef" @save="kanBanSave" />
  </main>
</template>

<script setup>
import {
  computed,
  watch,
  reactive,
  ref,
  nextTick,
  onMounted,
  shallowRef,
  onActivated,
} from 'vue'
import 'gridstack/dist/gridstack.min.css'
import { GridStack } from 'gridstack'
import GridLayout from './components/GridLayout.vue'
import LayoutManage from './components/LayoutManage.vue'
import { differenceBy } from 'lodash-es'

const layoutManageRef = shallowRef(null)
// const items = ref([])
const items = ref([
  {
    id: '1',
    w: 6,
    h: 4,
    x: 0,
    y: 0,
    mark: 'grid-item-1',
  },
  {
    id: '2',
    w: 3,
    h: 2,
    x: 9,
    y: 0,
    mark: 'grid-item-2',
  },
  {
    id: '3',
    w: 6,
    h: 4,
    x: 6,
    y: 2,
    mark: 'grid-item-3',
  },
  {
    id: '4',
    w: 12,
    h: 2,
    x: 0,
    y: 4,
    mark: 'grid-item-4',
  },
])
/*const items = ref(
  [
    { x: 0, y: 0, w: 12, h: 4, i: '1689', id: 1689, type: 2 },
    { x: 6, y: 4, w: 6, h: 4, i: '1692', id: 1692, type: 2 },
    { x: 0, y: 4, w: 6, h: 4, i: '1691', id: 1691, type: 2 },
    { x: 6, y: 8, w: 6, h: 4, i: '1688', id: 1688, type: 2 },
    { x: 0, y: 8, w: 6, h: 4, i: '1690', id: 1690, type: 2 },
    { x: 6, y: 12, w: 6, h: 4, i: '1711', id: 1711, type: 2 },
    { x: 0, y: 12, w: 6, h: 4, i: '1746', id: 1746, type: 2 },
    { x: 0, y: 16, w: 12, h: 4, i: '1837', id: 1837, type: 2 },
    { x: 6, y: 20, w: 6, h: 4, i: '1855', id: 1855, type: 2 },
    { x: 0, y: 20, w: 6, h: 4, i: '1881', id: 1881, type: 2 },
  ].map((item) => {
    return {
      ...item,
      id: item.id + '',
      // id: item.id + '',
      mark: `grid-item-${item.id}`,
    }
  })
),*/
const gridLayoutRef = ref(null)

const addNewKanBan = () => {
  const id = (+items.value.at(-1)?.id || 0) + 1
  const node = {
    // x: 0, // 初始位置 x
    // y: 0, // 初始位置 y
    // autoPosition: true,
    w: id % 2 ? 6 : 12,
    // w: 6,
    h: id % 2 ? 4 : 2,
    // h: 4,
    id: id + '',
    mark: `grid-item-${id}`,
  }
  console.log(node)
  items.value.push(node) // 将新网格项添加到数据数组中
  gridLayoutRef.value.makeLayout(node.mark)
}

const managementKanBan = () => {
  layoutManageRef.value.open(items.value)
}

const kanBanSave = (data) => {
  // 查找 差集 其中一边不存在的数据
  const differenceVals = differenceBy(data, items.value, 'id')
  items.value = data
  differenceVals.forEach((item) => {
    gridLayoutRef.value.makeLayout(item.mark)
  })
  gridLayoutRef.value.reloadLayout()
}

const save = () => {
  nextTick(() => {
    console.log(gridLayoutRef.value.getSaveLayout())
  })
}

onMounted(() => {
  gridLayoutRef.value.initLayout()
})
onActivated(() => {
  gridLayoutRef.value.initLayout()
})

defineOptions({
  name: 'Kanban',
})
</script>

<style scoped lang="scss"></style>
