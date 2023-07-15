import request from '@/utils/request'

export function getArticle(data) {
  console.log(data, 'data')
  return request.get('/article/list')
}

export function getDetail(id) {
  return request.get('/article/detail', {
    params: { id },
  })
}

export function getPv(pv) {
  return request.get('/article/pv', {
    params: { pv },
  })
}

export function createArticle(data) {
  return request.post('/article/create', data)
}

export function updateArticle(data) {
  return request.post('/article/update', data)
}
