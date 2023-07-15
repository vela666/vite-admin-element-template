<template>
  <div class="my-custom-grid-item-content">
    <button @click="handleRemove">X</button>
    <p>{{ itemId }}</p>
  </div>
</template>

<script setup>
import { computed, watch, reactive, ref, onActivated } from 'vue'

const props = defineProps({
  itemId: {
    type: [String, Number],
    required: true,
  },
})
const emit = defineEmits(['remove'])

const handleRemove = () => {
  emit('remove', props.itemId)
}
defineOptions({
  name: 'GridContent',
})

onActivated(() => {
  console.log('GridContent')
})
</script>

<style scoped lang="scss"></style>
