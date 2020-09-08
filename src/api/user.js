import request from '@/utils/request'
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/administrator',
    method: 'get',
    // params: { token },
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
}

export function logout(token) {
  return request({
    url: '/logout',
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
}
