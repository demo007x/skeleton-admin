<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.email" placeholder="邮箱" style="width: 200px; margin-left:5px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button-group style="margin-left: 10px;">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-button class="filter-item" type="success" icon="el-icon-edit" @click="handleCreate">
          添加
        </el-button>
        <el-button class="filter-item" type="warning" icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-button-group>
    </div>

    <el-table
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="100px" align="center">
        <template slot-scope="{row}">
          <el-avatar :src="row.avatar" />
        </template>
      </el-table-column>
      <el-table-column label="名称" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" max-width="50">
        <template slot-scope="{row}">
          <el-tag effect="plain">{{ genderMap[row.gender] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="简介" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" min-width="150px">
        <template slot-scope="{row}">
          <el-tooltip v-for="role in row.roles" :key="role.id" :content="role.description" placement="top">
            <el-tag size="mini" effect="plain" style="margin-left: 3px;">{{ role.name }}
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="登录时间" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.login_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status === 1 ? 'info' : 'danger' ">
            {{ row.status === 0 ? '封禁用户' : '正常用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="450" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="info" size="mini" @click="updatePassword(row)">修改密码</el-button>
          <el-button v-if="row.status==1" size="mini" type="warning" @click="handleModifyStatus(row)">
            禁用账户
          </el-button>
          <el-button v-if="row.status==0" size="mini" type="warning" @click="handleModifyStatus(row)">
            启用账户
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!--  创建用户  -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="administratorData" :rules="rules" label-width="80px">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="administratorData.email" />
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'create'" label="密码" prop="password">
          <el-input v-model="administratorData.password" type="password" />
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'create'" label="重复密码" prop="re_password">
          <el-input v-model="administratorData.re_password" type="password" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="administratorData.name" />
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="administratorData.mobile" type="number" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio v-model="administratorData.gender" :label="0" :border="true">未知</el-radio>
          <el-radio v-model="administratorData.gender" :label="1" :border="true">男</el-radio>
          <el-radio v-model="administratorData.gender" :label="2" :border="true">女</el-radio>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input v-model="administratorData.introduction" type="textarea" />
        </el-form-item>
        <el-form-item label="设置角色">
          <el-select v-model="administratorData.roles_id" multiple placeholder="选择角色" size="medium" clearable filterable @change="$forceUpdate()">
            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id">
              <span style="float: left">{{ role.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ role.description }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm()">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="重置密码" :visible.sync="dialogResetPasswordFormVisible">
      <el-form ref="resetPasswordForm" :model="resetPasswordData" :rules="resetPasswordFormRules" label-width="80px">
        <el-input v-model="resetPasswordData.uid" type="hidden" />
        <el-form-item label="密码" prop="password">
          <el-input v-model="resetPasswordData.password" type="password" />
        </el-form-item>
        <el-form-item label="重复密码" prop="re_password">
          <el-input v-model="resetPasswordData.re_password" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetUserPasswordForm()">
          取消
        </el-button>
        <el-button type="primary" @click="doUpdateUserPassword()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, create, destroy, forbid, update, updatePassword } from '@/api/administrator'
import { getRoles } from '@/api/role'
import waves from '@/directive/waves' // waves directive
import { deepClone, parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { validEmail } from '@/utils/validate' // secondary package based on el-pagination
const defaultAdministratorData = {
  name: '',
  password: '',
  re_password: '',
  avatar: '',
  email: '',
  mobile: '',
  gender: 0,
  introduction: '',
  status: 1,
  roles: [],
  roles_id: []
}
const defaultResetPassword = {
  uid: 0,
  password: '',
  re_password: ''
}
const listQueryTmpl = {
  page: 1,
  limit: 20,
  name: undefined,
  status: undefined,
  sort: '+id'
}
export default {
  name: 'Administrator',
  components: { Pagination },
  directives: { waves },
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请输入登录邮箱!'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少 6 位!'))
      } else {
        callback()
      }
    }
    // const validateMobile = (rule, value, callback) => {
    //   if (!isMobile(value)) {
    //     callback(new Error('无效的手机号码'))
    //   } else {
    //     callback()
    //   }
    // }
    const validateRePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback('密码至少 6 位!')
      }
      if (this.administratorData.password !== this.administratorData.re_password) {
        callback('两次密码不一致')
      }

      callback()
    }
    return {
      tableKey: 0,
      list: [],
      roles: [],
      total: 0,
      listQuery: {},
      genderMap: {
        0: '未知',
        1: '男',
        2: '女'
      },
      administratorData: Object.assign({}, defaultAdministratorData),
      resetPasswordData: Object.assign({}, defaultResetPassword),
      showReviewer: false,
      dialogFormVisible: false,
      dialogResetPasswordFormVisible: false,
      showRolesDialogStatus: false,
      dialogStatus: 'create',
      textMap: {
        update: '编辑用户',
        create: '新建用户'
      },
      downloadLoading: false,
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        re_password: [{ required: true, trigger: 'blur', validator: validateRePassword }],
        email: [{ required: true, type: 'email', trigger: 'blur', validator: validateEmail }],
        // mobile: [{required: true, length:11, trigger: 'blur', validator: validateMobile}],
        gender: [{ required: true, type: 'enum', enum: [1, 2] }]
      },
      resetPasswordFormRules: {
        password: { required: true, tigger: 'blur', validator: validatePassword },
        re_password: { required: true, tigger: 'blur', validator: (rule, value, callback) => {
          if (value !== this.resetPasswordData.password) {
            callback(new Error('两次密码不一致'))
          } else {
            callback()
          }
        } }
      }
    }
  },
  created() {
    this.listQuery = Object.assign({}, listQueryTmpl)
    this.getList()
    this.getRoles()
  },
  methods: {
    resetUserPasswordForm() {
      this.dialogResetPasswordFormVisible = false
      this.resetPasswordData = Object.assign({}, defaultResetPassword)
    },
    doUpdateUserPassword() {
      this.$refs['resetPasswordForm'].validate((valid) => {
        if (valid) {
          updatePassword(this.resetPasswordData.uid, this.resetPasswordData).then((response) => {
            this.dialogResetPasswordFormVisible = false
            this.resetPasswordData = Object.assign({}, defaultResetPassword)
          })
        }
      })
    },
    updatePassword(row) {
      this.dialogResetPasswordFormVisible = true
      this.resetPasswordData.uid = row.id
    },
    getList() {
      getList(this.listQuery).then(response => {
        const { data } = response
        this.list = data.data
        this.total = data.total
      })
    },
    getRoles() {
      getRoles().then((response) => {
        const { data } = response
        this.roles = data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row) {
      // 设置用户状态
      let message = '此操作将禁止次用户登录系统, 是否继续?'
      if (row.status === 1) {
        message = '此操作将恢复用户登录正常状态, 是否继续?'
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        forbid(row.id).then((response) => {
          this.$message({
            title: 'Success',
            message: '操作成功',
            type: 'success'
          })
          row.status = (row.status === 1) ? 0 : 1
        })
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          create(this.administratorData).then((data) => {
            this.list.push(data.data)
            this.dialogFormVisible = false
            this.administratorData = Object.assign({}, defaultAdministratorData)
            this.$message({
              message: '创建成功',
              type: 'success'
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.administratorData = deepClone(row)
      const roles_id = []
      row.roles.forEach((role) => {
        roles_id.push(role.id)
      })
      this.administratorData.roles_id = roles_id
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          update(this.administratorData.id, this.administratorData).then(response => {
            this.dialogFormVisible = false
            this.administratorData = Object.assign({}, defaultAdministratorData)
            const { data } = response
            for (let index = 0; index < this.list.length; index++) {
              if (this.list[index].id === data.id) {
                this.list.splice(index, 1, data)
              }
            }
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          })
        }
      })
    },
    resetForm() {
      this.dialogFormVisible = false
      this.administratorData = Object.assign({}, defaultAdministratorData)
    },
    handleDelete(row, index) {
      this.$confirm('删除用户操作不可恢复, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        destroy(row.id).then((response) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.list.splice(index, 1)
        })
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    resetQuery: function() {
      this.listQuery = Object.assign({}, listQueryTmpl)
      this.getList()
    }
  }
}
</script>
