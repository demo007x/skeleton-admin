import request from '@/utils/request'
// 管理员列表
export function getList(query) {
  return request({
    url: '/administrator/list',
    method: 'get',
    params: query
  })
}

// 创建管理员
export function create(data) {
  return request({
    url: '/administrator',
    method: 'post',
    data
  })
}

// 修改管理员信息
export function update(id, data) {
  return request({
    url: '/administrator/' + id,
    method: 'put',
    data
  })
}

// 获取管理员信息
export function getInfo(id) {
  return request({
    url: '/administrator/' + id,
    method: 'get'
  })
}

// 封禁管理员
export function forbid(id) {
  return request({
    url: '/administrator/' + id + '/forbid',
    method: 'get'
  })
}
// 删除管理员
export function destroy(id) {
  return request({
    url: '/administrator/' + id + '/destroy',
    method: 'get'
  })
}

// 修改密码
export function updatePassword(id, data) {
  return request({
    url: '/administrator/' + id + '/password',
    method: 'put',
    data
  })
}
