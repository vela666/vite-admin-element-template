<template>
  <div class="flex-center">
    <el-popover
      v-model:visible="state.visible"
      @before-enter="show"
      @hide="hide"
      :show-arrow="showArrow"
      width="810"
      :hide-after="0"
      :show-after="0"
      :placement="placement"
      :persistent="persistent"
      :popper-class="['nd-popover-date', className].join(' ')"
      :trigger="trigger"
      :offset="offset"
      :popper-options="popperConfig">
      <template #reference>
        <div
          class="nd-date-label"
          :class="[
            showBorder ? '' : 'not-border',
            state.highlight ? 'nd-highlight' : '',
          ]">
          <div class="flex-center">
            <SvgIcon v-show="dateIcon" name="calendar1" class="c86919d fz16" />
            <span class="fz12 ml5 mr5 c545e6e">{{
              `${state.dynamicDateText || '时间筛选'}`
            }}</span>
            <el-icon
              class="fz16 c86919d nd-date-close"
              @click.stop="handleDelete"
              v-if="closeIcon && state.dynamicDateText">
              <Close />
            </el-icon>
          </div>
        </div>
      </template>
      <div class="nd-popover-date-content">
        <div class="nd-popover-date-content-t">
          <div class="c86919d fz12">日期范围</div>
          <div class="c545e6e fz14 flex-center">
            <span>
              {{
                state.dynamicDateText ||
                `${state.start}${dateSeparator}${state.end}`
              }}</span
            >
            <span v-show="!allStatic" class="ml5">
              ({{ `${state.start}${dateSeparator}${state.end}` }})
            </span>
          </div>
        </div>
        <div class="nd-popover-date-content-c">
          <div class="nd-popover-date-content-c-l">
            <div>
              <div
                @click="setDateByStr(item.type)"
                v-for="item of dateLabelList"
                :key="item.type"
                :class="{
                  'nd-shortcut-active': state.shortcutType === item.type,
                }">
                {{ item.label }}
              </div>
            </div>
          </div>
          <div class="nd-popover-date-content-c-r">
            <div class="flex-column" v-for="item of 2" :key="item">
              <el-radio-group
                @change="radioGroupChange(item)"
                v-model="
                  state[
                    item === 1
                      ? 'startStaticOrDynamicType'
                      : 'endStaticOrDynamicType'
                  ]
                ">
                <el-radio-button
                  :disabled="item === 1 && state.endStaticOrDynamicType === 2"
                  v-if="needDynamic"
                  :label="1">
                  动态时间
                </el-radio-button>
                <el-radio-button :label="2"> 静态时间</el-radio-button>
              </el-radio-group>
              <div class="nd-date-input">
                <el-icon v-if="item === 2" class="arrow-right">
                  <ArrowRight />
                </el-icon>
                <CommonInput
                  v-if="
                    state[
                      item === 1
                        ? 'startStaticOrDynamicType'
                        : 'endStaticOrDynamicType'
                    ] === 1
                  "
                  v-model="
                    state[item === 1 ? 'startDynamicInput' : 'endDynamicInput']
                  "
                  :disabled="
                    state[
                      item === 1
                        ? 'startStaticOrDynamicType'
                        : 'endStaticOrDynamicType'
                    ] === 2
                  "
                  :clearable="false"
                  @input="(v) => dateInput(v, item)"
                  desc=""
                  :prefixSlot="false" />
                <div v-else class="mr10 nd-fake-input nd-not-allowed">
                  {{ state[item === 1 ? 'start' : 'end'] }}
                </div>
                <span
                  v-show="
                    state[
                      item === 1
                        ? 'startStaticOrDynamicType'
                        : 'endStaticOrDynamicType'
                    ] === 1
                  "
                  class="ml10"
                  >天</span
                >
              </div>
              <DateRange
                @change="dateChange(item)"
                v-model="state[item === 1 ? 'start' : 'end']"
                :selectedDate="state[item === 1 ? 'end' : 'start']" />
            </div>
          </div>
        </div>
        <div class="nd-popover-date-content-b">
          <div>
            <span class="cf53f3f">
              {{ isShowInfo ? '时间跨度超过30天，可能执行失败！' : '' }}
            </span>
          </div>
          <div class="flex-center">
            <template v-if="isChecked">
              <el-checkbox v-model="state.filterDateChecked">
                <span class="c545e6e">暂存 </span>
              </el-checkbox>
              <Tooltip>
                <SvgIcon class="ml5" name="help2" />
                <template #content
                  >暂存当前筛选日期，可在不同看板中使用，退出登录或关闭浏览器将清除缓存（确认后生效）
                </template>
              </Tooltip>
            </template>
            <el-button class="skip ml20" @click="cancel"> 取消</el-button>
            <el-button type="primary" @click="apply">确认</el-button>
          </div>
        </div>
      </div>
    </el-popover>
    <slot></slot>
  </div>
</template>

<script setup>
import { watch, reactive, computed } from 'vue'
import DateRange from './DateRange.vue'
import { ArrowRight, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { dateFormat1, startDate1, endDate1, currentDate } from './date'
import {
  dateLabelEnum,
  dateTypeEnum,
  skipKey,
  dateLabelList,
  todayAndYesterday,
  kanBanFilterDate,
  dateSeparator,
} from './enum'
import dayjs from 'dayjs'
import { debounce } from 'lodash-es'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {},
  },
  showDynamic: {
    type: Boolean,
    default: true,
  },
  dateIcon: {
    type: Boolean,
    default: true,
  },
  showBorder: {
    type: Boolean,
    default: true,
  },
  // 目前只有数据看板使用
  closeIcon: {
    type: Boolean,
    default: false,
  },
  isChecked: {
    type: Boolean,
    default: false,
  },
  config: {
    type: Object,
    default: () => {},
  },
  showArrow: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: '',
  },
  // 当 popover 组件长时间不触发且 persistent 属性设置为 false 时, popover 将会被删除
  persistent: {
    type: Boolean,
    default: true,
  },
  offset: {
    type: [String, Number],
    default: 4,
  },
  trigger: {
    type: String,
    default: 'click',
  },
  placement: {
    type: String,
    default: 'bottom',
  },
  // 需要动态时间
  needDynamic: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['update:modelValue', 'show', 'hide'])
const initVal = () => {
  return {
    visible: false,
    dynamicDateText: '',
    start: skipKey.includes(props.modelValue.shortcutType)
      ? dayjs(props.modelValue.startTime).format(dateFormat1)
      : startDate1,
    end: endDate1,
    // 记录左侧快捷项类型
    shortcutType: '',
    highlight: false,
    filterDateChecked: false,
    // 动或静态类型 1是动态 2是静态
    startStaticOrDynamicType: props.needDynamic ? 1 : 2,
    startDynamicInput: 0,
    endDynamicInput: 0,
    // 动或静态类型
    endStaticOrDynamicType: props.needDynamic ? 1 : 2,
  }
}
let notConfirmed = true
let notExecute = true
const state = reactive(initVal())
const isShowInfo = computed(() => {
  return dayjs(state.end).diff(dayjs(state.start), 'day') > 30
})
const popperConfig = computed(() => {
  return {
    modifiers: [
      {
        name: 'flip',
        options: {
          padding: props.offset,
          fallbackPlacements: ['bottom', 'left'],
        },
      },
    ],
    ...props.config,
  }
})

const allStatic = computed(
  () =>
    state.startStaticOrDynamicType === 2 && state.endStaticOrDynamicType === 2,
)
const endExceedStart = computed(() =>
  dayjs(state.end).isBefore(dayjs(state.start)),
)

const show = () => {
  setDateSelected()
  state.highlight = true
  emit('show')
}

const hide = () => {
  notConfirmed &&
    setDateSelected(props.modelValue, props.modelValue.shortcutType)
  state.highlight = false
  notConfirmed = true
  emit('hide')
}

const cancel = () => {
  state.visible = false
}

const mappingParams = () => {
  const diff = allStatic.value
    ? ''
    : `${state.endStaticOrDynamicType === 1 ? state.endDynamicInput : ''}-${
        state.startStaticOrDynamicType === 1 ? state.startDynamicInput : ''
      }`
  return {
    ...props.modelValue,
    date: [state.start, state.end],
    diff,
    recentDay: diff,
    mainName: state.dynamicDateText,
    startTime: `${state.start} 00:00:00`,
    endTime: `${state.end} 23:59:59`,
    shortcutType: !props.needDynamic ? '' : state.shortcutType,
  }
}

const apply = () => {
  if (endExceedStart.value) {
    ElMessage.warning('结束日期不能小于开始日期！')
    return
  }
  const dateRange = mappingParams()
  if (props.isChecked && state.filterDateChecked) {
    // 暂存全局筛选日期
    sessionStorage.setItem(kanBanFilterDate, JSON.stringify(dateRange))
  } else {
    sessionStorage.removeItem(kanBanFilterDate)
  }
  notConfirmed = false
  emit('update:modelValue', dateRange)
  cancel()
}

// 设置动态日期显示字符串

const getDynamicDateText = (type) => {
  if (!props.needDynamic) {
    state.dynamicDateText = `${state.start}${dateSeparator}${state.end}`
    return
  }
  const startDiff = dayjs(state.start).diff(dayjs(), 'day')
  const endDiff = dayjs(state.end).diff(dayjs(), 'day')
  const startTxt =
    state.startStaticOrDynamicType === 1 ? `过去${-startDiff}天` : state.start
  // 开始是静态 且 自某日至昨日 或 自某日至今
  const isStartStatic = !!(
    state.startStaticOrDynamicType === 2 && todayAndYesterday[-endDiff]
  )

  const endTxt =
    state.endStaticOrDynamicType === 1
      ? isStartStatic
        ? todayAndYesterday[-endDiff]
        : `过去${-endDiff}天`
      : state.end

  let text = `${startTxt}${dateSeparator}${endTxt}`

  if (type && !skipKey.includes(type)) {
    text = dateTypeEnum[type]
  } else {
    // 都是动态
    if (
      state.startStaticOrDynamicType === 1 &&
      state.endStaticOrDynamicType === 1
    ) {
      if (endDiff === 0 && startDiff !== 0) {
        text = `最近${-startDiff + 1}天`
      } else if (-endDiff === 1 && -startDiff !== 1) {
        text = `过去${-startDiff}天`
      } else if (endDiff === 0 && startDiff === 0) {
        text = `今日`
      } else if (-endDiff === 1 && -startDiff === 1) {
        text = `昨日`
      } else if (-endDiff === 2 && -startDiff === 2) {
        text = `前日`
      }
    }
  }

  state.dynamicDateText = text
}

const dateChange = (val, type = '') => {
  if (val) {
    const key1 = val === 1 ? 'start' : 'end'
    const key2 = val === 1 ? 'startDynamicInput' : 'endDynamicInput'
    state[key2] = dayjs().diff(state[key1], 'day')
  } else {
    for (let i = 1; i <= 2; i++) {
      const key1 = i === 1 ? 'start' : 'end'
      const key2 = i === 1 ? 'startDynamicInput' : 'endDynamicInput'
      state[key2] = dayjs().diff(state[key1], 'day')
    }
  }
  state.shortcutType = type
  getDynamicDateText(type)
}

const dateInput = (v, i) => {
  let val = +v.replace(/\D/g, '')
  if (val > 999) {
    val = 999
  }
  const key1 = i === 1 ? 'start' : 'end'
  const key2 = i === 1 ? 'startDynamicInput' : 'endDynamicInput'
  state[key2] = val
  state[key1] = currentDate.subtract(val, 'day').format(dateFormat1)
  getDynamicDateText()
}

// 字符快捷日期设置 '昨日'、'今日'、'上周'、'本周'、'上月'、'本月'
const setDateByStr = (type, needReturnValue = false) => {
  let start = ''
  let end = ''
  if (props.needDynamic) {
    state.startStaticOrDynamicType = 1
    state.endStaticOrDynamicType = 1
  }
  const fn = {
    yesterday() {
      start = end = currentDate.subtract(1, 'day')
    },
    today() {
      start = end = currentDate
    },
    lastWeek() {
      // 获取上周一的日期
      start = currentDate.subtract(1, 'week').startOf('isoWeek')
      // 获取上周日的日期
      end = currentDate.subtract(1, 'week').endOf('isoWeek')
    },
    currentWeek() {
      // 获取本周开始的日期
      start = currentDate.startOf('isoWeek')
      end = currentDate
    },
    lastMonth() {
      start = currentDate.subtract(1, 'month').startOf('month')
      end = currentDate.subtract(1, 'month').endOf('month')
    },
    currentMonth() {
      start = currentDate.startOf('month')
      end = currentDate
    },
    past7Day() {
      start = currentDate.subtract(7, 'day')
      end = currentDate.subtract(1, 'day')
    },
    past8Day() {
      start = currentDate.subtract(8, 'day')
      end = currentDate.subtract(1, 'day')
    },
    past30Day() {
      start = currentDate.subtract(30, 'day')
      end = currentDate.subtract(1, 'day')
    },
    certainDayToYesterday() {
      if (props.needDynamic) {
        state.startStaticOrDynamicType = 2
        state.endStaticOrDynamicType = 1
      }
      start = state.start
      end = currentDate.subtract(1, 'day')
    },
    certainDayToToday() {
      if (props.needDynamic) {
        state.startStaticOrDynamicType = 2
        state.endStaticOrDynamicType = 1
      }
      start = state.start
      end = currentDate
    },
  }[type]()
  start = dayjs(start).format(dateFormat1)
  end = dayjs(end).format(dateFormat1)
  if (needReturnValue) {
    return [start, end]
  }
  state.start = start
  state.end = end
  dateChange('', type)
}

// 目前只有数据看板用
const handleDelete = (type) => {
  // state.start = startDate1
  // state.end = endDate1
  // state.dynamicDateText = ''

  // 数据看板那边调用时传  路由跳转不清空sessionStorage
  // if (type !== 'route') {
  if (state.filterDateChecked) {
    sessionStorage.removeItem(kanBanFilterDate)
  }
  emit('update:modelValue', {
    ...props.modelValue,
    date: [],
    diff: '',
    recentDay: '',
    startTime: '',
    endTime: '',
  })
}

const setDateSelected = debounce(
  (val = props.modelValue || {}, type, execute = false) => {
    val = {
      ...val,
      date: val.date
        ? val.date
        : [
            dayjs(val.startTime).format(dateFormat1),
            dayjs(val.endTime).format(dateFormat1),
          ],
      diff: (val.diff ? val.diff : val.recentDay) || '',
    }
    // 数据看板时
    if (!(Array.isArray(val.date) && val.date.length === 2)) {
      Object.keys(state).forEach((k) => {
        if (!['visible', 'highlight'].includes(k)) {
          state[k] = initVal()[k]
        }
      })
      return
    }
    let date = val.date
    // start是记录结束日期的  end是记录开始日期的
    const [start, end] = val.diff.split('-')
    // 处理动态时间
    if (start || end) {
      // 有快捷选项
      if (val.shortcutType) {
        date = setDateByStr(val.shortcutType, true)
      } else {
        const startDate = end
          ? dayjs().subtract(end, 'day').format(dateFormat1)
          : val.date[0]
        const endDate = start
          ? dayjs().subtract(start, 'day').format(dateFormat1)
          : val.date[1]
        date = [startDate, endDate]
      }
      /* if (props.needDynamic) {
        state.startStaticOrDynamicType = end ? 1 : 2
        state.endStaticOrDynamicType = start ? 1 : 2
      }*/
      state.startStaticOrDynamicType = end ? 1 : 2
      state.endStaticOrDynamicType = start ? 1 : 2
    } else {
      state.startStaticOrDynamicType = 2
      state.endStaticOrDynamicType = 2
    }
    state.start = date[0]
    state.end = date[1]
    dateChange(
      '',
      type ?? (val.shortcutType || dateLabelEnum[state.dynamicDateText]),
    )
    if (execute) {
      notExecute = false
      emit('update:modelValue', mappingParams())
    }
  },
)

const radioGroupChange = () => {
  if (state.endStaticOrDynamicType === 2) {
    state.startStaticOrDynamicType = 2
  }
  state.shortcutType = ''
  getDynamicDateText()
}

// 获取暂存的筛选日期(数据看板)
if (props.isChecked && sessionStorage.getItem(kanBanFilterDate)) {
  state.filterDateChecked = true
  const dateData = JSON.parse(sessionStorage.getItem(kanBanFilterDate))
  emit('update:modelValue', dateData)
} else {
  setDateSelected(props.modelValue, null, true)
}

watch(
  () => props.modelValue,
  (val) => {
    notExecute && setDateSelected(val, val.shortcutType)
    notExecute = true
  },
)

defineExpose({
  handleDelete,
  dynamicDateText: computed(() => state.dynamicDateText),
})
defineOptions({
  name: 'DateRangeSelect',
})
</script>
<style lang="scss">
.el-popper.nd-popover-date {
  //pointer-events: auto;
  $p: 7px 10px;
  padding: 0;
  border-radius: 4px;
  height: 543px;
  background: #fff;
  box-shadow: 0 3px 6px 1px rgba(28, 32, 40, 0.18);
  border: none;

  .nd-popover-date-content {
    height: 100%;
  }

  .nd-popover-date-content-t {
    padding: 7px 20px;
    border-bottom: 1px solid #e7e7ea;
    height: 50px;
  }

  .nd-popover-date-content-c {
    display: flex;
    padding-left: 20px;
    padding-right: 20px;
    height: 429px;
    overflow: hidden;
    border-bottom: 1px solid #e7e7ea;

    .nd-shortcut-active {
      border-color: #5473e8;
      color: #5473e8;
    }

    &-l {
      width: 211px;
      border-right: 1px solid #e7e7ea;

      > div {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        padding: 10px 20px 10px 0;

        > div {
          height: 32px;
          line-height: 32px;
          text-align: center;
          background-color: #f5f7fe;
          border-radius: 4px;
          font-size: 14px;
          color: #545e6e;
          border: 1px solid transparent;
          cursor: pointer;
          //width: calc(100% - 10px);
          width: 100%;

          &:nth-child(-n + 6) {
            //width: calc(50% - 10px);
            width: 90px;
          }

          &:hover {
            @extend .nd-shortcut-active;
          }
        }
      }
    }

    &-r {
      display: flex;
      flex: 1;
      padding: 10px 0 10px 20px;

      > div {
        flex: 1;
        gap: 15px;

        .el-input,
        .nd-fake-input {
          width: 175px;
        }
      }

      .nd-date-input {
        position: relative;

        .arrow-right {
          position: absolute;
          left: -17px;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }

  .nd-popover-date-content-b {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 20px;
    height: 64px;
  }
}
</style>

<style lang="scss" scoped>
.nd-date-label {
  display: inline-block;
  height: 32px;
  padding: 0 8px;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  //border-radius: 4px;
  border: 1px solid #cbd0d6;

  > .flex-center {
    height: 100%;
  }

  &.nd-highlight {
    border-color: #5473e8;
  }

  &:hover {
    @extend .nd-highlight;

    .nd-date-close {
      visibility: visible;
    }
  }
}

.not-border {
  border: none;
  //min-width: auto;
  padding: 0;
  height: auto;
}

.nd-date-close {
  visibility: hidden;
}
</style>
