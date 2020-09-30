import request from '@/utils/request'

export function list() {
  return request({
    url: '/carousels',
    method: 'get'
  })
}

export function create( data ){
  return request({
    url: '/carousel',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/carousel/'+id,
    method: 'put',
    data
  })
}

export function destroy(id) {
  return request({
    url: '/carousel/'+id,
    method: 'delete'
  })
}

export function detail(id) {
  return request({
    url: '/carousel/'+id,
    method: 'get'
  })
}
