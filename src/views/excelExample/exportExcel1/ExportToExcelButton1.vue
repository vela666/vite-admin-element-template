<template>
  <el-button
    v-loading="loading"
    @click="handleClick"
    :disabled="disabled || loading">
    <span v-if="$slots.default"><slot></slot></span>
  </el-button>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { exportToExcel } from '@/vendor/handleExcel'

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

const handleClick = (evt) => {
  exportToExcel(props.book)
}
</script>

<style scoped></style>
