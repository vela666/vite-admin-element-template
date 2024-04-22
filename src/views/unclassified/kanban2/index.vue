<template>
  <main>
    <el-button @click="addNewKanBan">添加仪表</el-button>
    <el-button @click="managementKanBan">管理仪表</el-button>
    <el-button @click="save">应用</el-button>
    <br />
    <GridLayout dragHandle=".handler" ref="gridLayoutRef" v-model="items">
      <template #default="{ item }">
        <Test />
        <el-button @click="updateData(item, 3)">更新小图</el-button>
        <el-button @click="updateData(item, 6)">更新中图</el-button>
        <el-button @click="updateData(item, 12)">更新大图</el-button>
      </template>
    </GridLayout>
    <LayoutManage :data="items" ref="layoutManageRef" @save="kanBanSave" />
  </main>
</template>

<script setup>
import { ref, nextTick, onMounted, shallowRef, onActivated } from 'vue'
import 'gridstack/dist/gridstack.min.css'
import GridLayout from './components/GridLayout.vue'
import LayoutManage from './components/LayoutManage.vue'
import { differenceBy } from 'lodash-es'
import Test from './Test.vue'
const layoutManageRef = shallowRef(null)
// const items = ref([])
const items = ref(
  [
    {
      id: 'qlvtylruq992at3',
      w: 3,
      h: 2,
      x: 6,
      y: 0,
      type: 2,
    },
    {
      id: '30',
      w: 3,
      h: 2,
      x: 9,
      y: 0,
      type: 2,
    },
    {
      id: '2711',
      w: 3,
      h: 2,
      x: 8,
      y: 2,
      type: 2,
    },
    {
      id: 'qlvtylrnyo58rk2',
      w: 12,
      h: 4,
      x: 0,
      y: 4,
      type: 2,
    },
  ].map((item) => {
    return {
      ...item,
      // noResize: false,
      // minH: item.minH ?? item.h,
      mark: `grid-item-${item.id}`,
      // maxH: 8,
    }
  })
)
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
  const id = self.crypto.randomUUID()
  const node = {
    // x: 0, // 初始位置 x
    // y: 0, // 初始位置 y
    // autoPosition: true,
    w: 6,
    // w: 6,
    // h: id % 2 ? 4 : 2,
    // h: 4,
    id,
    mark: `grid-item-${id}`,
    // x: 0, // 初始位置 x
    // y: 0, // 初始位置 y
    // autoPosition: true,
    // w: id % 2 ? 6 : 12,
    minH: 4,
  }
  items.value.push(node) // 将新网格项添加到数据数组中
  gridLayoutRef.value.makeLayout(node.mark)
}

const managementKanBan = () => {
  layoutManageRef.value.open(items.value)
}

const updateData = (data, size) => {
  data.w = size
  data.h = size === 3 ? 2 : 4
  // 暂无处理中图的x计算
  gridLayoutRef.value.update(data.mark, {
    ...data,
    w: size,
    h: size === 3 ? 2 : 4,
    // x: 6,
    x: [12, 6].includes(size) ? 0 : data.x,
  })

  console.log(data)
}

const kanBanSave = (data) => {
  // 查找 差集 其中一边不存在的数据
  const differenceVals = differenceBy(data, items.value, 'id')
  items.value = data
  differenceVals.forEach((item) => {
    gridLayoutRef.value.makeLayout(item.mark)
  })
  gridLayoutRef.value.reloadLayout(data)
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
