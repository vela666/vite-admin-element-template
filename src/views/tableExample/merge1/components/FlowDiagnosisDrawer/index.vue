<template>
  <DrawerTab
    :componentName="currentComponent.name"
    @close="drawerClose"
    @updTabs="updTabs"
    :tabs="tabsPane"
    :loading="loading"
    ref="drawerTabRef"
    :title="title">
    <component
      :is="currentComponent"
      :data="detailData"
      :ref="(el) => setRefs(currentComponent.name, el)" />
  </DrawerTab>
</template>

<script setup>
import { shallowRef, markRaw, ref, computed } from 'vue'
import PreDiagnosis from './PreDiagnosis'

import DrawerTab from '@/components/DrawerTab'

const tabsData = ref({
  PreDiagnosis: [],
})
const loading = shallowRef(false)
const currentComponent = shallowRef({})
const componentRefs = shallowRef({})
const drawerTabRef = shallowRef(null)
const title = shallowRef('')
const detailData = computed(() => {
  return tabsData.value[currentComponent.value.name]
})
// 功能界面切换按钮列表
const tabsPane = [
  {
    label: '预诊',
    is: markRaw(PreDiagnosis),
  },
  /*{
    label: '详情',
    is: markRaw(TestDetail)
  }*/
]
currentComponent.value = tabsPane[0].is
// 设置组件实例
const setRefs = (name, el) => {
  componentRefs.value[name] = el
}
const updTabs = (val) => {
  currentComponent.value = val
}
const drawerClose = () => {
  componentRefs.value = {}
  tabsData.value = {
    PreDiagnosis: [],
  }
}

const open = async (data, componentName) => {
  currentComponent.value = tabsPane.find(
    (item) => item.is.name === componentName,
  ).is
  title.value = data[0].experimentName
  tabsData.value.PreDiagnosis = data
  drawerTabRef.value.open()
}

defineExpose({
  open,
})

defineOptions({
  name: 'FlowDiagnosisDrawer',
})
</script>
