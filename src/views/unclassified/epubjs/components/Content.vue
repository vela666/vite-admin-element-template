<template>
  <transition name="slide-right">
    <div class="content">
      <div class="content-wrapper" v-if="bookAvailable">
        <div
          class="content-item"
          v-for="(item, index) in navigation.toc"
          :key="index"
          @click="jumpTo(item.href)">
          <span class="text">{{ item.label }}</span>
        </div>
      </div>
      <div class="empty" v-else>加载中...</div>
    </div>
  </transition>
</template>
<script setup>
import { defineAsyncComponent, onMounted, ref, reactive, computed } from 'vue'
const props = defineProps({
  ifShowContent: Boolean,
  navigation: Object,
  bookAvailable: Boolean,
})
const emit = defineEmits(['jumpTo'])
const jumpTo = (target) => {
  emit('jumpTo', target)
}
</script>

<style scoped lang="scss">
@import './global';

.content {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 12;
  width: 30%;
  height: 100%;
  background: white;
  .content-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
    .content-item {
      padding: px2rem(20) px2rem(15);
      border-bottom: px2rem(1) solid #f4f4f4;
      .text {
        font-size: 16px;
        color: #333;
      }
    }
  }
  .empty {
    width: 100%;
    height: 100%;
    @include center;
    font-size: 16px;
    color: #333;
  }
}
</style>
