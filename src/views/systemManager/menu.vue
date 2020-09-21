<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6">
        <div class="filter-container">
          <el-input
            v-model="filterText"
            placeholder="输入菜单关键字进行过滤"
            size="medium"
            clearable
          />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" type="flex">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>菜单列表</span>
          </div>
          <el-tree ref="tree" class="filter-tree" default-expand-all :filter-node-method="filterNode" :data="list" :props="defaultProps" accordion :highlight-current="true" show-checkbox expand-on-click-node="false" @node-click="handleNodeClick">
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  type="text"
                  size="mini"
                  style="color:#409EFF"
                  icon="el-icon-edit"
                  @click="() => editMenu(data)"
                />
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  style="color:#F56C6C"
                  @click="() => removeMenu(node, data)"
                />
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span v-show="dialogStatus === 'edit'">编辑菜单</span>
            <span v-show="dialogStatus === 'create'">添加菜单</span>
          </div>
          <el-form ref="menuForm" :model="menuData" :rules="rules" label-width="80px">
            <el-input v-model="menuData.id" type="hidden" />
            <el-input v-model="menuData.pid" type="hidden" />
            <el-form-item label="父级菜单">
              <el-cascader v-model="defaultMenuPid" :options="list" :show-all-levels="false" :clearable="true" filterable :props="{value:'id', label:'title',checkStrictly:true}" @change="setMenuRelation">
                <template slot-scope="{ node, data }">
                  <span>{{ data.title }}</span>
                </template>
              </el-cascader>
            </el-form-item>
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="menuData.name" />
            </el-form-item>
            <el-form-item label="菜单标题" prop="title">
              <el-input v-model="menuData.title" />
            </el-form-item>
            <el-form-item label="图标">
              <el-input v-model="menuData.icon">
                <template slot="append">
                  <el-link href="/#/icon/index" target="_blank">查看可用的图标</el-link>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="路由" prop="path">
              <el-input v-model="menuData.path" />
            </el-form-item>
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="menuData.component" />
            </el-form-item>
            <el-form-item label="路由缓存">
              <el-radio v-model="menuData.is_cache" :label="0" border>否</el-radio>
              <el-radio v-model="menuData.is_cache" :label="1" border>是</el-radio>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="menuData.sort" :min="1" />
            </el-form-item>
            <el-form-item>
              <el-button type="default" @click="resetMenuData">
                重置
              </el-button>
              <el-button type="primary" @click="dialogStatus==='create'?createMenu():updateData()">
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { createMenu, menuInfo, menusTree, updateMenu, destroyMenu } from '@/api/menu'
  const menuQuery = {
    name: ''
  }
  const defaultMenuData = {
    id: 0,
    pid: 0,
    name: '',
    title: '',
    icon: '',
    path: '',
    component: 'Layout',
    is_cache: 0,
    sort: 1
  }
  export default {
    name: 'Menus',
    data() {
      return {
        menuQuery: Object.assign({}, menuQuery),
        tableKey: 0,
        list: [],
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        textMap: [
          'create',
          'update'
        ],
        dialogStatus: 'create',
        defaultMenuPid: [],
        menuData: Object.assign({}, defaultMenuData),
        rules: {
          name: [
            { required: true, message: 'name 必填', tigger: true },
            { max: 100, message: 'name 字符不能大于100' }
          ],
          title: [
            { required: true, message: '菜单标题必填', tigger: true },
            { max: 255, message: '菜单标题长度不能大于255' }
          ],
          path: [
            { required: true, message: '路由必填', tigger: true },
            { max: 255, message: '路由长度不能大于255' }
          ],
          component: [
            { required: true, message: '组件路径必填', tigger: true },
            { max: 255, message: '组件路径长度不能大于255' }
          ]
        },
        filterText: ''
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    created() {
      this.menuList()
    },
    methods: {
      menuList() {
        menusTree().then(response => {
          const { data } = response
          this.list = data
        }).catch((error) => {
          this.$message({
            message: error.toString(),
            type: 'error'
          })
        })
      },
      resetMenuData(){
        this.menuData = Object.assign({}, defaultMenuData)
        this.defaultMenuPid = []
        this.$refs.menuForm.clearValidate()
        this.$refs.menuForm.resetFields()
      },
      handleNodeClick(data) {
        console.log(data)
      },
      filterNode(value, data) {
        if (!value) return true
        return data.title.indexOf(value) !== -1
      },
      editMenu(data) {
        this.dialogStatus = 'edit'
        this.defaultMenuPid = (data.pid === 0) ? [data.id] : [data.pid, data.id]
        this.menuData = Object.assign({}, data)
      },
      setMenuRelation(val) {
        // 菜单下啦选中触发
        this.menuData.pid = val[val.length - 1] !== undefined ? val[val.length - 1] : 0
        if (this.menuData.pid !== 0) {
          this.$refs.menuForm.clearValidate()
          this.menuData.component = ''
        } else {
          this.menuData.component = 'Layout'
        }
      },
      removeMenu(node, data) {
        this.$confirm('此操作不可恢复，确定删除菜单?', {
          type: 'warning',
          showCancelButton: true,
          showConfirmButton: true
        }).then(() => {
          destroyMenu(data.id).then((response) => {
            this.generateMenu()
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          }).catch(error => {
            this.$message({
              message: error,
              type: 'error'
            })
          })
        })
      },
      createMenu() {
        this.$refs['menuForm'].validate((valid) => {
            if (valid) {
              createMenu(this.menuData).then(response => {
                this.generateMenu()
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
              }).catch(error => {
                this.$message({
                  message: error.toString(),
                  type: 'error'
                })
              })
            }
          }
        )
      },
      updateData() {
        this.$refs['menuForm'].validate((valid) => {
            if (valid) {
              updateMenu(this.menuData).then(response => {
                const { tree } = response.data
                this.list = tree
                this.menuData = Object.assign({}, defaultMenuData)
                this.dialogStatus = 'create'
                this.defaultMenuPid = []
                this.$refs['menuForm'].resetFields()
                this.generateMenu()
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
              }).catch(error => {
                this.$message({
                  message: error.toString(),
                  type: 'error'
                })
              })
            }
          }
        )
      },
      menuInfo() {
        menuInfo()
      },
      generateMenu() {
        this.$store.dispatch('permission/generateRoutes')
      }
    }
  }
</script>

<style scoped lang="scss">
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
