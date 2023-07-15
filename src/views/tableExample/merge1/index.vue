<template>
  <div>
    <el-cascader
      v-model="state.search.experiment"
      class="w-320 mb-10"
      @change="cascaderChange"
      :options="cascaderOption"
      :props="cascaderProps"
      collapse-tags
      filterable
      placeholder="筛选试验"
      collapse-tags-tooltip
      clearable />
    <el-table
      height="100%"
      class="n-table-custom-css"
      style="width: 100%"
      :span-method="mergeHanlder"
      :data="tableData"
      ref="tableRef"
      border>
      <el-table-column
        v-for="item of columns"
        :key="item"
        :label="item.label"
        :prop="item.prop"
        :fixed="item.fixed"
        :min-width="item.width"
        show-overflow-tooltip>
        <template #header v-if="item.prop === 'userNumRatio'">
          <span>
            {{ item.label }}
            <svg-icon
              v-tooltip="{
                hide: false,
                txt: '计算公式：命中用户数 / 用户总人数',
              }"
              name="micro1-help1" />
          </span>
        </template>
        <template #header v-else-if="item.prop === 'cfgRatio'">
          <span>
            {{ item.label }}
            <svg-icon
              v-tooltip="{
                hide: false,
                txt: '计算公式：试验层所占比例 * 受众用户百分比 * 权重',
              }"
              name="micro1-help1" />
          </span>
        </template>
        <template #default="{ row }">
          <el-button
            v-if="item.operate"
            @click="viewResults(row, 'PreDiagnosis')"
            text
            type="primary"
            >预诊结果
          </el-button>
          <el-button
            v-else-if="item.prop === 'experimentName'"
            @click="viewResults(row, 'TestDetail')"
            text
            type="primary"
            >{{ row[item.prop] }}
          </el-button>
          <template v-else>
            {{ `${row[item.prop]}${item.percent ? '%' : ''} ` }}
          </template>
        </template>
      </el-table-column>
    </el-table>
    <FlowDiagnosisDrawer ref="flowDiagnosisDrawerRef" />
  </div>
</template>

<script setup>
import { computed, watch, reactive, markRaw, ref } from 'vue'
import { uniqBy } from 'lodash-es'
import { data as reqData } from './data.json'

import FlowDiagnosisDrawer from './components/FlowDiagnosisDrawer'

const columns = [
  {
    label: '试验层',
    prop: 'layerName',
    mergeKey: 'layerId',
  },
  { label: '试验', prop: 'experimentName', mergeKey: 'experimentId' },
  { label: '试验组', prop: 'groupName' },
  {
    label: '命中用户数',
    prop: 'userNum',
  },
  { label: '模拟用户占比', percent: true, prop: 'userNumRatio' },
  { label: '配置用户占比', percent: true, prop: 'cfgRatio' },
  {
    label: '操作',
    operate: true,
    mergeKey: 'experimentId',
  },
]
const cascaderProps = { multiple: true, emitPath: false }
const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
const state = reactive({
  trafficData: {
    hit: [],
    exceptionReqNum: 0,
    requestNum: 0,
    testUserNum: 0,
  },
  // 记录已计算的行合并数据
  cache: {},
  // 记录试验及试验层相同id有多少数据
  experiment: {},
  layer: {},
  // 过滤试验
  search: {
    experiment: [],
  },
})
const flowDiagnosisDrawerRef = ref(null)
const cascaderOption = computed(() => {
  const data = uniqBy(state.trafficData.hit, 'experimentId')
  return Object.values(
    data.reduce((acc, item) => {
      const { layerName, layerId } = item
      if (!acc[layerName]) {
        acc[layerName] = {
          value: layerId,
          label: layerName,
          children: [],
        }
      }
      acc[layerName].children.push({
        label: item.experimentName,
        value: item.experimentId,
      })
      return acc
    }, {}),
  )
})
const tableData = computed(() => {
  if (state.search.experiment.length) {
    return state.trafficData.hit.filter((item) =>
      state.search.experiment.includes(item.experimentId),
    )
  }
  return state.trafficData.hit
})

const cascaderChange = () => {
  state.cache = {}
}
const mergeLine = (mergeKey = 'experimentId') => {
  if (state.cache[mergeKey]) return state.cache[mergeKey]

  let position = 0
  const rowSpanArr = tableData.value.reduce((p, item, index) => {
    if (index === 0) {
      p.push(1)
      position = 0
    } else {
      if (item[mergeKey] === tableData.value[index - 1][mergeKey]) {
        p[position] += 1 //项目名称相同，合并到同一个数组中
        p.push(0)
      } else {
        p.push(1)
        position = index
      }
    }
    return p
  }, [])
  state.cache[mergeKey] = rowSpanArr
  return rowSpanArr
}

// 当前行row、当前列column、当前行号rowIndex、当前列号columnIndex
const mergeHanlder = ({ row, column, rowIndex, columnIndex }) => {
  if (column.rawColumnKey.mergeKey && columnIndex === column.no) {
    return {
      // rowspan: 1,
      rowspan: mergeLine(column.rawColumnKey.mergeKey)[rowIndex],
      colspan: 1,
    }
  }
  /*if (columnIndex === 1 || columnIndex === 6) {
      const rowSpan = handleTableData1.value[rowIndex]
      return {
        rowspan: rowSpan, //行
        colspan: 1 //列
      }
    }*/
}

const viewResults = (row, componentName) => {
  flowDiagnosisDrawerRef.value.open(
    state.experiment[row.experimentId],
    componentName,
  )
}

const getFlowDiagnosis = () => {
  state.trafficData = markRaw(reqData)
  state.trafficData.hit.forEach((c) => {
    ;(
      state.experiment[c.experimentId] ||
      (state.experiment[c.experimentId] = [])
    ).push(c)
    ;(state.layer[c.layerId] || (state.layer[c.layerId] = [])).push(c)
  })
  console.log(state.layer)
  console.log(state.experiment)
  // 按照试验层及试验排序 把相同的放在一起
  state.trafficData.hit.sort((a, b) => {
    const aKey = `${a.layerId}${a.experimentId}`
    const bKey = `${b.layerId}${b.experimentId}`
    return aKey.localeCompare(bKey)
  })

  // 按照数据长度排序
  state.trafficData.hit.sort(
    (a, b) => state.layer[a.layerId].length - state.layer[b.layerId].length,
  )
}
getFlowDiagnosis()
defineOptions({
  name: 'Merge1',
})
</script>

<style scoped lang="scss"></style>
