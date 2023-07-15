import { defineStore } from 'pinia'

const useAppStore = defineStore({
  id: 'app',
  state: () => {
    return {
      sidebar: {
        opened: localStorage.getItem('sidebarStatus')
          ? !!+localStorage.getItem('sidebarStatus')
          : true,
        withoutAnimation: false,
      },
      device: 'desktop',
      size: localStorage.getItem('size') || 'default',
      lang: localStorage.getItem('lang') || 'zh',
    }
  },
  actions: {
    TOGGLE_SIDEBAR() {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = false
      if (this.sidebar.opened) {
        localStorage.setItem('sidebarStatus', 1)
      } else {
        localStorage.setItem('sidebarStatus', 0)
      }
    },
    CLOSE_SIDEBAR(withoutAnimation) {
      localStorage.setItem('sidebarStatus', 0)
      this.sidebar.opened = false
      this.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE(device) {
      this.device = device
    },
    SET_SIZE(size) {
      this.size = size
      localStorage.setItem('size', size)
    },
    SET_LANG(lang) {
      this.lang = lang
      localStorage.setItem('lang', lang)
    },
  },
})

export default useAppStore
