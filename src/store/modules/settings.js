import { defineStore } from 'pinia'
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo, layoutMod } =
  defaultSettings

const useSettingsStore = defineStore({
  id: 'settings',
  state: () => {
    const localTagsView = JSON.parse(
      localStorage.getItem('tagsView') || tagsView,
    )
    const localFixedHeader = JSON.parse(
      localStorage.getItem('fixedHeader') || fixedHeader,
    )
    const localSidebarLogo = JSON.parse(
      localStorage.getItem('sidebarLogo') || sidebarLogo,
    )
    const localLayoutMod = JSON.parse(
      JSON.stringify(localStorage.getItem('layoutMod') || layoutMod),
    )

    return {
      showSettings,
      tagsView: localTagsView,
      fixedHeader: localFixedHeader,
      sidebarLogo: localSidebarLogo,
      layoutMod: localLayoutMod,
    }
  },
  actions: {
    CHANGE_SETTING({ key, value }) {
      if (Reflect.has(this, key)) {
        this[key] = value
        localStorage.setItem(key, value)
      }
    },
    CHANGE_LAYOUT_MOD(val = 'vertical') {
      const mod = val == 'vertical' ? 'vertical' : 'horizontal'
      localStorage.setItem('layoutMod', mod)
      this.layoutMod = mod
    },
  },
})
export default useSettingsStore
