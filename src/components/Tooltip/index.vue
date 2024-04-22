<template>
  <el-tooltip
    v-if="showTips"
    :show-arrow="showArrow"
    :trigger="trigger"
    :offset="offset"
    :persistent="persistent"
    :popper-class="[className].join(' ')"
    :placement="placement">
    <template #content>
      <slot name="content"></slot>
    </template>
    <slot></slot>
  </el-tooltip>
  <slot v-else></slot>
</template>

<script setup>
const props = defineProps({
  className: {
    type: String,
    default: '',
  },
  // content 中的内容是否作为 HTML 字符串处理
  rawContent: {
    type: Boolean,
    default: false,
  },
  showTips: {
    type: Boolean,
    default: true,
  },
  showArrow: {
    type: Boolean,
    default: true,
  },
  offset: {
    type: [String, Number],
    default: 12,
  },
  // 'hover' | 'click' | 'focus' | 'contextmenu'
  trigger: {
    type: String,
    default: 'hover',
  },
  // 当 popover 组件长时间不触发且 persistent 属性设置为 false 时, popover 将会被删除
  persistent: {
    type: Boolean,
    default: false,
  },
  type: {
    type: [String, Number],
    default: '',
  },
  placement: {
    type: String,
    default: 'top',
  },
})
defineOptions({
  name: 'Tooltip',
})
</script>

<style scoped lang="scss"></style>
