<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.name"
        placeholder="姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="query.email"
        placeholder="邮箱"
        style="width: 200px; margin-left:5px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button-group style="margin-left: 10px;">
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >搜索</el-button>
        <el-button class="filter-item" type="success" icon="el-icon-edit" @click="handleCreate">添加</el-button>
        <el-button class="filter-item" type="warning" icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-button-group>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="userForm" :model="user" :rules="rules" label-width="80px">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" type="password" />
        </el-form-item>
        <el-form-item label="重复密码" prop="re_password">
          <el-input v-model="user.re_password" type="password" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="user.name" />
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="user.mobile" type="number" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio v-model="user.gender" :label="0" :border="true">未知</el-radio>
          <el-radio v-model="user.gender" :label="1" :border="true">男</el-radio>
          <el-radio v-model="user.gender" :label="2" :border="true">女</el-radio>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input v-model="user.introduction" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
      </div>
    </el-dialog>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="query.page"
      :limit.sync="query.limit"
      @pagination="getList"
    />
  </div>
</template>
<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
const defaultQuery = {
  name: '',
  page: 1,
  limit: 20
}
const defaultUser = {}
export default {
  name: 'User',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      dialogStatus: null,
      textMap: {
        edit: '编辑用户',
        create: '添加用户'
      },
      total: 0,
      dialogFormVisible: false,
      query: Object.assign({}, defaultQuery),
      user: Object.assign({}, defaultUser),
      users: [],
      rules: {}
    }
  },
  methods: {
    resetQuery() {
      this.query = defaultQuery
    },
    handleFilter() {
      console.log('handleFilter')
    },
    handleCreate() {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    getList() {
      const users = [
        {
          name: 'test',
          sex: 'man',
          age: 1
        }
      ]
      this.users = users
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
