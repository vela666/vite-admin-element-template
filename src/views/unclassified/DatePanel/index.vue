<template>
  <CalendarRange
    :disabledDate="disabledDate"
    @calendarChange="change"
    :multiple="false"
    v-model:value="value" />
</template>

<script setup>
import { computed, watch, reactive, ref, onActivated } from 'vue'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import 'vue-datepicker-next/locale/zh-cn'
import dayjs from 'dayjs'
const {
  Calendar,
  CalendarRange,
  TimePanel,
  TimeRange,
  DateTime,
  DateTimeRange,
} = DatePicker

// toDate() 获取原生的 Date
const value = ref([dayjs('2023-07-18').toDate(), dayjs('2023-08-30').toDate()])
watch(value, (v) => {
  console.log(v)
})
const change = (val) => {
  console.log(val)
}
const disabledDate = (value, innerValue) => {
  // return value.getTime() > Date.now()
  return false
}
defineOptions({
  name: 'DatePanel',
})

onActivated(() => {
  console.log('DatePanel')
})
</script>

<style lang="scss">
.mx-date-row {
  > .cell {
    background-color: transparent !important;
    padding: 4px 0 !important;
    > div {
      height: 32px;
      line-height: 32px;
    }
    &.in-range {
      > div {
        background-color: #f2f6fc;
      }
    }

    &.active {
      padding: 4px 0 !important;
      background-color: transparent;
      > div {
        background-color: #1284e7;
      }
    }
  }
}
</style>
