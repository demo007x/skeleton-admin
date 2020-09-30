<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button-group style="margin-left: 10px;">
        <el-button type="primary" class="filter-item" @click="showAddDialog=true">添加轮播</el-button>
      </el-button-group>
    </div>
    <div>
      <el-table
        :data="carousels"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        :stripe="true"
      >
        <el-table-column
          prop="id"
          label="ID"
          sortable
          width="100"
        />
        <el-table-column prop="url" label="链接地址">
          <template slot-scope="scope">
            <el-link type="primary" :href="scope.row.url" target="_blank">{{scope.row.url}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="img_url" label="图片地址">
          <template slot-scope="scope">
            <el-image :src="scope.row.img_url" :preview-src-list="[scope.row.img_url]"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          width="100"
        />
        <el-table-column
          prop="sort"
          label="排序"
          width="100"
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
    <el-dialog :visible.sync="showAddDialog" :title="dialogType==='edit'?'编辑分类':'添加分类'">
      <el-form ref="carouselForm" :model="carousel" :rules="rules" label-width="100px">
        <el-form-item label="链接地址" prop="url">
          <el-input v-model="carousel.url" type="url" placeholder="链接地址" />
        </el-form-item>
        <el-form-item label="图片地址" prop="img_url">
          <el-input v-model="carousel.img_url" placeholder="图片地址" />
          <el-image :src="carousel.img_url" style="padding-top: 5px;"></el-image>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="carousel.description" placeholder="描述" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="carousel.sort" type="number" placeholder="排序" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="cancelAddCarousel">取消</el-button>
        <el-button type="primary" @click="doAddCarousel">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, create, update, destroy } from '@/api/carousel'
const defaultCarousel = {
  id: 0,
  url: '',
  img_url: '',
  description: '',
  sort: 1
}
export default {
  name: "Carousel",
  data(){
    return {
      carousels: [],
      showAddDialog: false,
      dialogType: 'create',
      carousel: Object.assign({}, defaultCarousel),
      rules: {
        url: {required: true, message: '链接地址不能为空',tigger: true},
        img_url: {required: true, message: '图片地址不能为空',tigger: true},
      }
    }
  },
  created() {
    this.getCarousels()
  },
  methods: {
    getCarousels(){
      list().then((response) => {
        const { data } = response
        this.carousels = data
      })
    },
    handleEdit(index, row){
      this.carousel = Object.assign({}, row)
      this.showAddDialog = true
      this.dialogType = 'edit'
    },
    handleDelete(index, row){
      let message = '确定要删除此轮播?'
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
    cancelAddCarousel(){
      this.showAddDialog = false
      this.dialogType = 'create'
      this.carousel = Object.assign({}, defaultCarousel)
      this.$refs.carouselForm.clearValidate()
      this.$refs.carouselForm.resetFields()
    },
    doAddCarousel(){
      this.$refs.carouselForm.validate(valid => {
        if (valid) {
          if (this.dialogType === 'create') {
            // create
            create(this.carousel).then(response => {
              if (response.code > 0) {
                this.$message({
                  message: response.message,
                  type: 'error'
                })
                return
              }
              this.cancelAddCarousel()
              this.getCarousels()
            })
          } else {
            // update
            update(this.carousel.id, this.carousel).then(response => {
              if (response.code > 0) {
                this.$message({
                  message: response.message,
                  type: 'error'
                })
                return
              }
              this.cancelAddCategory()
              this.getCarousels()
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
