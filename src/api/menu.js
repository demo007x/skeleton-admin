import request from '@/utils/request'
import Layout from '@/layout'

export function createMenu(data) {
  return request({
    url: '/menu',
    method: 'post',
    data
  })
}

export function menuInfo(id) {
  return request({
    url: '/menu/' + id,
    method: 'get'
  })
}

/**
 * 获取菜单树行结构
 */
export function menusTree() {
  return request({
    url: '/menus/tree',
    method: 'get'
  })
}

export function menuLists() {
  return request({
    url: '/menus',
    method: 'get'
  })
}
// 更新菜单
export function updateMenu(data) {
  return request({
    url: '/menu/' + data.id,
    method: 'put',
    data
  })
}

export function destroyMenu(id) {
  return request({
    url: '/menu/' + id,
    method: 'delete'
  })
}

/**
 * 菜单列表构造vue路由菜单
 * @param {*} menus
 * @param {*} pid
 * @param {*} component
 */
export function generateMenusTree(menus, pid = 0) {
  const menuRouters = []
  for (const list of menus) {
    if (list.pid === pid) {
      let path = list.path
      if (pid === 0 && list.path.indexOf('/') !== 0) {
        path = '/' + list.path
      } else {
        path = list.path
      }
      const menu = {
        path: path,
        component: (list.pid === 0) ? Layout : resolve => require([`@/views/${list.component}.vue`], resolve),
        name: list.name,
        meta: {
          title: list.title,
          icon: list.icon,
          noCache: list.is_cache === 1
        },
        children: []
      }
      const children = generateMenusTree(menus, list.id)
      menu.children = children
      menuRouters.push(menu)
    }
  }
  return menuRouters
}
