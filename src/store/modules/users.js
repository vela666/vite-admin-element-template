import { defineStore } from 'pinia'
import { setToken, removeToken, getToken } from '@/utils/auth'
import { reactive, toRefs } from 'vue'
import { logout, getInfo } from '@/api/user'
import { resetRouter } from '@/router'
import useTagsViewStore from './tagsView'

export default defineStore('users', () => {
  const initVal = () => {
    return {
      token: getToken(),
      uid: '',
      avatar: '',
      name: '',
      phone: '',
      email: '',
      identity: '',
      roles: [],
    }
  }
  const state = reactive(initVal())
  const SET_TOKEN = (token = '') => {
    setToken(token)
    state.token = token
  }
  const getUserInfo = async () => {
    try {
      const { code, data } = await getInfo()
      if (code == 200) {
        Object.keys(data).forEach((key) => {
          state[key] = data[key]
        })
        return data
      }
    } catch (error) {
      return error
    }
  }

  // 清空所有登录信息
  const resetInfo = () => {
    return new Promise((resolve) => {
      window.location.reload()
      const tagsViewStore = useTagsViewStore()
      Object.assign(state, initVal())
      removeToken()
      resetRouter()
      localStorage.clear()
      sessionStorage.clear()
      tagsViewStore.DEL_ALL_VIEWS(null)
      resolve()
    })
  }
  const loginOut = async () => {
    try {
      const { code } = await logout(state.token)
      if (code === 200) resetInfo()
    } catch (error) {
      return error
    }
  }
  return {
    ...toRefs(state),
    getUserInfo,
    SET_TOKEN,
    resetInfo,
    loginOut,
  }
})
