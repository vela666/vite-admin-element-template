<template>
  <main>
    <el-button @click="addNewKanBan">添加仪表</el-button>
    <el-button @click="managementKanBan">管理仪表</el-button>
    <el-button @click="save">应用</el-button>
    <br />
    <GridLayout
      @layoutChange="layoutChange"
      dragHandle="handler"
      ref="gridLayoutRef"
      v-model="items" />

    <LayoutManage :data="items" ref="layoutManageRef" @save="kanBanSave" />
  </main>
</template>

<script setup>
import { ref, onMounted, shallowRef, onActivated } from 'vue'
import 'gridstack/dist/gridstack.min.css'
import { GridStack } from 'gridstack'
import GridLayout from './components/GridLayout.vue'
import LayoutManage from './components/LayoutManage.vue'
import { debounce } from 'lodash-es'
import GridContent from './components/GridContent.vue'

const smallScope = [0, 3]

const layoutManageRef = shallowRef(null)
// const items = ref([])
// 翻转的 查找最大的y值 数据 且 Y值相等 则取最后一个
/*const findMaxYData = (arr) => {
  let maxYData = arr[0]
  let maxYIndex = 0
  for (let i = 1; i < arr.length; i++) {
    const currData = arr[i]
    if (currData.y >= maxYData.y) {
      maxYData = currData
      maxYIndex = i
    }
  }
  return { data: maxYData, index: maxYIndex }
}*/

/*
const findMaxYData = (arr) => {
  let maxYData = arr[0]
  let maxYIndex = 0

  for (let i = 1; i < arr.length; i++) {
    const currData = arr[i]
    if (currData.y > maxYData.y) {
      maxYData = currData
      maxYIndex = i
    }
  }

  return { data: maxYData, index: maxYIndex }
}
*/

const findMaxYAndSameYData = (arr) => {
  let maxY = arr[0].y
  let maxYData = [arr[0]]

  for (let i = 1; i < arr.length; i++) {
    const currData = arr[i]
    if (currData.y > maxY) {
      maxY = currData.y
      maxYData = [currData]
    } else if (currData.y === maxY) {
      maxYData.push(currData)
    }
  }

  return {
    maxY,
    maxYSameData: maxYData,
  }
}

const items = ref(
  [
    {
      id: '2132',
      w: 6,
      h: 1,
      x: 0,
      y: 0,
      data: [1, 2],
    },
    {
      id: '2134',
      w: 6,
      h: 2,
      x: 6,
      y: 0,
      data: [3, 4],
    },
  ].map((item) => {
    return {
      ...item,
      minH: item.h,
      noMove: true,
    }
  }),
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
  const id = (+items.value.at(-1)?.id || 0) + 1
  const node = {
    // x: 0, // 初始位置 x
    // y: 0, // 初始位置 y
    // autoPosition: true,
    // w: id % 2 ? 6 : 12,
    w: 6,
    // w: 6,
    h: id % 2 ? 4 : 2,
    // h: 4,
    id: id + '',
    minH: id % 2 ? 4 : 2,
  }
  /* const { maxY, maxYSameData } = findMaxYAndSameYData(cloneDeep(items.value))

  const wTotal = cloneDeep(maxYSameData).reduce((prev, curr) => {
    return 12 - (prev += curr.w)
  }, 0)

  const isW3 = maxYSameData.every((item) => item.w === 3)
  const isSmallFill = maxYSameData.every((item) => smallScope.includes(item.x))
  console.log(wTotal, maxYSameData)
  const lastVal = maxYSameData.slice(-1)[0]
  if (wTotal >= 6) {
    if (isW3) {
      if (isSmallFill) {
        node.x = 12 - wTotal
        node.y = lastVal.y
      } else {
        node.x = 0
        node.y = lastVal.h + lastVal.y
      }
    }
  } else {
    node.x = 0
    node.y = lastVal.y
    // 检查指定区域是否为空。
    const bool = gridLayoutRef.value
      .getMyGridStack()
      .isAreaEmpty(node.x, node.y, node.w, node.h)
    if (!bool) {
      node.x = 0
      node.y = lastVal.h + lastVal.y
    }
  }
  console.log(node)*/
  items.value.push(node) // 将新网格项添加到数据数组中
  gridLayoutRef.value.makeLayout(node)
}

const managementKanBan = () => {
  layoutManageRef.value.open(items.value)
}

const layoutChange = debounce((data) => {
  // console.log(items.value, 'layoutChange')
})
const kanBanSave = (data) => {
  items.value = data
  gridLayoutRef.value.reloadLayout(data)
}

const save = () => {}

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
