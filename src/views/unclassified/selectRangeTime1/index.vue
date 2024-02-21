<template>
  <div>
    <el-button
      size="default"
      type="primary"
      icon="Plus"
      @click.prevent="timeClick">
      时间段选择
    </el-button>
    <el-button
      size="default"
      type="primary"
      icon="Edit"
      @click.prevent="editClick">
      时间段编辑
    </el-button>
    <!-- dialog弹窗加参数判断 v-if="dialog.visible", 是为解决弹窗加载子组件时只加载一次的问题，这样就是每次弹窗时重新渲染 -->
    <!--    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      @close="cancel"
      width="720px"
      v-if="dialog.visible">
      <el-form
        ref="dataForm"
        :model="formData"
        :rules="rules"
        label-width="100px">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="formData.taskName" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="时间分段" prop="times">
          <div>
            <time-plan
              ref="PlanTime"
              :week-list="weekList"
              :width="formData.width"
              :clickbtn="formData.clickbtn"
              :period-num="formData.periodNum"
              @change="selectBack"
              @reserved="clickHandler" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">{{ $t('messageBox.cancel') }}</el-button>
          <el-button type="primary" @click="submitForm">{{
            $t('messageBox.determine')
          }}</el-button>
        </div>
      </template>
    </el-dialog>-->
    <time-plan
      ref="PlanTime"
      :week-list="weekList"
      :width="formData.width"
      :clickbtn="formData.clickbtn"
      :period-num="formData.periodNum"
      @change="selectBack"
      @reserved="clickHandler" />
  </div>
</template>

<script setup>
import { reactive, toRefs, ref } from 'vue'
import TimePlan from './SelectTimeQuantum.vue'

const dataForm = ref()
const dataFormRef = ref()
const PlanTime = ref()
const state = reactive({
  loading: true,
  // 选中ID数组
  ids: [],
  // 非单个禁用
  // single: true,
  // 非多个禁用
  multiple: true,
  dialog: {
    title: '',
    visible: false,
  },
  formData: {
    taskName: '',
    remark: '',
    width: '454px',
    clickbtn: {
      visible: true,
      title: '配置算法',
    },
    time: undefined,
    index: undefined,
    periodNum: 3,
  },
  rules: {
    taskName: [
      { required: true, message: '任务名称不能为空', trigger: 'blur' },
    ],
  },
  taskRules: {
    remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
  },
  weekList: [
    {
      label: '周一',
      active: false,
      timeList: [],
      popovisible: false,
    },
    {
      label: '周二',
      active: false,
      timeList: [],
      popovisible: false,
    },
    {
      label: '周三',
      active: false,
      timeList: [],
      popovisible: false,
    },
    {
      label: '周四',
      active: false,
      timeList: [],
      popovisible: false,
    },
    {
      label: '周五',
      active: false,
      timeList: [],
      popovisible: false,
    },
    {
      label: '周六',
      active: false,
      timeList: [],
      popovisible: false,
    },
    {
      label: '周日',
      active: false,
      timeList: [],
      popovisible: false,
    },
  ],
})
const { loading, ids, formData, rules, dialog, weekList, taskRules } =
  toRefs(state)

/**
 * 时间分段组件回调函数
 */
const selectBack = (list) => {
  // console.log(list)
  state.weekList = list
}

const clickHandler = (data) => {
  // 预留按钮触发函数
  console.log(data)
  state.formData.time = data.time
  state.formData.index = data.index
}

const taskCancel = () => {
  state.formData.time = undefined
  state.formData.index = undefined
  dataFormRef.value.resetFields()
}

/**
 * 时间段选择
 */
const timeClick = () => {
  state.dialog.visible = true
  state.dialog.title = '时间段选择'
}
/**
 * 时间段编辑
 */
const editClick = () => {
  state.formData.taskName = '任务1'
  state.dialog.visible = true
  state.dialog.title = '时间段编辑'
  let timeList = [
    {
      startTime: '09:00',
      endTime: '18:00',
    },
  ]
  state.weekList.forEach((value, index) => {
    // 星期二的时间段
    if (index == 2) {
      value.timeList = timeList
    }
  })
}
const taskSubmit = () => {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      console.log('保存备注数据操作。。。')
      state.weekList.forEach((value) => {
        value.timeList.forEach((tm, ind) => {
          if (ind == state.formData.index) {
            tm.data = state.formData.remark
          }
        })
      })
      taskCancel()
    }
  })
}
const submitForm = () => {
  dataForm.value.validate((valid) => {
    if (valid) {
      console.log('保存时间段数据操作。。。')
      console.log(JSON.stringify(state.weekList))
      cancel()
    }
  })
}

const cancel = () => {
  state.dialog.visible = false
  dataForm.value.resetFields()
  // 关闭弹窗时清除timeList的数据
  state.weekList.forEach((value) => {
    value.timeList = []
  })
}
</script>
<style lang="scss" scoped></style>
