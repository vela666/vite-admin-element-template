<template>
  <div>
    <div class="read-wrapper">
      <div ref="readRef" id="read"></div>
      <div class="mask">
        <div class="left" @click="prevPage">《</div>
        <div class="center" @click="toggleTitleAndMenu"></div>
        <div class="right" @click="nextPage">》</div>
      </div>
    </div>
    <menu-bars
      :ifTitleAndMenuShow="ifTitleAndMenuShow"
      @getCurrentLocation="getCurrentLocation"
      :fontSizeList="fontSizeList"
      :defaultFontSize="defaultFontSize"
      @setFontSize="setFontSize"
      :themeList="themeList"
      :defaultTheme="defaultTheme"
      @setTheme="setTheme"
      :bookAvailable="bookAvailable"
      @onProgressChange="onProgressChange"
      @jumpTo="jumpTo"
      :navigation="navigation"
      :parentProgress="progress"
      ref="menuBar">
    </menu-bars>
  </div>
</template>

<script setup>
import { defineAsyncComponent, onMounted, ref, nextTick, computed } from 'vue'
import Epub from 'epubjs'
import JSZip from 'jszip'
//生产环境需要
window.JSZip = JSZip
import DOWNLOAD_URL from '/t.epub?url'

const MenuBars = defineAsyncComponent(() => import('./components/MenuBar.vue'))
// const DOWNLOAD_URL = ref('./西游记-吴承恩.epub');
const ifTitleAndMenuShow = ref(false)
const readRef = ref()
const fontSizeList = ref([
  {
    fontSize: 12,
  },
  {
    fontSize: 14,
  },
  {
    fontSize: 16,
  },
  {
    fontSize: 18,
  },
  {
    fontSize: 20,
  },
  {
    fontSize: 22,
  },
  {
    fontSize: 24,
  },
])
const defaultFontSize = ref(16)
const themeList = ref([
  {
    name: 'default',
    style: {
      body: {
        color: '#000',
        background: '#fff',
      },
    },
  },
  {
    name: 'eye',
    style: {
      body: {
        color: '#000',
        background: '#ceeaba',
      },
    },
  },
  {
    name: 'night',
    style: {
      body: {
        color: '#fff',
        background: '#000',
      },
    },
  },
  {
    name: 'gold',
    style: {
      body: {
        color: '#000',
        background: 'rgb(238, 232, 170)', //241.236,226
      },
    },
  },
])
const defaultTheme = ref(0)
const bookAvailable = ref(false)
const navigation = ref(null)
const book = ref(null)
const progress = ref(0)
const themes = ref()
const rendition = ref()
const locations = ref()
const menuBar = ref()
// 电子书的解析和渲染
const handelInit = () => {
  // 生成book,Rendition,
  book.value = Epub(DOWNLOAD_URL)
  console.log(DOWNLOAD_URL, 'DOWNLOAD_URL')
  rendition.value = book.value.renderTo(document.getElementById('read'), {
    width: 1000,
    height: 700,
    manager: 'continuous',
    flow: 'paginated',
    spread: 'none',
    allowScriptedContent: true,
    snap: true, // 预加载
  })
  rendition.value.display()
  themes.value = rendition.value.themes
  setFontSize(defaultFontSize.value)
  registerTheme()
  setTheme(defaultTheme.value)
  book.value.ready
    .then(() => {
      navigation.value = book.value.navigation //书签等html信息
      return book.value.locations.generate()
    })
    .then((result) => {
      locations.value = book.value.locations
      bookAvailable.value = true
    })
}
const toggleTitleAndMenu = () => {
  ifTitleAndMenuShow.value = !ifTitleAndMenuShow.value
  if (!ifTitleAndMenuShow.value) {
    menuBar.value.hideSetting()
  }
}
const prevPage = () => {
  // Rendition.prev
  if (rendition.value) {
    rendition.value.prev().then(() => {
      showProgress()
    })
  }
}
const nextPage = () => {
  // Rendition.next
  if (rendition.value) {
    rendition.value.next().then(() => {
      showProgress()
    })
  }
}
const jumpTo = (href) => {
  console.log(href)
  rendition.value.display(href).then(() => {
    showProgress()
  })
  hideTitleAndMenu()
}
const hideTitleAndMenu = () => {
  // 隐藏标题栏和菜单栏
  ifTitleAndMenuShow.value = false
  // 隐藏菜单栏弹出的设置栏
  menuBar.value.hideSetting()
  // 隐藏目录
  menuBar.value.hideContent()
}
const onProgressChange = (progress) => {
  const percentage = progress / 100
  const location =
    percentage > 0 ? locations.value.cfiFromPercentage(percentage) : 0
  rendition.value.display(location)
}
const getCurrentLocation = () => {
  if (rendition.value) {
    showProgress()
  }
}
const showProgress = () => {
  // 获取当前位置信息
  const currentLoction = rendition.value.currentLocation()
  // 获取当前位置进度百分比
  progress.value = bookAvailable.value
    ? locations.value.percentageFromCfi(currentLoction.start.cfi)
    : 0
  // 转化成0-100的数字
  progress.value = Math.round(progress.value * 100)
}
const setTheme = (index) => {
  themes.value.select(themeList.value[index].name)
  defaultTheme.value = index
}
const registerTheme = () => {
  themeList.value.forEach((theme) => {
    themes.value.register(theme.name, theme.style)
  })
}
const setFontSize = (fontSize) => {
  defaultFontSize.value = fontSize
  if (themes.value) {
    themes.value.fontSize(fontSize + 'px')
  }
}
onMounted(() => {
  nextTick(() => {
    handelInit()
  })
})
</script>

<style scoped lang="scss">
.read-wrapper {
  position: relative;
  width: 1100px;
  .mask {
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
    .left {
      // flex: 0 0 px2rem(100);
      font-size: 40px;
      line-height: 600px;
    }
    .center {
      flex: 1;
    }
    .right {
      // flex: 0 0 px2rem(100);
      font-size: 40px;
      line-height: 600px;
    }
  }
}
</style>
