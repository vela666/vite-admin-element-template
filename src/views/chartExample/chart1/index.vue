<template>
  <div>
    <vxe-grid ref="xGrid" v-bind="gridOptions">
      <template #toolbar_buttons>11 </template>
      <template #title="{ column }">
        <span class="event-stage-label">
          <span
            class="txt-left"
            v-for="(label, index) of dataSegmentation(column.title)"
            :key="index">
            {{ label }}
          </span>
        </span>
      </template>
      <template #default="item">
        <div
          :class="{ 'flex-center': item.column.params.showDiff }"
          class="w100-percentage ju-be">
          <div class="flex-center flex-direction-column">
            <span
              v-for="(stageVal, stageIndex) of dataSegmentation(
                item.row[item.column.field],
              )"
              :key="stageIndex">
              {{ thousandsFilter(stageVal) }}
            </span>
          </div>
          <!--  差异率  -->
          <template v-if="item.column.params.showDiff">
            <span
              v-if="!isNaN(diffCalculation(item.row[item.column.field]))"
              class="align-self-end"
              :class="[
                diffCalculation(item.row[item.column.field]) >= 0
                  ? 'c-129b76'
                  : 'c-e84d37',
              ]">
              {{
                `${
                  diffCalculation(item.row[item.column.field]) >= 0 ? '+' : ''
                }${diffCalculation(item.row[item.column.field])}`
              }}%
            </span>
            <span class="align-self-end" v-else>{{
              diffCalculation(item.row[item.column.field])
            }}</span>
          </template>
        </div>
      </template>
    </vxe-grid>
  </div>
</template>

<script setup>
import { computed, watch, reactive, ref, nextTick } from 'vue'
import colums from './colums.json'
import tableData from './table.json'
const delimiter = '\n'

const gridOptions = reactive({
  border: true,
  showHeaderOverflow: true,
  showOverflow: true,
  height: '600',
  loading: false,
  columnConfig: {
    resizable: true,
  },
  autoResize: true,
  toolbarConfig: {
    slots: {
      buttons: 'toolbar_buttons',
    },
  },
  checkboxConfig: {
    checkField: 'checked',
  },
})

const xGrid = ref()

// 数据以某个符号分割为数组
const dataSegmentation = (data = '', key = delimiter) => {
  return data.split(delimiter)
}
// 表格差异率计算
const diffCalculation = (data) => {
  let [num1, num2] = dataSegmentation(data).map((item) =>
    Number.parseFloat(item),
  )
  let val = (((num1 - num2) / (num2 === 0 ? 100 : num2)) * 100).toFixed(2)
  if (isNaN(val)) return '-'
  return val
}

const loadColumnAndData = (colSize, rowSize) => {
  gridOptions.loading = true
  nextTick(() => {
    // 使用函数式加载
    xGrid.value.reloadColumn(
      colums.map((item, index) => ({
        ...item,
        minWidth: 180,
        slots: {
          default: 'default',
          header: 'title',
        },
        params: {
          showDiff: index >= 3,
        },
      })),
    )
    xGrid.value.reloadData(tableData)
    gridOptions.loading = false
  })
}
const test = (val, item) => {
  console.log({ val })
}

function thousandsFilter(cellValue) {
  if (typeof cellValue === 'number') {
    if (cellValue > 999 || cellValue < -999) {
      const newVal = cellValue.toLocaleString('en-us', {
        maximumSignificantDigits: 20,
      })
      return newVal // 传入数字，返回字符串
    } else {
      return cellValue
    }
  } else {
    return cellValue
  }
}

nextTick(() => {
  loadColumnAndData(600, 10)
})

defineOptions({
  name: 'Chart1',
})
</script>

<style scoped lang="scss">
.flex-center {
  display: flex;
  align-items: center;
}
.event-stage-label {
  display: flex;
  flex-direction: column;
  line-height: 17px;
}
.w100-percentage {
  width: 100%;
}
.ju-be {
  justify-content: space-between;
}
.flex-direction-column {
  flex-direction: column;
}
.align-self-end {
  align-self: flex-end;
}
.c-e84d37 {
  color: #e84d37;
}
.c-129b76 {
  color: #129b76;
}
</style>
