## 简介

[vue-element-admin](https://panjiachen.github.io/vue-element-admin) 是一个后台前端解决方案，它基于 [vue](https://github.com/vuejs/vue) 和 [element-ui](https://github.com/ElemeFE/element)实现。它使用了最新的前端技术栈，内置了 i18n 国际化解决方案，动态路由，权限验证，提炼了典型的业务模型，提供了丰富的功能组件，它可以帮助你快速搭建企业级中后台产品原型。相信不管你的需求是什么，本项目都能帮助到你。

本项目 [skeleton-admin](https://github.com/anziguoer/skeleton-admin) 基于[vue-element-admin](https://panjiachen.github.io/vue-element-admin) 的前后端分离的后端项目。后端项目[skeleton](https://github.com/anziguoer/skeleton) 是 hyperf 做的一个拥有 用户管理， 权限管理，角色管理，菜单管理，权限验证，用户认证（jwt）的基本后台骨架系统。所以本项目[skeleton-admin](https://github.com/anziguoer/skeleton-admin) 需要配合 [skeleton](https://github.com/anziguoer/skeleton) 一起使用更合适。

## 前序准备

你需要在本地安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)。本项目技术栈基于 [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/) 、[vue-cli](https://github.com/vuejs/vue-cli) 、[axios](https://github.com/axios/axios) 和 [element-ui](https://github.com/ElemeFE/element)，所有的请求数据都使用[Mock.js](https://github.com/nuysoft/Mock)进行模拟，提前了解和学习这些知识会对使用本项目有很大的帮助。

<p align="center">
  <img width="900" src="https://wpimg.wallstcn.com/a5894c1b-f6af-456e-82df-1151da0839bf.png">
</p>

## 功能

```
- 登录 / 注销

- 权限
  - 权限添加
  - 权限删除
  - 权限修改
  - 角色授权
- 角色
  - 角色添加
  - 角色删除
  - 角色修改
  - 用户角色

- 用户管理
  - 用户添加
  - 用户删除
  - 用户信息修改
  - 用户密码修改

- 菜单
  - 菜单添加
  - 菜单删除
  - 菜单修改
  - 角色菜单

- token 登录认证

- 多环境发布
  - dev
  - sit
  - stage
  - prod


```

### 功能预览

![用户管理](./screenshot/administrator.png)
![菜单管理](./screenshot/menus.png)
![权限管理](./screenshot/permissions.png)
![角色列表](./screenshot/roles-list.png)
![角色编辑](./screenshot/roles-edit.png)

## 开发

```bash
# 克隆项目
git clone https://github.com/anziguoer/skeleton-admin.git

# 进入项目目录
cd skeleton-admin

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 编辑后端接口地址： .env.development / base api

VUE_APP_BASE_API = 'http://localhost:9501/backend'

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

### 初始账户密码

    账户: admin@admin.com
    密码: admin123

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

### 如果你觉得这个项目帮助到了你，你可以帮作者买一杯果汁表示鼓励 🍹

![alipay](./screenshot/alipay.png)

![alipay](./screenshot/wechat_pay.png)

### QQ 交流： 1031212459

### 微信交流：

![wechat](./screenshot/friends.png)

Copyright (c) 2020-anziguoer
