<template>
  <div
    @click="showPopover(true)"
    class="c616161"
    :class="{
      active: visible && needStage,
      'event-date-comparison': needStage,
      'kanban-comparison': !needStage,
      'kanban-comparison-active': !needStage && modelValue.length,
    }">
    <el-popover
      popper-class="event-date-comparison-popover"
      placement="bottom-start"
      width="310"
      :offset="offset"
      :visible="visible"
      :show-arrow="false">
      <div class="stage-content">
        <div>
          <div
            v-for="(item, index) of stageList"
            :key="index"
            class="stage-list">
            <div class="flex-center gap10">
              <span class="fz14 c616161">阶段{{ index + 1 }} </span>
              <DateRangeSelect
                :ref="(el) => setRefs(el, index)"
                v-model="stageList[index]" />
              <SvgIcon
                @click="delStage(index)"
                name="delete1"
                class="fz14 c-pointer c545e6e" />
            </div>
          </div>
        </div>
        <div class="flex-center flex-between">
          <el-button
            :style="[
              `visibility:${stageList.length === 2 ? 'hidden' : 'visible'}`,
              'transition: none',
            ]"
            :disabled="stageList.length === 2"
            @click="addStage"
            text
            class="fz14">
            +添加阶段
          </el-button>
          <div>
            <el-button @click="cancel"> 取消 </el-button>
            <el-button @click="apply" type="primary"> 应用 </el-button>
          </div>
        </div>
      </div>
      <template #reference>
        <div class="flex-center gap10">
          <span>VS</span>
          <div class="stage flex-center" v-if="modelValue.length && needStage">
            {{
              modelValue.length > 1
                ? `${modelValue.length}个阶段`
                : modelValue[0].mainName
            }}
            <el-icon @click.stop="clearStage" class="fz12 ml5 c-pointer"
              ><Close
            /></el-icon>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { cloneDeep, debounce } from 'lodash-es'
import { Close } from '@element-plus/icons-vue'
import { startDate1, endDate1 } from '../date'
import DateRangeSelect from '../index.vue'
/*
{
    "timeZone": "8",
    "timeParticle": "day",
    "recentDay": "1-7",
    "startTime": "2023-10-11 00:00:00",
    "endTime": "2023-10-17 23:59:59",
    "graphType": 1,
    "versus": [
        {
            "date": [
                "2023-10-09",
                "2023-10-15"
            ],
            "diff": "3-9",
            "mainName": "过去9天-过去3天",
            "startTime": "2023-10-09 00:00:00",
            "endTime": "2023-10-15 23:59:59",
            "tableCurrentSelectionStage": true
        }
    ]
}
vs对比组件
<DateDropDown v-model="value">
    <EventComparison v-model="value.versus" />
</DateDropDown>
*/

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  // 需要显示已选阶段
  needStage: {
    type: Boolean,
    default: true,
  },
  offset: {
    type: [String, Number],
    default: 8,
  },
})
const emit = defineEmits(['update:modelValue', 'apply'])
const visible = ref(false)
const stageList = ref([])
const dateDropDownRefs = ref({})
const setRefs = (el, name) => {
  dateDropDownRefs.value[name] = el
}
const defaultStage = () => {
  return {
    // 过去七天
    date: [startDate1, endDate1],
    diff: '1-7',
    // 如过去多少N天 等
    mainName: '',
    startTime: startDate1 + ' 00:00:00',
    endTime: endDate1 + ' 23:59:59',
  }
}
const clearStage = () => {
  emit('update:modelValue', [])
  emit('apply')
}
const delStage = (index) => {
  stageList.value.splice(index, 1)
}

const mappingParams = () => {
  return stageList.value.map((item, index) => {
    return {
      ...item,
      startTime: item.date[0] + ' 00:00:00',
      endTime: item.date[1] + ' 23:59:59',
      mainName: dateDropDownRefs.value[index]?.dynamicDateText,
      tableCurrentSelectionStage: index === 0,
    }
  })
}

const showPopover = (bool = false) => {
  visible.value = bool
  stageList.value = cloneDeep(props.modelValue)
  if (bool) {
    if (!stageList.value.length) stageList.value.push(defaultStage())
    document.body.setAttribute('style', 'pointer-events: none;')
  } else {
    document.body.removeAttribute('style')
  }
}
const addStage = () => {
  stageList.value.push(defaultStage())
}
// 取消
const cancel = () => {
  // stageList.value = []
  showPopover()
}

const apply = () => {
  emit('update:modelValue', mappingParams())
  emit('apply')
  showPopover()
}

showPopover()

// 仅初始化执行
const stopWatch = watch(
  stageList,
  debounce(() => {
    stopWatch()
    if (!Object.keys(props.modelValue).length) return
    emit('update:modelValue', mappingParams())
  }),
  {
    deep: true,
  }
)
defineOptions({
  name: 'EventComparison',
})
</script>
<style lang="scss">
.event-date-comparison-popover {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  border-radius: 2px;
  padding: 0 !important;
  border: none;
  pointer-events: auto;

  & ~ .nd-popover-date {
    pointer-events: auto;
  }
}
</style>
<style scoped lang="scss">
.event-date-comparison {
  height: 32px;
  //width: 35px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #cbd0d6;
  cursor: pointer;
}
.kanban-comparison {
  width: 24px;
  height: auto;
  font-size: 12px;
  margin-top: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    color: #5473e8;
  }
}
.kanban-comparison-active {
  background-color: #f0f2f5;
}

.stage {
  //width: 76px;
  height: 22px;
  padding: 0 5px;
  color: #616161;
  line-height: 22px;
  background: #f0f2f5;
  border-radius: 2px;
}

.stage-content {
  > div {
    padding: 20px;

    &:first-of-type {
      > div {
        &:first-of-type {
          margin-bottom: 10px;
        }
      }
      &:empty {
        text-align: center;
        color: #616161;
        &::after {
          content: '暂无对比阶段';
        }
      }
    }

    &:last-of-type {
      border-top: 1px solid #dedede;
      height: 50px;
    }
  }
}

.active {
  //background-color: #ecf6ff;
  border-color: #5473e8;
  //color: #409eff;
}
</style>
