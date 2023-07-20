<template>
  <div
    @mousedown="
      handler({
        type: 'move',
        val: true,
      })
    "
    v-if="Object.keys($slots).includes('header')"
    style="cursor: move"
    :class="handleClass">
    <slot name="header"></slot>
  </div>
  <!--  <el-button @click="handler({ type: 'remove' })">删我</el-button>-->
  <slot :cb="handler" :id="item.id"></slot>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  handleClass: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['operateHandler'])

const handler = (args) => {
  emit('operateHandler', args)
}

defineOptions({
  name: 'GridContent',
})
</script>

<style scoped lang="scss"></style>
