<template>
  <div>
    <ExportToExcelButton1 :book="book">
      导出excel-使用wokrer
    </ExportToExcelButton1>
    <ExportToExcelButton2 :book="book">
      导出excel-未使用wokrer
    </ExportToExcelButton2>
  </div>
</template>

<script setup>
import { onActivated, ref } from 'vue'
import ExportToExcelButton1 from './ExportToExcelButton1'
import ExportToExcelButton2 from './ExportToExcelButton2'
import { header, data } from './data.json'
const book = ref({
  fileName: 'Demo',
  sheets: [
    {
      sheetName: 'sheet1',
      sheetData: [header, ...data],
    },
    /*{
      sheetName: 'sheet1',
      sheetData: [
        ['2023-05-21\n2023-05-28', 'A2', 'A3'],
        ['A2', 'B2'],
        ['A3', 'B3', 'C3'],
      ],
    },
      {
      sheetName: 'sheet2',
      sheetData: [['A1', 'B1', 'C1'], ['A2', 'B2'], ['A3']],
    },*/
  ],
})

defineOptions({
  name: 'ExportExcel1',
})
onActivated(() => {
  console.log('ExportExcel1')
})
</script>

<style scoped></style>
