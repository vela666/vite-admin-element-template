import { defineStore } from 'pinia'
import { computed, markRaw, reactive, toRefs } from 'vue'

export default defineStore('tagsView', () => {
  const state = reactive({
    visitedViews: [],
    cachedViews: [],
    currentClose: '',
  })
  function ADD_VIEW(view) {
    ADD_VISITED_VIEW(view)
    ADD_CACHED_VIEW(view)
  }
  function DEL_VIEW(view) {
    return new Promise((resolve) => {
      DEL_VISITED_VIEW(view)
      DEL_CACHED_VIEW(view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews],
      })
    })
  }
  function DEL_OTHERS_VIEWS(view) {
    return new Promise((resolve) => {
      DEL_OTHERS_VISITED_VIEWS(view)
      DEL_OTHERS_CACHED_VIEWS(view)
      resolve([...state.visitedViews])
    })
  }
  function DEL_ALL_VIEWS(view) {
    return new Promise((resolve) => {
      DEL_ALL_VISITED_VIEWS(view)
      DEL_ALL_CACHED_VIEWS(view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews],
      })
    })
  }
  // 添加访问过的路由
  function ADD_VISITED_VIEW(view) {
    // 存在的不在添加
    if (state.visitedViews.some((v) => v.path === view.path)) return
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name',
      }),
    )
  }
  function ADD_CACHED_VIEW(view) {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
  }

  function DEL_VISITED_VIEW(view) {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  }
  function DEL_CACHED_VIEW(view) {
    /*const index = state.cachedViews.indexOf(view.name)
    index > -1 && state.cachedViews.splice(index, 1)*/
    state.cachedViews = state.cachedViews.filter((item) => item !== view.name)
  }

  function DEL_OTHERS_VISITED_VIEWS(view) {
    state.visitedViews = state.visitedViews.filter((v) => {
      return v.meta.affix || v.path === view.path
    })
  }
  function DEL_OTHERS_CACHED_VIEWS(view) {
    const index = state.cachedViews.indexOf(view.name)
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      state.cachedViews = []
    }
  }

  function DEL_ALL_VISITED_VIEWS() {
    const affixTags = state.visitedViews.filter((tag) => tag.meta.affix)
    state.visitedViews = affixTags
  }
  function DEL_ALL_CACHED_VIEWS() {
    state.cachedViews = []
  }

  function UPDATE_VISITED_VIEW(view) {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
  function CURRENT_CLOSE(name) {
    state.currentClose = name || ''
  }
  return {
    ...toRefs(state),
    DEL_ALL_VIEWS,
    DEL_ALL_CACHED_VIEWS,
    ADD_VISITED_VIEW,
    UPDATE_VISITED_VIEW,
    DEL_CACHED_VIEW,
    DEL_OTHERS_VIEWS,
    ADD_VIEW,
    DEL_VIEW,
  }
})
