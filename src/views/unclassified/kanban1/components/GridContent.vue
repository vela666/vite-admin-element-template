<template>
  <div
    @mousedown="$emit('move')"
    v-if="Object.keys($slots).includes('header')"
    style="cursor: move"
    :class="handleClass">
    <slot name="header"></slot>
  </div>
  <!--  <div>
    <button @click="handleRemove">X</button>
  </div>-->
  <slot :remove="handleRemove" :data="item">
    <div></div>
  </slot>
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
const emit = defineEmits(['remove', 'move'])

const handleRemove = () => {
  emit('remove', props.item)
}
defineOptions({
  name: 'GridContent',
})
</script>

<style scoped lang="scss"></style>
