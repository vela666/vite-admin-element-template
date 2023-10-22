<template>
  <!--  <CalendarRange
    class="nd-date-range"
    :disabledDate="disabledDate"
    @calendarChange="change"
    :multiple="false"
    v-model:value="dateVal"
  />-->

  <!-- @pick="change" -->
  <Calendar
    v-model:value="dateVal"
    type="date"
    :getClasses="setClass"
    :disabledDate="disabledDate"
    class="nd-date-range" />
</template>

<script setup>
import { watch, ref, computed } from 'vue'
import dayjs from 'dayjs'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import 'vue-datepicker-next/locale/zh-cn'
const {
  Calendar,
  /*CalendarRange,
  TimePanel,
  TimeRange,
  DateTime,
  DateTimeRange,*/
} = DatePicker

const formatDate = 'YYYY-MM-DD'

/*
let startDate = dayjs().subtract(7, 'day').format(formatDate)
// 计算过去7天的日期
const endDate = dayjs().format(formatDate)
*/

// toDate() 获取原生的 Date
// const value = ref([dayjs('2023-07-18').toDate(), dayjs('2023-08-30').toDate()])

const props = defineProps({
  modelValue: {
    type: String,
    // default: () => dayjs().toDate(),
    // 2023-10-15
    default: '',
  },
  disabledDate: {
    type: Function,
    default: (value, innerValue) => {
      return value.getTime() > Date.now()
    },
  },
  selectedDate: {
    type: String,
    // 2023-10-15
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])
const dateVal = computed({
  get() {
    return dayjs(props.modelValue).toDate()
  },
  set(val) {
    emit('update:modelValue', dayjs(val).format(formatDate))
    emit('change', dayjs(val).format(formatDate))
  },
})

const setClass = (value, innerValue) => {
  const a = dayjs(value).format(formatDate)
  // .startOf('day') 当天 00:00
  const b = dayjs(props.selectedDate).format(formatDate)
  // 选中的日期一致
  if (dayjs(dateVal.value).format(formatDate) === b) return ''
  if (a === b) return 'active select-date-active'
  /*
   (): 开区间，表示不包含左边界值和右边界值。例如，(3, 7) 表示大于3小于7的范围，不包括3和7。
   []: 闭区间，表示包含左边界值和右边界值。例如，[3, 7] 表示大于等于3且小于等于7的范围，包括3和7。
   [): 左闭右开区间，表示包含左边界值但不包含右边界值。例如，[3, 7) 表示大于等于3且小于7的范围，包括3但不包括7。
   (]: 左开右闭区间，表示不包含左边界值但包含右边界值。例如，(3, 7] 表示大于3小于等于7的范围，不包括3但包括7。
  */
  const isWithinRange = dayjs(a).isBetween(
    dayjs(dateVal.value),
    dayjs(b),
    'day',
    '()',
  )
  if (isWithinRange) return 'in-range'
}

defineOptions({
  name: 'DateRange',
})
</script>

<style lang="scss">
.nd-date-range {
  border: none !important;
  padding: 0 !important;
  .mx-btn {
    &:hover {
      color: #5473e8;
      border-color: #5473e8;
    }
  }

  &.mx-calendar-panel-date {
    .mx-calendar-content {
      height: auto;
    }
  }

  .mx-table-year,
  .mx-table-month {
    .cell {
      &:not(.disabled):not(.active) {
        &:hover {
          background-color: #f5f7fe;
        }
      }
      &.active {
        background-color: #5473e8;
      }
    }
  }

  .mx-table-date {
    .mx-date-row {
      > .cell {
        background-color: transparent;
        padding: 4px 0;
        &:hover {
          background-color: transparent;
        }

        > div {
          height: 32px;
          line-height: 32px;
        }

        &:not(.disabled) {
          > div {
            color: #545e6e;
            &:hover {
              background-color: #f5f7fe;
            }
          }

          &.not-current-month {
            color: currentColor;
          }
        }
        &.today {
          > div {
            color: #5473e8;
          }
        }
        &.in-range {
          > div {
            background-color: #f5f7fe;
          }
        }

        &.active {
          background-color: transparent;
          > div {
            color: #fff;
            background-color: #5473e8 !important;
            border-radius: 4px;
          }
        }

        &.select-date-active {
          > div {
            background-color: #bac6f5 !important;
          }
        }
      }
    }
    .mx-active-week {
      background-color: #f5f7fe;
    }
  }
  &.mx-calendar-week-mode .mx-date-row {
    &:hover {
      background-color: #f5f7fe;
    }
  }
}
</style>
