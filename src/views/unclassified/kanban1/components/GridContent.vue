<template>
  <div
    style="cursor: move"
    :class="handleClass"
    @mousedown="$emit('move', true)">
    拖我 {{ handleClass }}
  </div>
  <div>
    <slot></slot>
    <button @click="handleRemove">X</button>
    <p>{{ item }}</p>
  </div>
</template>

<script setup>
import { onActivated } from 'vue'

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

onActivated(() => {
  console.log('GridContent')
})
</script>

<style scoped lang="scss"></style>
