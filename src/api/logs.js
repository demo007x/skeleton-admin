import request from '@/utils/request'

export function getLogs(query) {
  return request({
    url: '/logs',
    method: 'get',
    params: query
  })
}
