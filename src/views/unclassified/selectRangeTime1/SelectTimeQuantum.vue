<template>
  <div class="week-plan-time-wrap">
    <div class="tool-tips clearfix" :style="{ maxWidth: boxwidths }">
      <el-button
        size="default"
        type="danger"
        class="fr"
        plain
        icon="Delete"
        @click.stop="resetForm"
        >清空</el-button
      >
    </div>
    <div class="scroll-box">
      <div class="week-plan-time" :style="{ width: boxwidths }">
        <div class="az-time-list">
          <ul ref="timeContainer">
            <li v-for="index in 24" :key="index">{{ index - 1 }}</li>
          </ul>
        </div>
        <div :ref="weekId" class="az-week-list">
          <div v-for="(item, index) in weekList" :key="index" class="week-item">
            <span class="label">{{ item[props.label] }}</span>
            <div
              class="time-swiper"
              @mousedown.stop="
                (event) =>
                  mousedownStart(event, [
                    index,
                    item[props.timeList].length - 1,
                  ])
              ">
              <s v-for="ind in 24" :key="ind" class="chunk"></s>
              <el-popover
                placement="top"
                v-for="(time, ind) in item[props.timeList]"
                :key="ind + '_'"
                v-model:visible="time.popovisible"
                trigger="click"
                width="240">
                <template #reference>
                  <div
                    class="slider-time"
                    :class="{
                      active: activeTime[0] == index && activeTime[1] == ind,
                    }"
                    :style="{ width: time.width, left: time.pointX }">
                    <div
                      class="content"
                      :style="{ background: time.style }"
                      @mousedown.stop="
                        (event) =>
                          arrowsStart(event, time, 'content', [index, ind])
                      "></div>
                    <div
                      v-if="activeTime[0] == index && activeTime[1] == ind"
                      class="left-arrows arrows"
                      @mousedown.stop="
                        (event) => arrowsStart(event, time, 'start')
                      ">
                      <i class="el-icon-caret-bottom">
                        <el-icon><CaretBottom /></el-icon>
                      </i>
                      <i class="el-icon-caret-top">
                        <el-icon><CaretTop /></el-icon>
                      </i>
                    </div>
                    <div
                      v-if="activeTime[0] == index && activeTime[1] == ind"
                      class="right-arrows arrows"
                      @mousedown.stop="
                        (event) => arrowsStart(event, time, 'end')
                      ">
                      <i class="el-icon-caret-bottom">
                        <el-icon><CaretBottom /></el-icon>
                      </i>
                      <i class="el-icon-caret-top">
                        <el-icon><CaretTop /></el-icon>
                      </i>
                    </div>
                  </div>
                </template>
                <!-- 加上该参数设置 :teleported="false"，解决选中时间段后el-popover弹窗会自动关闭的问题 -->
                <div class="detail-box">
                  <el-time-picker
                    v-model="time.RangeTime"
                    :clearable="false"
                    style="width: 100%"
                    is-range
                    range-separator="-"
                    format="HH:mm:ss"
                    value-format="HH:mm:ss"
                    :teleported="false"
                    @change="(value) => timeChange(value, time)" />
                  <div
                    class="btn-box"
                    style="text-align: right; margin-top: 10px">
                    <el-button
                      v-if="clickbtn.visible"
                      type="success"
                      @click.stop="reservedfun(time, ind)"
                      >{{ clickbtn.title }}</el-button
                    >
                    <el-button
                      type="danger"
                      @click.stop="deleteTime(index, ind)"
                      >删除</el-button
                    >
                    <el-button type="primary" @click.stop="saveTime(time)"
                      >确定</el-button
                    >
                  </div>
                </div>
              </el-popover>
            </div>
            <el-popover
              placement="left"
              width="350"
              trigger="click"
              v-model:visible="item.popovisible"
              append-to-body="false">
              <template #reference>
                <span class="copy-btn" @click.stop="actionCopy(index)">
                  <el-icon><DocumentCopy /></el-icon>
                </span>
              </template>
              <p>复制到</p>
              <p>
                <el-checkbox
                  v-model="checkAll"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAllChange"
                  >全选</el-checkbox
                >
                <el-checkbox-group
                  v-model="copyList"
                  @change="handleCheckedCitiesChange">
                  <el-checkbox
                    v-for="(val, i) in weekList"
                    :key="i + '__'"
                    :disabled="val.disabled"
                    :label="i"
                    >{{ val[props.label] }}</el-checkbox
                  >
                </el-checkbox-group>
              </p>
              <div class="text-right">
                <el-button type="danger" @click="closePopover(index)"
                  >取消</el-button
                >
                <el-button type="primary" @click="confirmCopy(index)"
                  >确认</el-button
                >
              </div>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  reactive,
  toRefs,
  defineProps,
  onMounted,
  watch,
  onUpdated,
  ref,
} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep as deepClone } from 'lodash-es'
const emit = defineEmits(['change', 'reserved'])
const prop = defineProps({
  weekList: {
    type: Array,
    default() {
      return []
    },
  },
  width: {
    type: String,
    default: '454px',
  },
  clickbtn: {
    type: Object,
    default() {
      return {
        visible: false,
        title: '预留按钮',
      }
    },
  },
  periodNum: {
    type: Number,
    default: 5,
  },
})

const state = reactive({
  timeLevel: 'ss',
  width: prop.width,
  weekId: 'week' + new Date().getTime(),
  boxwidths: '',
  weekList: prop.weekList,
  props: {
    label: 'label',
    timeList: 'timeList',
    startTime: 'startTime',
    endTime: 'endTime',
  },
  // 是否重复选择(即多个时间段有重叠部分)
  repeat: false,
  copyList: [],
  checkAll: false,
  isIndeterminate: false,
  // 当前激活对象
  activeTime: [],
  // 组件操作对象
  temp: undefined,
  // 拖拽节点
  dageDom: '',
  secondWidth: '', // 1秒对应的容器总宽度
  // 判断是否鼠标点下
  ifDrag: false,
  // 预留按钮
  clickbtn: prop.clickbtn,
  // 数据是否有所改变
  dataChange: false,
  // 一天允许选择时间段个数
  periodNum: prop.periodNum,
})
const resetForm = () => {
  ElMessageBox.confirm('此操作将清空当前所有已选时段, 是否继续?', '警告', {
    confirmButtonText: '确 定',
    cancelButtonText: '取 消',
    type: 'warning',
  })
    .then(() => {
      state.weekList.forEach((value) => {
        value[state.props.timeList] = []
      })
      state.temp = undefined
      state.dageDom = ''
      state.ifDrag = false
      state.activeTime = []
      state.copyList = []
      state.checkAll = false
      state.isIndeterminate = false
      listenerChange()
    })
    .catch(() => ElMessage.info('已取消清空'))
}
const {
  timeLevel,
  weekId,
  weekList,
  props,
  repeat,
  copyList,
  checkAll,
  isIndeterminate,
  activeTime,
  temp,
  dageDom,
  secondWidth,
  ifDrag,
  boxwidths,
  clickbtn,
} = toRefs(state)

const initFormatData = () => {
  // 重置参数
  state.temp = undefined
  state.dageDom = ''
  state.ifDrag = false
  state.activeTime = []
  state.copyList = []
  state.checkAll = false
  state.isIndeterminate = false
  // 格式化数据  转化成组件可操作格式
  state.weekList.forEach((value) => {
    if (value[state.props.timeList] && value[state.props.timeList].length) {
      value[state.props.timeList].forEach((val) => {
        val.pointX = ''
        val.r_width = ''
        val.r_pointX = ''
        val.width = ''
        val.startX = ''
        val.endX = ''
        val.id = ''
        val.temporary = false
        val.popovisible = false
        val.style = randomRgb()
        val.RangeTime = [val[state.props.startTime], val[state.props.endTime]]
        // 计算时段宽度
        let st = formatSecond(val[state.props.startTime])
        let et = formatSecond(val[state.props.endTime])
        console.log({
          st,
          et,
        })
        val.width = (et - st) * state.secondWidth + 'px'
        // 计算时段定位
        val.pointX = st * state.secondWidth + 'px'
      })
      // 按起始时间重新排序
      value[state.props.timeList].sort((a, b) => {
        return a.pointX.replace('px', '') * 1 - b.pointX.replace('px', '') * 1
      })
    }
  })
}
const formatSecond = (time) => {
  if (!time) return
  let t = time.split(':')
  console.log(t)
  if (state.timeLevel === 'mm') {
    if (t.length !== 2) return
    // 去除前缀0
    let ht = t[0].replace(/^0/, '')
    let mt = t[1].replace(/^0/, '')
    return ht * 60 * 60 + mt * 60
  } else {
    // 去除前缀0
    let ht = t[0].replace(/^0/, '')
    let mt = t[1].replace(/^0/, '')
    let st = t[2].replace(/^0/, '')
    return ht * 60 * 60 + mt * 60 + +st
  }
}

const mousedownStart = (event, action) => {
  /* if (action[1] > state.periodNum - 2) {
    ElMessage.warning('只允许选择' + state.periodNum + '个时间段！')
    return false
  }*/
  state.dageDom = 'addTime'
  let temp = {
    pointX: event.layerX + 'px', // 时段定位
    r_width: '', // 备份
    r_pointX: '', // 备份
    width: `${state.secondWidth}px`, // 时段宽度
    startX: '', // 操作时鼠标点击起始点位置
    endX: '', // 操作时鼠标最终位置
    [state.props.startTime]: '', // 计算出的起始时间
    [state.props.endTime]: '', // 计算出的结束时间
    RangeTime: [],
    popovisible: false, // 时间选择弹窗显示/隐藏
    isPre: true,
    style: randomRgb(),
    temporary: true, // 标记当前操作项 操作结束后为false
  }
  recalcTime(temp)
  state.weekList[action[0]][state.props.timeList].push(temp)
  // 按起始时间重新排序
  state.weekList[action[0]][state.props.timeList].sort((a, b) => {
    return a.pointX.replace('px', '') * 1 - b.pointX.replace('px', '') * 1
  })
  state.activeTime = [
    action[0],
    state.weekList[action[0]][state.props.timeList].length - 1,
  ]
  state.ifDrag = true
  state.dageDom = 'end'
  state.temp = temp
  // 备份记录
  state.temp.r_width = temp.width.replace('px', '') * 1
  state.temp.r_pointX = temp.pointX.replace('px', '') * 1
  state.temp.startX = event.clientX
}

// 点击结束
const mouseupEnd = (event) => {
  try {
    // 鼠标点击其他位置取消选中的操作对象
    let item_index = state.weekList[state.activeTime[0]][
      state.props.timeList
    ].findIndex((d) => {
      return d.temporary
    })
    if (!state.temp) {
      state.activeTime = []
    } else {
      // 数据有变化时才往上提交
      if (state.dataChange) {
        listenerChange()
      }
    }
    // 并非真正想新增
    if (state.temp && state.temp.isPre) {
      state.weekList[state.activeTime[0]][state.props.timeList].splice(
        item_index,
        1
      )
    }
    state.temp.temporary = false
    state.dageDom = ''
    state.ifDrag = false
  } catch (error) {}
}

// 时段点击拖拽
const arrowsStart = (event, temp, dom, action) => {
  state.activeTime = action ? action : state.activeTime
  state.ifDrag = true
  state.dageDom = dom
  state.temp = temp
  state.temp.temporary = true
  // 备份记录
  state.temp.r_width = temp.width.replace('px', '') * 1
  state.temp.r_pointX = temp.pointX.replace('px', '') * 1
  state.temp.startX = event.clientX
}

// 鼠标移动
const mousemoveNow = () => {
  if (state.ifDrag) {
    state.temp.endX = event.clientX
    state.temp.isPre = false
    recalcAttr(state.temp)
    state.dataChange = true
  }
}

// 重新计算宽度和定位
const recalcAttr = (temp) => {
  let point = temp.r_pointX
  let minX = 0
  let maxW = state.width.replace('px', '') * 1
  // 复选模式
  if (!state.repeat) {
    let item_index = state.weekList[state.activeTime[0]][
      state.props.timeList
    ].findIndex((d) => {
      return d.temporary === true
    })
    // 最小不能小于前一个已有时段的最大值
    if (item_index > 0) {
      let last_item =
        state.weekList[state.activeTime[0]][state.props.timeList][
          item_index - 1
        ]
      minX =
        last_item.pointX.replace('px', '') * 1 +
        last_item.width.replace('px', '') * 1
    }
    // 最大不能大于后一个已有时段的最小值
    if (
      item_index <
      state.weekList[state.activeTime[0]][state.props.timeList].length - 1
    ) {
      let next_item =
        state.weekList[state.activeTime[0]][state.props.timeList][
          item_index + 1
        ]
      maxW = next_item.pointX.replace('px', '') * 1
    }
  }
  // 拖拽左滑块 存在边界没限制问题
  if (state.dageDom === 'start') {
    let width = temp.r_width * 1 + (temp.startX - temp.endX)
    point = point * 1 - (temp.startX - temp.endX)
    if (point < minX) {
      point = minX
      width = temp.width.replace('px', '')
    }
    if (point > maxW + 2) {
      point = maxW
      width = temp.width.replace('px', '')
    }
    if (temp.startX - temp.endX + temp.r_width * 1 < 0) {
      width *= -1
    } else {
      temp.pointX = point + 'px'
    }
    temp.width = width + 'px'
    // 拖拽右滑块
  } else if (state.dageDom === 'end') {
    let width = temp.r_width * 1 + (temp.endX - temp.startX)
    if (width < 0) {
      point = point * 1 + width
      if (point < minX) {
        point = minX
        width = temp.width.replace('px', '')
      }
      temp.pointX = point + 'px'
      temp.width = width * -1 + 'px'
    } else {
      if (point + width > maxW) {
        width = maxW - point
      }
      temp.width = width + 'px'
    }
    // 拖拽时段主体
  } else if (state.dageDom === 'content') {
    let width = temp.r_width
    point = point + (temp.endX - temp.startX)
    if (point < minX) {
      point = minX
    }
    if (point + width > maxW) {
      point = maxW - width
    }
    temp.pointX = point + 'px'
  }
  // 计算新时间
  recalcTime(state.temp)
}

// 重新计算时间
const recalcTime = (temp) => {
  let pointX = temp.pointX.replace('px', '') * 1
  let width = temp.width.replace('px', '') * 1
  let s_second = pointX / state.secondWidth
  let e_second = (pointX + width) / state.secondWidth
  temp[state.props.startTime] = formatMinute(s_second)
  temp[state.props.endTime] = formatMinute(e_second)
  temp.RangeTime = [temp[state.props.startTime], temp[state.props.endTime]]
}

// 秒数转
const formatMinute = (scNumber) => {
  if (state.timeLevel === 'mm') {
    let hour = Math.floor(scNumber / (60 * 60))
    let minute = Math.floor((scNumber % (60 * 60)) / 60)
    // 判断是否是第24个小时
    if (hour == 24) {
      hour = 23
    }
    if (hour == 23 && minute == 0) {
      minute = 59
    }
    hour = hour >= 10 ? hour : '0' + hour
    minute = minute >= 10 ? minute : '0' + minute
    return hour + ':' + minute
  } else {
    let hour = Math.floor(scNumber / (60 * 60))
    let minute = Math.floor((scNumber % (60 * 60)) / 60)
    let second = Math.floor((scNumber % (60 * 60)) % 60)
    hour = hour >= 10 ? hour : '0' + hour
    minute = minute >= 10 ? minute : '0' + minute
    second = second >= 10 ? second : '0' + second
    return hour + ':' + minute + ':' + second
  }
}

// 关闭时间弹窗
const closeTimePopover = (temp) => {
  temp.popovisible = false
}

// 编辑保存操作
const saveTime = (temp) => {
  closeTimePopover(temp)
  // 计算时段宽度
  let st = formatSecond(temp[state.props.startTime])
  let et = formatSecond(temp[state.props.endTime])
  temp.width = (et - st) * state.secondWidth + 'px'
  // 计算时段定位
  temp.pointX = st * state.secondWidth + 'px'
  listenerChange()
}

// 关闭复制弹窗popover
const closePopover = (index) => {
  state.weekList.forEach((value, ind) => {
    if (ind === index) {
      value.popovisible = false
    }
  })
}

// 复制全选
const handleCheckAllChange = (val) => {
  state.copyList = val
    ? state.weekList.map((d, i) => {
        return i
      })
    : []
  state.isIndeterminate = false
}

// 复制选择回调
const handleCheckedCitiesChange = (value) => {
  let checkedCount = value.length
  state.checkAll = checkedCount === state.weekList.length
  state.isIndeterminate =
    checkedCount > 0 && checkedCount < state.weekList.length
}

// 确认复制
const confirmCopy = (index) => {
  // 复制时段
  state.copyList.forEach((ind) => {
    state.weekList[ind][state.props.timeList] = deepClone(
      state.weekList[index][state.props.timeList]
    )
  })
  closePopover(index)
  listenerChange()
}

// 通过输入框改变时间
const timeChange = (value, time) => {
  time.RangeTime = value
  time[state.props.startTime] = value[0]
  time[state.props.endTime] = value[1]
}

// 复制
const actionCopy = (index) => {
  // 清空选中
  state.copyList = []
  state.weekList.forEach((value, ind) => {
    state.weekList[ind].disabled = false
    if (ind === index) {
      value.disabled = true
    }
  })
}

// 删除操作
const deleteTime = (index, ind) => {
  state.weekList[index][state.props.timeList].splice(ind, 1)
  listenerChange()
}

// 监听数据变动
const listenerChange = () => {
  emit('change', state.weekList)
  state.dataChange = false
}

// 预留按钮触发
const reservedfun = (time, ind) => {
  emit('reserved', { time: time, index: ind })
}

// 随机获取颜色
const randomRgb = () => {
  let R = Math.floor(Math.random() * 255)
  let G = Math.floor(Math.random() * 255)
  let B = Math.floor(Math.random() * 255)
  return 'rgb(' + R + ',' + G + ',' + B + ')'
}

onUpdated(() => {})
const boxWidth = () => {
  return state.width.replace('px', '') * 1 + 122 + 'px'
}
onMounted(() => {
  state.boxwidths = boxWidth()
  window.addEventListener('mousemove', mousemoveNow)
  window.addEventListener('mouseup', mouseupEnd)
  // 获取1秒时间容器宽度
  state.secondWidth = state.width.replace('px', '') / (24 * 60 * 60)
  if (state.weekList) {
    initFormatData()
  }
})

defineExpose({
  initFormatData,
})
</script>
<style lang="scss" scoped>
.fr {
  float: right;
}
.week-plan-time-wrap {
  width: 100%;
  box-sizing: border-box;
  .tool-tips {
    padding: 10px 0;
    box-sizing: border-box;
    .circular {
      display: inline-block;
      width: 12px;
      height: 12px;
      vertical-align: middle;
      border-radius: 50%;
      background: #13c2c2;
      margin-top: -2px;
      margin-right: 8px;
    }
  }
  .scroll-box {
    width: 100%;
    overflow: auto;
    .week-plan-time {
      height: 280px;
      border: 1px solid #ddd;
      overflow: auto;
      .az-time-list {
        width: 100%;
        padding: 0 40px 0 80px;
        box-sizing: border-box;
        height: 28px;
        background: #eee;
        ul {
          display: flex;
          padding: 0;
          margin: 0;
          li {
            list-style-type: none;
            flex: 1;
            width: calc(100% / 24);
            height: 24px;
            font-size: 12px;
            line-height: 28px;
          }
        }
      }
      .az-week-list {
        width: 100%;
        .week-item {
          width: 100%;
          height: 35px;
          padding: 0 40px 0 80px;
          box-sizing: border-box;
          position: relative;
          &:hover {
            background: rgba(0, 0, 0, 0.05);
          }
          .label {
            box-sizing: border-box;
            position: absolute;
            left: 0;
            top: 0;
            width: 80px;
            height: 35px;
            line-height: 35px;
            text-align: center;
            border-right: 1px solid #ddd;
            user-select: none;
          }
          .time-swiper {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            display: flex;
            position: relative;
            cursor: pointer;
            .chunk {
              display: block;
              height: 100%;
              flex: 1;
              border-left: 1px solid #ddd;
              &:first-child {
                border: none;
              }
            }
            .slider-time {
              position: absolute;
              height: 100%;
              padding: 10px 0;
              box-sizing: border-box;
              z-index: 30;
              .content {
                width: 100%;
                height: 100%;
                background: #13c2c2;
                opacity: 0.8;
              }
              .arrows {
                position: absolute;
                height: 100%;
                size: 10px;
                color: #11a983;
                width: 14px;
                cursor: e-resize;
                .el-icon-postcard {
                  position: absolute;
                  top: 0;
                  left: 0;
                }
                .el-icon-caret-bottom {
                  position: absolute;
                  top: -2px;
                  left: 0;
                }
                .el-icon-caret-top {
                  position: absolute;
                  bottom: -5px;
                  left: 0;
                }
                &.left-arrows {
                  left: -7px;
                  top: 0;
                }
                &.right-arrows {
                  right: -7px;
                  top: 0;
                }
              }
            }
          }
          .copy-btn {
            position: absolute;
            top: 0;
            right: 0;
            width: 40px;
            height: 40px;
            line-height: 40px;
            background: #eee;
            text-align: center;
            font-size: 16px;
            cursor: pointer;
            &:hover {
              color: #13c2c2;
            }
          }
        }
      }
    }
    .footer-chunk {
      padding: 15px 0;
    }
  }
}
</style>
