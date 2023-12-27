<template>
  <div class="select-range-time">
    <div class="range-time-header">
      <div class="range-time-week">星期 / 时间</div>
      <div class="range-time-day">
        <div>00:00-12:00</div>
        <div>12:00-24:00</div>
        <div class="range-time-items">
          <span v-for="item in 24" :key="item">{{ item - 1 }}</span>
        </div>
      </div>
    </div>

    <div class="range-time-body">
      <div class="range-time-weeks">
        <span v-for="item in 7" :key="item">{{ state.weeks[item - 1] }}</span>
      </div>
      <div
        ref="rangeTimeItemsRef"
        @mousedown="handleMousedown"
        @mousemove="handleMousemove"
        @mouseup="handleMouseup"
        @mouseleave="handleMouseleave"
        class="range-time-items">
        <span
          v-for="item in state.rangeTimes"
          :key="item.index"
          :data-index="item.index"
          :data-row="item.row"
          :data-column="item.column"
          :class="{ 'range-time-active': item.active }"></span>
      </div>
    </div>

    <div class="range-time-tools">
      <span>已选择时间段</span>
      <el-button
        text
        :disabled="state.rangeTimesChecked.length === 0"
        @click="handleClear"
        >清空已选</el-button
      >
    </div>

    <template v-for="(week, index) in state.rangeTimesChecked" :key="index">
      <div v-if="week.length > 0" class="range-time-checked">
        <div>{{ state.weeks[index] }}</div>
        <div>
          <template v-for="item in week" :key="item.index">
            <span v-if="item.length === 1"
              >{{ `${item[0].column}`.padStart(2, '0') }}:00-{{
                `${item[0].column + 1}`.padStart(2, '0')
              }}:00</span
            >
            <span v-if="item.length === 2"
              >{{ `${item[0].column}`.padStart(2, '0') }}:00-{{
                `${item[1].column + 1}`.padStart(2, '0')
              }}:00</span
            >
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: [],
  },
})
const emit = defineEmits(['update:modelValue', 'change'])
const state = reactive({
  weeks: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
  downIndex: -1, // 按下鼠标节点
  upIndex: -1, // 松开鼠标节点
  rangeTimes: new Array(24 * 7).fill(null).map((item, index) => ({
    active: false,
    index: index,
    row: Math.floor(index / 24),
    column: index % 24,
  })),
  rangeTimesChecked: [],
  rangeTimeItemsRef: null,
})
/**
 * @description
 * @author fengjin
 * @date 2022-07-11 19:17:34
 */
const handleChecked = (value) => {
  const weeks = state.weeks.map(() => [[]])
  value.forEach((item) => {
    if (item.active) {
      const week = weeks[item.row].pop()
      if (week.length === 2) week.pop()
      week.push(item)
      weeks[item.row].push(week)
    } else {
      weeks[item.row].push([])
    }
  })
  const checkedWeeks = weeks.filter(
    (item) => item.filter((item) => item.length > 0).length > 0,
  )

  emit(
    'update:modelValue',
    checkedWeeks
      .map((item) => {
        const modelValue = []
        item.forEach((item) => {
          if (item.length === 1) {
            modelValue.push({
              days: [item[0].row === 6 ? 0 : item[0].row + 1],
              start_minute: item[0].column * 60, // 一天的开始分钟数
              end_minute: (item[0].column + 1) * 60, // 一天的结束分钟数
            })
            return
          }
          if (item.length === 2) {
            modelValue.push({
              days: [item[0].row === 6 ? 0 : item[0].row + 1],
              start_minute: item[0].column * 60, // 一天的开始分钟数
              end_minute: (item[1].column + 1) * 60, // 一天的结束分钟数
            })
          }
        })
        return modelValue
      })
      .flat(),
  )
  emit('change')

  return checkedWeeks
}

/**
 * @description 按下鼠标
 * @author fengjin
 * @date 2022-07-08 18:26:54
 */
const handleMousedown = (e) => {
  e.preventDefault()
  state.downIndex = parseInt(e.target.dataset.index)
  state.rangeTimes[state.downIndex].active =
    !state.rangeTimes[state.downIndex].active
}

/**
 * @description 鼠标移动
 * @author fengjin
 * @date 2022-07-11 11:10:27
 */
const handleMousemove = (e) => {
  if (!e.target.dataset.index) return
  e.preventDefault()
  const downIndex = state.downIndex
  if (downIndex > -1) {
    const currentIndex = parseInt(e.target.dataset.index)
    const down = state.rangeTimes[downIndex]
    const current = state.rangeTimes[currentIndex]
    if (downIndex < currentIndex) {
      const rangeTimes = state.rangeTimes.slice(downIndex, currentIndex + 1)

      rangeTimes.forEach((item) => {
        if (
          item.row >= down.row &&
          item.row <= current.row &&
          item.column >= down.column &&
          item.column <= current.column
        ) {
          item.active = rangeTimes[0].active
        }
      })
    } else {
      const rangeTimes = state.rangeTimes.slice(currentIndex, downIndex + 1)

      rangeTimes.forEach((item) => {
        if (
          item.row <= down.row &&
          item.row >= current.row &&
          item.column <= down.column &&
          item.column >= current.column
        ) {
          item.active = rangeTimes[rangeTimes.length - 1].active
        }
      })
    }
  }
}

/**
 * @description 松开鼠标
 * @author fengjin
 * @date 2022-07-08 18:29:07
 */
const handleMouseup = (e) => {
  e.preventDefault()
  state.downIndex = -1
  state.rangeTimesChecked = handleChecked(state.rangeTimes)
}

/**
 * @description 鼠标移出
 * @author fengjin
 * @date 2022-07-11 11:15:56
 */
const handleMouseleave = (e) => {
  e.preventDefault()
  if (state.downIndex > -1)
    state.rangeTimesChecked = handleChecked(state.rangeTimes)
  state.downIndex = -1
}

/**
 * @description 清空已选
 * @author fengjin
 * @date 2022-07-12 09:43:28
 */
const handleClear = () => {
  state.rangeTimesChecked = []
  state.rangeTimes = new Array(24 * 7).fill(null).map((item, index) => ({
    active: false,
    index: index,
    row: Math.floor(index / 24),
    column: index % 24,
  }))
  emit('update:modelValue', [])
  emit('change')
}
</script>

<style scoped lang="scss">
.select-range-time {
  width: 32px * 24 + 80px + 2px;
  border: 1px solid #dedede;
  border-radius: 2px;
  font-size: 12px;

  .range-time-items {
    display: flex;
    flex-wrap: wrap;
    width: 32px * 24;

    > span {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      border-top: 1px solid #dedede;
      border-left: 1px solid #dedede;
      box-sizing: border-box;
    }
  }

  .range-time-header {
    display: flex;
    justify-content: space-between;

    > .range-time-week {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      height: 64px;
    }

    > .range-time-day {
      display: flex;
      flex-wrap: wrap;
      width: 32px * 24;

      > div:not(.range-time-items) {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 32px;
        width: 50%;
        border-left: 1px solid #dedede;
        box-sizing: border-box;
      }
    }
  }

  .range-time-body {
    display: flex;
    border-bottom: 1px solid #dedede;

    > .range-time-weeks {
      width: 80px;

      > span {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 32px;
        border-top: 1px solid #dedede;
      }
    }

    > .range-time-items {
      width: 32px * 24;
      color: #fff;

      > span {
        background-color: #f5f5f5;
        cursor: pointer;

        &.range-time-active {
          background-color: #5473e8;
        }
      }
    }
  }

  .range-time-tools {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    height: 32px;
    color: #8a8a8a;

    & + .range-time-checked {
      margin-top: 10px;
    }
  }

  .range-time-checked {
    display: flex;
    margin-bottom: 10px;
    line-height: 1.3;

    > div:first-child {
      flex-shrink: 0;
      width: 80px;
      text-align: center;
      color: #8a8a8a;
    }

    > div:last-child {
      flex-grow: 1;
      display: flex;
      flex-wrap: wrap;

      > span {
        margin-right: 5px;

        &:not(:last-child):after {
          content: '、';
        }
      }
    }
  }
}
</style>
