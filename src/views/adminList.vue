<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="username"
          label="姓名"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="createdDate"
          label="注册日期"
          width="220"
        >
        </el-table-column>
        <!-- <el-table-column
          prop="city"
          label="地址"
          width="180"
        >
        </el-table-column>-->
        <el-table-column
          prop="authName"
          label="权限"
        >
        </el-table-column>
      </el-table>
      <div
        class="Pagination"
        style="text-align: left;margin-top: 10px;"
      >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          layout="total, prev, pager, next"
          :total="count"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from '@/components/adminComponent/headTop'
import { mapState } from 'vuex'

import { getStaffs } from '@/apiService/clientApi'
export default {
  data() {
    return {
      tableData: [],
      currentRow: null,
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1
    }
  },
  components: {
    headTop
  },
  created() {},
  mounted() {
    this.initData()
  },
  computed: {
    ...mapState(['userInfo', 'restaurantInfo'])
  },

  methods: {
    async initData() {
      try {
        const result = await getStaffs({
          restaurantId: this.userInfo.restaurantId
        })
        this.tableData = result.data.map(user => {
          user.authName = user.auth == 1 ? '普通' : '管理员'
          return user
        })
        this.$message({
          type: 'success',
          message: result.message
        })
      } catch (err) {
        console.log('获取数据失败', err)
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.offset = (val - 1) * this.limit
      this.getAdmin()
    },
    async getAdmin() {
      try {
        const res = await adminList({ offset: this.offset, limit: this.limit })
        if (res.status == 1) {
          this.tableData = []
          res.data.forEach(item => {
            const tableItem = {
              create_time: item.create_time,
              user_name: item.user_name,
              auth: item.status === 1 ? '普通' : '管理员',
              city: item.city
            }
            this.tableData.push(tableItem)
          })
        } else {
          throw new Error(res.message)
        }
      } catch (err) {
        console.log('获取数据失败', err)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../style/mixin';
.table_container {
  padding: 20px;
}
</style>


