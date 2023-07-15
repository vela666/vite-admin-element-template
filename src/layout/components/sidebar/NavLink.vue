<template>
  <component :is="type" v-bind="linkProps(props.to)">
    <slot />
  </component>
</template>

<script setup>
import { isExternal } from '@/utils/validate'
import { computed } from 'vue'

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
})

const type = computed(() => {
  if (isExternal(props.to)) {
    return 'a'
  }
  return 'router-link'
})

const linkProps = (to) => {
  if (isExternal(props.to)) {
    return {
      href: to,
      target: '_blank',
      rel: 'noopener',
      // rel: 'opener',
    }
  }
  return {
    to,
  }
}

defineOptions({
  name: 'NavLink',
})
</script>
