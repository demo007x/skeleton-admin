import request from '@/utils/request'

export function list() {
  return request({
    url: '/categories',
    method: 'get'
  })
}

export function create( data ){
  return request({
    url: '/category',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/category/'+id,
    method: 'put',
    data
  })
}

export function destroy(id) {
  return request({
    url: '/category/'+id,
    method: 'delete'
  })
}

export function detail(id) {
  return request({
    url: '/category/'+id,
    method: 'get'
  })
}
