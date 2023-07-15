import request from '@/utils/request'

// 用户列表
export function UserList(data) {
  return request.post('/v1/user/list', data)
}

export function login(data) {
  return request.get('/login', data)
}

export function getInfo(data) {
  return request.get('/getUserInfo', data)
}

export function logout() {
  return request.get('/logout')
}

export function loginHistory() {
  return request.get('/login/history')
}

export function testRequest() {
  return request.get('/test')
}
