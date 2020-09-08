<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">添加角色</el-button>
    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="{row}">{{ row.id }}</template>
      </el-table-column>
      <el-table-column align="center" label="role_key" width="100">
        <template slot-scope="{row}">{{ row.role_key }}</template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="{row}">{{ row.name }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="描述">
        <template slot-scope="{row}">{{ row.description }}</template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑｜菜单权限｜数据权限</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'添加角色'">
      <el-form ref="roleForm" :model="role" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="Role key" prop="role_key">
          <el-input v-model="role.role_key" aria-placeholder="role key" />
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="role.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="角色描述"
          />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            ref="tree"
            v-model="role.menus_id"
            :check-strictly="checkStrictly"
            :data="menus"
            :props="defaultProps"
            :highlight-current="true"
            show-checkbox
            :indent="20"
            node-key="id"
            class="permission-tree"
            :default-checked-keys="role.menus_id"
            @check="checkMenus"
          />
        </el-form-item>
        <el-form-item label="数据权限">
          <el-tree
            ref="permissionsTree"
            v-model="role.permission_ids"
            :check-strictly="permissions_check_strictly"
            :data="permissionList"
            :highlight-current="true"
            show-checkbox
            :indent="20"
            node-key="id"
            :props="{label: 'name'}"
            :default-checked-keys="role.permission_ids"
            @check="checkPermissions"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="resetConfirmRole">取消</el-button>
        <el-button type="primary" @click="confirmRole">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { deepClone } from '@/utils'
import { getRoles, addRole, deleteRole, updateRole } from '@/api/role'
import { permissionsTree } from '@/api/permission'
import { menusTree } from '@/api/menu'

const defaultRole = {
  id: '',
  role_key: '',
  name: '',
  description: '',
  menus_id: [],
  permission_ids: []
}

export default {
  name: 'Roles',
  data() {
    return {
      role: Object.assign({}, defaultRole),
      menus: [],
      rolesList: [],
      permissionList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      permissions_check_strictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      rules: {
        role_key: [
          { required: true, message: 'role key 必填', tigger: 'blur' },
          { min: 2, max: 25, message: '至少2个字符, 最多不能操作25个字符' }
        ],
        name: [
          { required: true, message: '角色名称不能为空', tigger: 'blur' },
          {
            min: 2,
            max: 25,
            message: '至少2个字符, 最多不能操作25个字符',
            tigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {},
  created() {
    // Mock: get all routes and roles list from server
    // this.getRoutes()
    this.getRoles()
    this.menusList()
    this.getPermissionList()
  },
  methods: {
    getPermissionList() {
      permissionsTree().then(response => {
        const { data } = response
        this.permissionList = data
      })
    },
    checkPermissions(data, node) {
      if (data.pid === 0) {
        this.permissions_check_strictly = false
      } else {
        this.permissions_check_strictly = true
      }
      let permission_ids = []
      permission_ids = permission_ids.concat(node.checkedKeys, node.halfCheckedKeys)
      this.role.permission_ids = permission_ids
    },
    checkMenus(data, node) {
      // const menus_id = []
      // if (node.checkedNodes.length > 0) {
      //   for (const menu of node.checkedNodes) {
      //     menus_id.push(menu.id)
      //   }
      // }
      // if (node.halfCheckedNodes.length > 0) {
      //   for (const menu of node.halfCheckedNodes) {
      //     menus_id.push(menu.id)
      //   }
      // }
      this.role.menus_id = node.checkedKeys.concat(node.halfCheckedKeys)
    },
    menusList() {
      menusTree().then(response => {
        const { data } = response
        this.menus = data
      }).catch(error => {
        this.$message({
          message: error.toString(),
          type: 'error'
        })
      })
    },
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
        this.$refs.permissionsTree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
      this.permissions_check_strictly = true
    },
    handleEdit(row) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.permissions_check_strictly = true
      this.role = Object.assign(row)
      const menus_id = []
      if (row.menus.length > 0) {
        for (const menu of row.menus) {
          menus_id.push(menu.id)
        }
      }
      const permission_ids = []
      if (row.permissions.length > 0) {
        for (const permission of row.permissions) {
          permission_ids.push(permission.id)
        }
      }
      this.role.menus_id = menus_id
      this.role.permission_ids = permission_ids
      // console.log(this.role.permission_ids)
      this.$nextTick(() => {
        this.$refs['roleForm'].clearValidate()
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定要删除此角色么?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.id)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        })
        .catch((err) => {
          console.error(err)
        })
    },
    resetConfirmRole() {
      this.dialogVisible = false
      this.checkStrictly = true
      this.permissions_check_strictly = true
      this.$refs.tree.setCheckedKeys([])
      this.$refs.permissionsTree.setCheckedKeys([])
      this.role = Object.assign({}, defaultRole)
    },
    async confirmRole() {
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'
          if (isEdit) {
            updateRole(this.role.id, this.role).then(response => {
              const { data } = response
              for (let index = 0; index < this.rolesList.length; index++) {
                if (this.rolesList[index].id === data.id) {
                  const permission_ids = []

                  for (const permission of data.permissions) {
                    permission_ids.push(permission.id)
                  }
                  data.permission_ids = permission_ids
                  this.rolesList.splice(index, 1, data)
                  break
                }
              }
              this.$refs['roleForm'].clearValidate()
              if (response.code === 0) {
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
          } else {
            delete this.role.id
            addRole(this.role).then((response) => {
              const { data } = response
              this.rolesList.push(data)
              this.role = defaultRole
              if (response.code === 0) {
                this.$refs['roleForm'].clearValidate()
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
          }

          // const { description, role_key, name } = this.role
          this.dialogVisible = false
          // this.permissions_check_strictly = false
          this.role = Object.assign({}, defaultRole)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
