/** When your routing systemManager is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemRouter = {
  path: '/systemManager',
  component: Layout,
  redirect: '/systemManager/administrator',
  name: 'SystemManager',
  alwaysShow: true,
  meta: {
    title: '系统管理',
    icon: 'el-icon-setting',
    roles: ['admin']
  },
  children: [{
    path: 'administrator',
    component: () => import('@/views/systemManager/administrator'),
    name: 'Administrator',
    meta: {
      title: '后台用户管理',
      icon: 'el-icon-setting',
      roles: ['admin']
    }
  },
  {
    path: 'roles',
    component: () => import('@/views/systemManager/roles'),
    name: 'Roles',
    meta: {
      title: '角色管理',
      icon: 'peoples',
      roles: ['admin']
    }
  },
  {
    path: 'permission',
    component: () => import('@/views/systemManager/permission'),
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'lock',
      roles: ['admin']
    }
  },
  {
    path: 'user',
    component: () => import('@/views/users'),
    name: 'User',
    meta: {
      title: '用户管理',
      icon: 'user',
      roles: ['admin']
    }
  }
  ]
}
export default systemRouter
