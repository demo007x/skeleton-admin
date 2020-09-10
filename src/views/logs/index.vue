<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      :data="logs"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="70">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.user_id }}:{{ row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="400">
        <template slot-scope="{row}">
          <el-tag :type="methodType[row.method.toString().toLowerCase()]" :hit="true">{{row.method}}</el-tag> <span>{{ row.controller }}@{{ row.action }}</span>
        </template>
      </el-table-column>
      <el-table-column label="url" align="left">
        <template slot-scope="{row}">
          <span>{{row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览器" align="center">
        <template slot-scope="{row}">
          <span>{{row.browser}}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统" align="center">
        <template slot-scope="{row}">
          <span>{{row.os}}</span>
        </template>
      </el-table-column>
      <el-table-column label="ip" align="center">
        <template slot-scope="{row}">
          <span>{{row.ip}}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="logsQuery.page" :limit.sync="logsQuery.limit" @pagination="getLogs" />
  </div>
</template>

<script>
import { getLogs } from '@/api/logs'
import Pagination from '@/components/Pagination'
const defaultLogsQuery = {
  page: 1,
  limit: 20
}
export default {
  name: 'Logs',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      logs: [],
      total: 0,
      logsQuery: Object.assign({}, defaultLogsQuery),
      methodType: {
        get: 'primary',
        put: 'success',
        'delete': 'danger',
        post: 'info'
      }
    }
  },
  created() {
    this.getLogs()
  },
  methods: {
    async getLogs() {
      const response = await getLogs(this.logsQuery)
      const { data } = response
      this.logs = data.data
      this.total = data.total
    }
  }
}
</script>

<style scoped>

</style>
