<template>
  <div>
    <el-upload
      class="mb-10"
      drag
      :show-file-list="false"
      :with-credentials="true"
      :http-request="uploadFiles"
      :auto-upload="true"
      :file-list="fileList">
      <el-icon class="el-icon--upload"><uploadFilled /></el-icon>
      <div>点击或拖拽文件到此处上传</div>
    </el-upload>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        v-for="item of columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label">
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { onActivated, ref } from 'vue'
import { importExcel } from '@/vendor/handleExcel'

const fileList = ref([])
const columns = ref([])
const tableData = ref([])

const uploadFiles = async (params) => {
  const { excelData, excelColumns } = await importExcel(params.file)
  tableData.value = excelData
  columns.value = excelColumns
}
defineOptions({
  name: 'ImportExcel1',
})

onActivated(() => {
  console.log('ImportExcel1')
})
</script>

<style scoped></style>
