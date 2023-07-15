import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import router from '@/router'
import useUserStore from '@/store/modules/users'
import NProgress from '@/plugins/progress'
// import qs from 'qs'

// axios.defaults.baseURL = process.env.VUE_APP_BASE_API; // API 请求的默认前缀
// axios.defaults.withCredentials = true; // 跨域请求时是否需要使用 cookies 凭证
// axios.defaults.headers.common.Authorization = 'AUTH_TOKEN';
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // withCredentials: true,
  // 毫秒
  timeout: 50000,
})

// 异常拦截处理器
const errorHandler = (error) => {
  NProgress.done()
  let txt = error.message === 'Network Error' ? '网络出错' : error.message
  ElMessage.error(txt)

  return Promise.reject(error)
}

// 添加请求拦截器
request.interceptors.request.use((config) => {
  NProgress.start()
  if (!navigator.onLine) {
    ElMessage({
      message: '请检查您的网络是否正常',
      type: 'error',
      duration: 3000,
    })
    return Promise.reject(new Error('请检查您的网络是否正常'))
  }
  const token = getToken()
  if (token) {
    config.headers.Authorization = token
  }
  return config
}, errorHandler)

request.interceptors.response.use((res) => {
  NProgress.done()
  const result = res.data
  return result
}, errorHandler)

export default request
