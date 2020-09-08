<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="permissionQuery.name" clearable style="width: 200px" class="filter-item" placeholder="权限名称" />
      <el-button-group style="margin-left: 10px;">
        <el-button type="primary" class="filter-item" @click="showAddPermissionDialog">添加权限</el-button>
      </el-button-group>
    </div>
    <div>
      <el-table
        :data="list.filter(data => !permissionQuery.name || data.name.includes(permissionQuery.name))"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        :stripe="true"
        :default-expand-all="false"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column
          prop="id"
          label="ID"
          sortable
          width="100"
        />
        <el-table-column
          prop="name"
          label="名称"
          width="180"
        />
        <el-table-column
          prop="controller"
          label="Controller"
          width="180"
        />
        <el-table-column
          prop="action"
          label="Action"
          width="180"
        />
        <el-table-column
          prop="http_method"
          label="Method"
          width="180"
        />
        <el-table-column
          prop="description"
          label="描述"
        />
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑权限':'添加权限'">
      <el-form ref="permissionForm" :model="permission" :rules="rules" label-width="100px">
        <el-form-item label="父级权限" prop="pid">
          <el-select v-model="permission.pid" placeholder="父级权限" style="width: 400px" @change="changeParentPermission">
            <el-option label="--选择父级权限--" :value="0" />
            <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id" :disabled="item.id === permission.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.description }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="permission.name" aria-placeholder="权限名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="permission.description" placeholder="权限描述" />
        </el-form-item>
        <el-form-item v-show="showPermissionColumn" label="Controller" prop="controller">
          <el-input v-model="permission.controller" placeholder="后台Controller" />
        </el-form-item>
        <el-form-item v-show="showPermissionColumn" label="Action" prop="action">
          <el-input v-model="permission.action" placeholder="后台Action" />
        </el-form-item>
        <el-form-item v-show="showPermissionColumn" label="Method" prop="http_method">
          <el-select v-model="permission.http_method" placeholder="http 请求方法" style="width: 400px" clearable filterable @change="$forceUpdate()">
            <el-option v-for="index in httpMethods" :key="index" :label="index" :value="index" />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="cancelAddPermisson">取消</el-button>
        <el-button type="primary" @click="doAddPermission">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { permissionsTree, create, update, destroy } from '@/api/permission'
const defaultPermission = {
  id: 0,
  pid: 0,
  name: '',
  description: '',
  controller: '',
  action: '',
  http_method: ''
}
const defaultHttpMethods = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'OPTIONS'
]

const defaultValidate = {
  controller: { required: true, message: 'controller 不能为空', tigger: 'blur' },
  action: { required: true, message: 'action 不能为空', tigger: 'blur' },
  http_method: { required: true, message: '请求方法不能为空', tigger: 'blur' }
}
const defaultBaseValidate = {
  name: [
    { required: true, message: '名称必填', tigger: 'blur' },
    { max: 100, message: '名称长度不能大于100个字符', tigger: 'blur' }
  ]
}
export default {
  name: 'Permission',
  data() {
    return {
      showPermissionColumn: false,
      permissionQuery: {
        name: ''
      },
      dialogVisible: false,
      dialogType: null,
      permission: Object.assign({}, defaultPermission),
      httpMethods: Object.assign({}, defaultHttpMethods),
      list: [],
      rules: {
        defaultBaseValidate
      }
    }
  },
  computed: {},
  created() {
    this.getPermissionList()
  },
  methods: {
    changeParentPermission(pid) {
      if (pid !== 0) {
        this.showPermissionColumn = true
      } else {
        this.showPermissionColumn = false
      }
    },
    getPermissionList() {
      permissionsTree().then(response => {
        const { data } = response
        this.list = data
      })
    },
    handleEdit($index, row) {
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.permission = Object.assign({}, row)
      if (row.pid !== 0) {
        this.showPermissionColumn = true
        this.rules = Object.assign({}, defaultBaseValidate, defaultValidate)
      } else {
        this.showPermissionColumn = false
        this.rules = Object.assign({}, defaultBaseValidate)
      }
      console.log(this.rules)
    },
    handleDelete($index, row) {
      this.$confirm('删除此权限会同时删除其子权限， 确定操作？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await destroy(row.id)
          this.list.splice($index, 1)
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        })
    },
    showAddPermissionDialog() {
      this.dialogVisible = true
      this.dialogType = 'create'
    },
    cancelAddPermisson() {
      this.dialogVisible = false
      this.permission = deepClone(defaultPermission)
      this.showPermissionColumn = false
      this.$refs.permissionForm.clearValidate()
    },
    doAddPermission() {
      this.$refs.permissionForm.validate(valid => {
        if (valid) {
          if (this.dialogType === 'create') {
            create(this.permission).then(response => {
              const { code } = response
              this.cancelAddPermisson()
              this.getPermissionList()
              if (code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: response.message,
                  type: 'error'
                })
              }
            })
          } else if (this.dialogType === 'edit') {
            update(this.permission.id, this.permission).then(response => {
              if (response.code === 0) {
                for (let index = 0; index < this.list.length; index++) {
                  if (this.list[index].id === response.data.id) {
                    const children = this.list[index].children
                    const { data } = response
                    data.children = children
                    this.list.splice(index, 1, data)
                    break
                  }
                  const children = this.list[index].children
                  for (let index = 0; index < children.length; index++) {
                    if (children[index].id === response.data.id) {
                      children.splice(index, 1, response.data)
                      // this.list[index].children = children
                      break
                    }
                  }
                }
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.$refs.permissionForm.clearValidate()
                this.cancelAddPermisson()
              } else {
                this.$message({
                  message: response.message,
                  type: 'error'
                })
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .permissions-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
