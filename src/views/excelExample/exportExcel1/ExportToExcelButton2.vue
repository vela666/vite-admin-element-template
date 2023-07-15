<!-- 该组件重写了el-button组件，支持el-button所有用法 -->
<!-- 1、增加了导出excel的功能：父组件通过传递book参数，将表格数据传递给本组件，由本组件负责导出为excel -->
<template>
  <el-button
    v-loading="loading"
    class="el-button"
    @click="handleClick"
    :disabled="disabled || loading">
    <span v-if="$slots.default"><slot></slot></span>
  </el-button>
</template>

<script setup>
import { ref, computed } from 'vue'
import ExcelJS from 'exceljs'
import FileSaver from 'file-saver'
import { ElMessage } from 'element-plus'
const props = defineProps({
  type: {
    type: String,
    default: 'default',
  },
  size: String,
  loading: Boolean,
  disabled: Boolean,
  book: {
    type: Object,
    default() {
      return {
        fileName: '',
        sheets: [
          {
            sheetName: '',
            sheetData: [[], [], []],
          },
        ],
      }
    },
  },
})
const emit = defineEmits(['click'])

const workbook = ref({})

// el-button原生方法
const handleClick = (evt) => {
  emit('click', evt) // 将click事件传给父组件
  exportToExcel() // 导出excel
}

// excel导出相关方法
const exportToExcel = () => {
  // 1.创建工作簿
  createWorkBook()
  // 2.创建工作表
  const promise = []
  props.book.sheets.forEach((sheet) => {
    promise.push(createWorkSheet(sheet.sheetName, sheet.sheetData))
  })
  Promise.all(promise)
  // 3.下载excel表格
  downloadExcel()
}

const createWorkBook = () => {
  workbook.value = new ExcelJS.Workbook()
  workbook.value.created = new Date()
  workbook.value.modified = new Date()
  workbook.value.lastPrinted = new Date()
}

// 设置换行样式
const wrapTextAlignment = {
  vertical: 'middle',
  // horizontal: 'center',
  // 将单元格设置为自动换行
  wrapText: true,
}

const createWorkSheet = (sheetName, sheetData) => {
  const workSheet = workbook.value.addWorksheet(sheetName)
  // workSheet.defaultColWidth = 100

  // 将数据添加到工作表中
  sheetData.forEach((rowData) => {
    const row = workSheet.addRow(rowData)
    row.eachCell({ includeEmpty: true }, (cell, colIndex) => {
      cell.alignment = wrapTextAlignment
    })
  })

  // 设置列宽
  /*workSheet.columns.forEach((column) => {
    column.eachCell({ includeEmpty: true }, (cell) => {
      const columnWidth = Math.max(
        column.width || 0,
        cell.value ? cell.value.toString().length + 2 : 10,
      )
      column.width = columnWidth
    })
  })*/
  // workSheet.addRows(sheetData);
}
const downloadExcel = async () => {
  try {
    let buffer = await workbook.value.xlsx.writeBuffer()
    FileSaver.saveAs(
      new Blob([buffer]),
      `${props.book.fileName}_${Date.now()}.xlsx`,
    )
  } catch (err) {
    ElMessage.error(`excel导出失败，原因为：${err}`)
  }
}
</script>

<style scoped></style>
