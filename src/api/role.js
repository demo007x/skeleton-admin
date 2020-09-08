import request from '@/utils/request'

/**
 * 角色详情
 * @param id
 * @returns {*}
 */
export function getRole(id) {
  return request({
    url: '/role/' + id,
    method: 'get'
  })
}
// 角色列表
export function getRoles() {
  return request({
    url: '/roles',
    method: 'get'
  })
}
// 添加角色
export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}
// 更新角色
export function updateRole(id, data) {
  return request({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

// 删除角色
export function deleteRole(id) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}
