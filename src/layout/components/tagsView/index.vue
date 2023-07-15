<template>
  <div
    ref="tagsViewContaineRef"
    id="tags-view-container"
    class="tags-view-container">
    <el-scrollbar
      ref="scrollPaneEl"
      wrap-class="tags-view-wrapper"
      class="scroll-container"
      @scroll="handleScroll">
      <router-link
        v-for="(tag, index) of tagsViewStore.visitedViews"
        :ref="(el) => setTagRef(index, el)"
        :key="tag.path"
        :class="isActive(tag) ? 'active un-select' : 'un-select'"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)">
        {{ tag.title }}
        <el-icon @click.prevent.stop="refreshSelectedTag(tag)">
          <Refresh />
        </el-icon>
        <el-icon
          v-if="!isAffix(tag) && tagsViewStore.visitedViews.length > 1"
          @click.prevent.stop="closeSelectedTag(tag)">
          <Close />
        </el-icon>
      </router-link>
    </el-scrollbar>

    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">
        <el-button text>刷新</el-button>
      </li>
      <li v-if="!isAffix(selectedTag)">
        <el-button
          @click="closeSelectedTag(selectedTag)"
          :disabled="tagsViewStore.visitedViews.length <= 1"
          text
          >关闭</el-button
        >
      </li>
      <li>
        <el-button
          @click="closeOthersTags"
          :disabled="tagsViewStore.visitedViews.length <= 1"
          text
          >关闭其他</el-button
        >
      </li>
      <!--      <li @click="closeAllTags(selectedTag)">关闭全部</li>-->
    </ul>
  </div>
</template>

<script setup>
import path from 'path-browserify'
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useTagsViewStore from '@/store/modules/tagsView'
import usePermissionStore from '@/store/modules/permission'
import { Refresh } from '@element-plus/icons-vue'

const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStore()
const router = useRouter()
const route = useRoute()

const tagsViewContaineRef = ref(null)
const scrollPaneEl = ref(null)
let tagRefList = []
const setTagRef = (index, el) => {
  tagRefList[index] = el
}

const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref({})
const affixTags = ref([])

const scrollWrapper = computed(() => {
  // return scrollPaneEl.value.$refs.$wrap
  return scrollPaneEl.value.$refs.wrapRef
})

function closeMenu() {
  visible.value = false
}
// 添加当前路由
function addTags() {
  const { name } = route
  if (name && name.toLowerCase() !== 'reolad') {
    tagsViewStore.ADD_VIEW(route)
  }
}
function moveToCurrentTag() {
  nextTick(() => {
    for (const item of tagRefList) {
      if (item.to.path === route.path) {
        moveToTarget(item)
        if (item.to.fullPath !== route.fullPath) {
          tagsViewStore.UPDATE_VISITED_VIEW(route)
        }
        break
      }
    }
  })
}

function moveToTarget(currentTag) {
  const $container = scrollPaneEl.value.$el
  const $containerWidth = $container.offsetWidth
  const $scrollWrapper = scrollWrapper.value
  const tagList = tagRefList
  let firstTag = null
  let lastTag = null

  if (tagList.length > 0) {
    firstTag = tagList[0]
    lastTag = tagList[tagList.length - 1]
  }
  /*console.log({
    firstTag,
    lastTag,
    currentTag,
    tagList,
  })*/
  if (firstTag === currentTag) {
    $scrollWrapper.scrollLeft = 0
  } else if (lastTag === currentTag) {
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
  } else {
    const currentIndex = tagList.findIndex((item) => item === currentTag)
    const prevTag = tagList[currentIndex - 1]
    const nextTag = tagList[currentIndex + 1]

    // the tag's offsetLeft after of nextTag

    const tagAndTagSpacing = Number.parseFloat(
      window.getComputedStyle(nextTag.$el).marginLeft,
    )
    const afterNextTagOffsetLeft =
      nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

    if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
      $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
    } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
      $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
    }
  }
}

function initTags() {
  for (const item of affixTags.value) {
    if (item.name) {
      tagsViewStore.ADD_VISITED_VIEW(item)
    }
  }
}

function filterAffixTags(routes, basePath = '/') {
  let tags = []
  routes.forEach((route) => {
    if (route.meta && route.meta.affix) {
      console.log(route.path)
      const tagPath = path.resolve(basePath, route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta },
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}

function isActive(currentRoute) {
  return currentRoute.path === route.path
}

function isAffix(item) {
  return item && item.meta && item.meta.affix
}

async function refreshSelectedTag(view) {
  await tagsViewStore.DEL_CACHED_VIEW(view)
  const { fullPath, query } = view
  console.log(view)
  nextTick(() => {
    router.replace({
      path: '/reolad' + fullPath,
      query,
    })
  })
}

async function closeSelectedTag(view) {
  const { visitedViews } = await tagsViewStore.DEL_VIEW(view)
  isActive(view) && toLastView(visitedViews, view)
}

async function closeOthersTags() {
  router.replace(selectedTag.value)
  await tagsViewStore.DEL_OTHERS_VIEWS(selectedTag.value)
}

async function closeAllTags(view) {
  const { visitedViews } = await tagsViewStore.DEL_ALL_VIEWS()
  console.log({ affixTags: affixTags.value, visitedViews, view })

  /*if (affixTags.value.some((item) => item.path === view.path)) {
    return
  }*/
  toLastView(visitedViews, view)
}

function toLastView(visitedViews, view) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.replace(latestView.fullPath)
  } else {
    /* if (view.name === 'Dashboard') {
      router.replace({ path: '/reolad' + view.fullPath })
    } else {
      router.push('/')
    }*/
    router.replace('/')
  }
}

function openMenu(item, e) {
  const menuMinWidth = 105
  const offsetLeft = tagsViewContaineRef.value.getBoundingClientRect().left // container margin left
  const offsetWidth = tagsViewContaineRef.value.offsetWidth // container width
  const maxLeft = offsetWidth - menuMinWidth // left boundary
  const l = e.clientX - offsetLeft + 15 // 鼠标相对于父级的left 值

  if (l > maxLeft) {
    left.value = maxLeft
  } else {
    left.value = l
  }

  top.value = e.clientY
  visible.value = true
  selectedTag.value = item
}

function handleScroll() {
  closeMenu()
}

function scrollHandle(e) {
  const eventDelta = e.wheelDelta || -e.deltaY * 40
  const $scrollWrapper = scrollWrapper.value
  $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
}

onMounted(() => {
  initTags()
  addTags()
})

watch(
  () => visible.value,
  (value) => {
    if (value) {
      document.body.addEventListener('click', closeMenu)
    } else {
      document.body.removeEventListener('click', closeMenu)
    }
  },
)

watch(route, () => {
  tagRefList = []
  addTags()
  moveToCurrentTag()
})

defineOptions({
  name: 'TagsView',
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      //padding: 7px 16px;
      > :deep(.#{$customNameSpace}-button) {
        background-color: transparent;
      }
      //cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
.tags-view-wrapper {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  height: 49px;
  width: 100%;
  & ~ .#{$customNameSpace}-scrollbar__bar {
    bottom: 0px;
  }

  .tags-view-item {
    display: inline-block;
    position: relative;
    cursor: pointer;
    height: 26px;
    line-height: 26px;
    border: 1px solid #d8dce5;
    color: #495060;
    background: #fff;
    padding: 0 8px;
    font-size: 12px;
    margin-left: 5px;
    margin-top: 4px;

    &:first-of-type {
      margin-left: 15px;
    }
    &:last-of-type {
      margin-right: 15px;
    }
    &.active {
      background-color: #42b983;
      color: #fff;
      border-color: #42b983;
      &::before {
        content: '';
        background: #fff;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        position: relative;
        margin-right: 2px;
      }
    }
    .#{$customNameSpace}-icon {
      width: 16px;
      height: 16px;
      vertical-align: -2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      /* &:hover {
        background-color: #b4bccc;
        color: #fff;
      }*/
    }
  }
}
</style>
