<template>
  <div class="menu-bar">
    <transition name="slide-up">
      <div
        class="menu-wrapper"
        :class="{ 'hide-box-shadow': ifSettingShow || !ifTitleAndMenuShow }"
        v-show="ifTitleAndMenuShow">
        <div class="icon-wrapper">
          <span class="icon-menu icon" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress icon" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright icon" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-a icon" @click="showSetting(0)">A</span>
        </div>
      </div>
    </transition>
    <transition name="slide-up">
      <div class="setting-wrapper" v-show="ifSettingShow">
        <div class="setting-font-size" v-if="showTag === 0">
          <div
            class="preview"
            :style="{ fontSize: fontSizeList[0].fontSize + 'px' }">
            A
          </div>
          <div class="select">
            <div
              class="select-wrapper"
              v-for="(item, index) in fontSizeList"
              :key="index"
              @click="setFontSize(item.fontSize)">
              <div class="line"></div>
              <div class="point-wrapper">
                <div class="point" v-show="defaultFontSize === item.fontSize">
                  <div class="small-point"></div>
                </div>
              </div>
              <div class="line"></div>
            </div>
          </div>
          <div
            class="preview"
            :style="{
              fontSize: fontSizeList[fontSizeList.length - 1].fontSize + 'px',
            }">
            A
          </div>
        </div>
        <div class="setting-theme" v-else-if="showTag === 1">
          <div
            class="setting-theme-item"
            v-for="(item, index) in themeList"
            :key="index"
            @click="setTheme(index)">
            <div
              class="preview"
              :style="{ background: item.style.body.background }"
              :class="{
                'no-border': item.style.body.background !== '#fff',
              }"></div>
            <div class="text" :class="{ selected: index === defaultTheme }">
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="setting-progress" v-else-if="showTag === 2">
          <div class="progress-wrapper">
            <input
              class="progress"
              type="range"
              max="100"
              min="0"
              step="1"
              @change="onProgressChange($event.target.value)"
              @input="onProgressInput($event.target.value)"
              :value="progress"
              :disabled="!bookAvailable"
              ref="progressRef" />
          </div>
          <div class="text-wrapper">
            <span>{{ bookAvailable ? progress + '%' : '加载中...' }}</span>
          </div>
        </div>
      </div>
    </transition>
    <content-view
      :ifShowContent="ifShowContent"
      v-show="ifShowContent"
      :navigation="navigation"
      :bookAvailable="bookAvailable"
      @jumpTo="jumpTo">
    </content-view>
    <transition name="fade">
      <div
        class="content-mask"
        v-show="ifShowContent"
        @click="hideContent"></div>
    </transition>
  </div>
</template>
<script setup name="">
import { defineAsyncComponent, watch, ref, reactive, computed } from 'vue'
const ContentView = defineAsyncComponent(() => import('./Content.vue'))
const props = defineProps({
  ifTitleAndMenuShow: {
    type: Boolean,
    default: false,
  },
  fontSizeList: Array,
  defaultFontSize: Number,
  themeList: Array,
  defaultTheme: Number,
  bookAvailable: {
    type: Boolean,
    default: false,
  },
  navigation: Object,
  parentProgress: Number,
})
const emit = defineEmits([
  'getCurrentLocation',
  'jumpTo',
  'onProgressChange',
  'setTheme',
  'setFontSize',
])
const ifSettingShow = ref(false)
const showTag = ref(0)
const progress = ref(0)
const ifShowContent = ref(false)
const progressRef = ref()
watch(
  () => props.bookAvailable,
  () => {
    getCurrentLocation()
  },
  {
    deep: true,
  }
)
watch(
  () => props.parentProgress,
  () => {
    progress.value = props.parentProgress
    if (props.bookAvailable && progressRef.value) {
      progressRef.value.style.backgroundSize = `${progress.value}% 100%`
    }
  },
  {
    deep: true,
  }
)
const getCurrentLocation = () => {
  emit('getCurrentLocation')
}
const hideContent = () => {
  ifShowContent.value = false
}
const jumpTo = (target) => {
  emit('jumpTo', target)
}
// 拖动进度条触发事件
const onProgressInput = (progress) => {
  progress.value = progress
  this.$refs.progress.style.backgroundSize = `${progress.value}% 100%`
}
// 进度条松开后触发事件，根据进度条数值跳转到指定位置
const onProgressChange = (progress) => {
  emit('onProgressChange', progress)
}
const setTheme = (index) => {
  emit('setTheme', index)
}
const setFontSize = (fontSize) => {
  emit('setFontSize', fontSize)
}
const showSetting = (tag) => {
  showTag.value = tag
  if (showTag.value === 3) {
    ifSettingShow.value = false
    ifShowContent.value = true
  } else {
    ifSettingShow.value = true
  }
}
const hideSetting = () => {
  ifSettingShow.value = false
}
</script>

<style scoped lang="scss">
@import './global.scss';

.menu-bar {
  .menu-wrapper {
    position: absolute;
    display: flex;
    bottom: 0;
    left: 0;
    width: 100%;
    height: px2rem(48);
    z-index: 10;
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
    &.hide-box-shadow {
      box-shadow: none;
    }
    .icon-wrapper {
      flex: 1;
      // 11
      .icon {
        font-size: 22px;
      }
    }
  }
  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 11;
    width: 100%;
    height: 40px;
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
    .setting-font-size {
      display: flex;
      height: 100%;
      .preview {
        flex: 0 0 px2rem(40);
        // 11
      }
      .select {
        display: flex;
        flex: 1;
        .select-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          &:first-child {
            .line {
              &:first-child {
                border-top: none;
              }
            }
          }

          &:last-child {
            .line {
              &:last-child {
                border-top: none;
              }
            }
          }
          .line {
            flex: 1;
            height: 0;
            border-top: px2rem(1) solid #ccc;
          }
          .point-wrapper {
            position: relative;
            flex: 0 0 0;
            width: 0;
            height: px2rem(7);
            border-left: px2rem(1) solid #ccc;
            .point {
              position: absolute;
              top: px2rem(-8);
              left: px2rem(-10);
              width: px2rem(20);
              height: px2rem(20);
              border-radius: 50%;
              background: white;
              border: px2rem(1) solid #ccc;
              box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.15);
              // 11
              .small-point {
                width: px2rem(5);
                height: px2rem(5);
                background: black;
                border-radius: 50%;
              }
            }
          }
        }
      }
    }

    .setting-theme {
      height: 100%;
      display: flex;
      .setting-theme-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: px2rem(5);
        box-sizing: border-box;
        .preview {
          flex: 1;
          border: px2rem(1) solid #ccc;
          box-sizing: border-box;
          &.no-border {
            border: none;
          }
        }

        .text {
          flex: 0 0 px2rem(20);
          font-size: px2rem(14);
          color: #ccc;
          // 11
          &.selected {
            color: #333;
          }
        }
      }
    }

    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      .progress-wrapper {
        width: 100%;
        height: 100%;
        // 11
        padding: 0 px2rem(30);
        box-sizing: border-box;
        .progress {
          width: 100%;
          // -webkit-appearance: none;
          height: px2rem(2);
          background:
            -webkit-linear-gradient(#999, #999) no-repeat,
            #ddd;
          background-size: 0 100%;
          &:focus {
            outline: none;
          }
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background: white;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.15);
            border: px2rem(1) solid #ddd;
          }
        }
      }
      .text-wrapper {
        position: absolute;
        width: 100%;
        bottom: 0;
        color: #333;
        font-size: px2rem(12);
        span {
          // 11
        }
      }
    }
  }
  .content-mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 11;
    display: flex;
    width: 100%;
    height: 100%;
    background: rgba(51, 51, 51, 0.8);
  }
}
</style>
