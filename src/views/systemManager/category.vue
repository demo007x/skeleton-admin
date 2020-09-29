<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button-group style="margin-left: 10px;">
        <el-button type="primary" class="filter-item" @click="showAddCategoryDialog=true">添加分类</el-button>
      </el-button-group>
    </div>
    <div>
      <el-table
        :data="categories"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        :stripe="true"
        :default-expand-all="true"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column
          prop="id"
          label="ID"
          sortable
          width="100"
        />
        <el-table-column
          prop="title"
          label="名称"
          width="180"
        />
        <el-table-column
          prop="description"
          label="描述"
        />
        <el-table-column
          prop="img"
          label="分类图"
        />
        <el-table-column
          prop="sort"
          label="排序"
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
    <el-dialog :visible.sync="showAddCategoryDialog" :title="dialogType==='edit'?'编辑分类':'添加分类'">
      <el-form ref="categoryForm" :model="category" :rules="rules" label-width="100px">
        <el-form-item label="父级分类" prop="pid">
          <el-select v-model="category.pid" placeholder="父级分类" style="width: 400px" @change="">
            <el-option label="--选择父级分类--" :value="0" />
            <el-option v-for="item in categories" :key="item.id" :label="item.title" :value="item.id" :disabled="item.id === category.id">
              <span style="float: left">{{ item.title }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.description }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="category.title" placeholder="分类名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="category.description" placeholder="分类描述" />
        </el-form-item>
        <el-form-item label="分类图">
          <el-input v-model="category.img" type="url" placeholder="分类图" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="category.sort" type="number" placeholder="排序" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="cancelAddCategory">取消</el-button>
        <el-button type="primary" @click="doAddCategory">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, create, update, destroy } from '@/api/category'
const defaultCategory = {
  id: 0,
  pid: 0,
  title: '',
  description: '',
  sort: 1,
  img: ''
}
export default {
  name: "Category",
  data(){
    return {
      categories: [],
      showAddCategoryDialog: false,
      dialogType: 'create',
      category: Object.assign({}, defaultCategory),
      rules: {
        title: {required: true, message: '分类标题不能为空',tigger: true},
      }
    }
  },
  created() {
    this.getCategories()
  },
  methods: {
    getCategories(){
      list().then(response => {
        const { data } = response
        this.categories = data
      })
    },
    handleEdit(index, row){
      this.category = Object.assign({}, row)
      this.showAddCategoryDialog = true
      this.dialogType = 'edit'
    },
    handleDelete(index, row){
      let message = '确定要删除此分类?'
      if (row.pid === 0) {
        message = '删除此分类会删除所有子分类, 确定要删除此分类'
      }
      this.$confirm(message, {
        type: 'error'
      }).then(() => {
        destroy(row.id).then(response => {
          if (response.code > 0) {
            this.$message({
              message: response.message,
              type: 'error'
            })
            return
          }
          this.categories.splice(index, 1)
        })
      })
    },
    cancelAddCategory(){
      this.showAddCategoryDialog = false
      this.dialogType = 'create'
      this.category = Object.assign({}, defaultCategory)
      this.$refs.categoryForm.clearValidate()
      this.$refs.categoryForm.resetFields()
    },
    doAddCategory(){
      this.$refs.categoryForm.validate(valid => {
        if (valid) {
          if (this.dialogType === 'create') {
            // create
            create(this.category).then(response => {
              if (response.code > 0) {
                this.$message({
                  message: response.message,
                  type: 'error'
                })
                return
              }
              this.cancelAddCategory()
              this.getCategories()
            })
          } else {
            // update
            update(this.category.id, this.category).then(response => {
              if (response.code > 0) {
                this.$message({
                  message: response.message,
                  type: 'error'
                })
                return
              }
              this.cancelAddCategory()
              this.getCategories()
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
