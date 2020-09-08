import request from '@/utils/request'
// 权限列表
export function list() {
  return request({
    url: '/permissions',
    method: 'get'
  })
}
// 权限树
export function permissionsTree() {
  return request({
    url: '/permissions/tree',
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/permission',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/permission/' + id,
    method: 'put',
    data
  })
}

export function destroy(id) {
  return request({
    url: '/permission/' + id,
    method: 'delete'
  })
}
