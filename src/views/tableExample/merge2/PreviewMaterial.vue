<!--
 * **************************************************
 * @file 素材预览
 * @author fengsi<294068744@qq.com>
 * @date 2022-03-17 18:02:00
 * @since 3.5.0
 * **************************************************
-->

<template>
  <section v-if="visible" class="preview-material">
    <div
      v-loading="true"
      element-loading-text="加载中..."
      element-loading-background="rgba(0,0,0,0.15)"
      class="preview-material-container">
      <img
        v-if="material[currentIndex].material_type === 1"
        :key="material[currentIndex].material_url"
        :src="material[currentIndex].material_url" />
      <video
        v-if="material[currentIndex].material_type === 2"
        :key="material[currentIndex].material_url"
        preload="metadata"
        controls>
        <source :src="material[currentIndex].material_url" />
      </video>
      <div
        v-if="material[currentIndex].material_type === 3"
        :key="material[currentIndex].youtube_url"
        class="iframe-container">
        <iframe
          :src="`${PUBLIC_PATH}iframes/youtobe-player.html?v=${getTouTobeId(
            material[currentIndex].youtube_url,
          )}`"
          allowfullscreen="true"
          allowpaymentrequest="true"
          width="100%"
          height="100%"></iframe>
      </div>
    </div>
    <div class="preview-material-close" @click="close"><span>X</span></div>
    <div v-if="currentIndex > 0" class="preview-material-prev" @click="prev">
      <span></span>
    </div>
    <div
      v-if="currentIndex < material.length - 1"
      class="preview-material-next"
      @click="next">
      <span></span>
    </div>
  </section>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'PreviewMaterial',
  components: {},
  props: {},
  emits: [],
  setup(props, context) {
    const state = reactive({
      visible: false,
      currentIndex: 0,
      PUBLIC_PATH: import.meta.env.VITE_APP_PUBLIC_PATH,
      material: [],
    })

    const open = (material) => {
      console.log('materials preview => ', material)
      state.material = material
      state.currentIndex = 0
      state.visible = true
    }

    const close = () => {
      state.material.length = 0
      state.visible = false
    }

    const prev = () => {
      if (state.currentIndex > 0) state.currentIndex--
    }

    const next = () => {
      if (state.currentIndex < state.material.length - 1) state.currentIndex++
    }

    const getTouTobeId = (url) => {
      console.log('youTobe url => ', url)
      return url.split('/').pop().replace('watch?v=', '')
    }

    return {
      ...toRefs(state),
      open,
      close,
      prev,
      next,
      getTouTobeId,
    }
  },
})
</script>

<style scoped lang="scss">
.preview-material {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  > .preview-material-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    :deep(.#{$customNameSpace}-loading-mask) {
      z-index: -1;
    }

    video,
    img {
      position: relative;
      display: block;
      max-width: 100%;
      max-height: 100%;
    }

    .iframe-container {
      width: 100%;
      height: 100%;
    }
  }

  > .preview-material-close {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 100%;
    background-color: hsla(0, 0%, 100%, 0.15);
    font-size: 24px;
    color: $color-fff;
    cursor: pointer;

    &:hover {
      background-color: hsla(0, 0%, 100%, 0.25);
    }

    > span {
      transform: scaleY(0.8);
    }
  }

  > .preview-material-prev,
  > .preview-material-next {
    position: absolute;
    top: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -30px;
    width: 60px;
    height: 60px;
    border-radius: 100%;
    background-color: hsla(0, 0%, 100%, 0.15);
    font-size: 24px;
    color: $color-fff;
    cursor: pointer;

    &:hover {
      background-color: hsla(0, 0%, 100%, 0.25);
    }

    > span {
      display: block;
      width: 15px;
      height: 15px;
      border-bottom: 3px solid $color-fff;
      border-left: 3px solid $color-fff;
    }
  }

  > .preview-material-prev {
    left: 20px;

    > span {
      transform: rotate(45deg);
    }
  }

  > .preview-material-next {
    right: 20px;

    > span {
      transform: rotate(225deg);
    }
  }
}
</style>
