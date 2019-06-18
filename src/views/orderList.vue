<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">

      <el-table
        :data="tableData"
        @expand='expand'
        :expand-row-keys='expendRow'
        :row-key="row => row.orderId"
        style="width: 100%"
      >
        <!-- original -->
        <!-- <el-table-column type="expand">
          <template slot-scope="props">
            <el-form
              label-position="left"
              inline
              class="demo-table-expand"
            >
              <el-form-item label="用户名">
                <span>{{ props.row.user_name }}</span>
              </el-form-item>
              <el-form-item label="店铺名称">
                <span>{{ props.row.restaurant_name }}</span>
              </el-form-item>
              <el-form-item label="收货地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID">
                <span>{{ props.row.restaurant_id }}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{ props.row.restaurant_address }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column> -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form
              label-position="left"
              inline
              class="demo-table-expand"
            >

              <el-form-item label="订单">
                <div class='order-title-box'>
                  <div class='order-title'>商品</div>
                  <div class='order-title'>数量</div>
                  <div class='order-title'>价格</div>
                </div>
                <div
                  :key='index'
                  v-for="(item,index) of props.row.basket.group"
                >
                  <div class='order-item-box'>
                    <div class="order-item">{{ item[0].nameWithSpecs }}</div>
                    <div class="order-item">{{ item[0].num }}</div>
                    <div class="order-item">{{ item[0].price*item[0].num }}</div>
                  </div>

                </div>
                <div class='order-summary-box'>

                  <div class="order-summary"><span class="title"> 数量:</span>{{ props.row.totalQuantity }}</div>
                  <div class="order-summary"><span class="title">总价:</span>{{ props.row.totalAmount }}</div>

                </div>
                <div class='order-summary-box'>

                  <div class="order-summary">
                    <span class="title">接单员:</span>{{ props.row.userInfo.userName }}
                  </div>

                </div>

              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="订单 ID"
          prop="orderId"
        >
        </el-table-column>
        <el-table-column
          label="总价格"
          prop="totalAmount"
        >
        </el-table-column>
        <!-- <el-table-column
          label="订单状态"
          prop="status"
        > -->
        </el-table-column>
        <el-table-column
          label="订单日期"
          prop="createTime"
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
import {
  // getOrderList,
  // getOrderCount,
  // getResturantDetail,
  // getUserInfo,
  // getAddressById
  getOrders
} from '@/apiService/clientApi'
export default {
  props: ['restaurantInfo'],
  data() {
    return {
      tableData: [],
      currentRow: null,
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1,
      restaurantId: null,
      expendRow: [],
      userId: null
    }
  },
  components: {
    headTop
  },
  created() {},
  mounted() {
    if (this.restaurantInfo) {
      this.initData()
    }
  },
  watch: {
    restaurantInfo: function(newValue) {
      this.restaurantId = newValue.restaurantId
      this.initData()
    }
  },
  methods: {
    async initData() {
      const result = await getOrders({
        userId: this.restaurantInfo.managerId,
        offset: this.offset,
        limit: this.limit
      })

      this.tableData = result.data
      this.count = result.count
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.offset = (val - 1) * this.limit
      this.getOrders()
    },
    async getOrders() {
      const Orders = await getOrderList({
        offset: this.offset,
        limit: this.limit,
        restaurant_id: this.restaurant_id
      })

      this.tableData = []
      Orders.forEach((item, index) => {
        // const tableData = {}
        // tableData.id = item.id
        // tableData.total_amount = item.total_amount
        // tableData.status = item.status_bar.title
        // tableData.user_id = item.user_id
        // tableData.restaurant_id = item.restaurant_id

        // tableData.index = index
        // this.tableData.push(tableData)
        const tableData = {}
        tableData.total_amount = item.total_amount
        tableData.status = item.status_bar.title
        tableData.id = item.id
        tableData.date = item.formatted_created_at
        tableData.basket = item.basket.group

        this.tableData.push(tableData)
      })
    },
    async expand(row, status) {
      if (status) {
        const restaurant = await getResturantDetail(row.restaurant_id)
        const userInfo = await getUserInfo(row.user_id)
        const addressInfo = await getAddressById(row.address_id)

        this.tableData.splice(row.index, 1, {
          ...row,
          ...{
            restaurant_name: restaurant.name,
            restaurant_address: restaurant.address,
            address: addressInfo.address,
            user_name: userInfo.username
          }
        })
        this.$nextTick(() => {
          this.expendRow.push(row.index)
        })
      } else {
        const index = this.expendRow.indexOf(row.index)
        this.expendRow.splice(index, 1)
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
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  // width: 50%;
  width: 100%;
}
.el-form-item__content {
  width: 100%;
}
.order-title-box {
  display: flex;
  font-weight: bold;
  .order-title {
    width: 20%;
  }
}
.order-item-box {
  display: flex;
  .order-item {
    width: 20%;
  }
}
.order-summary-box {
  display: flex;
  .order-summary {
    width: 20%;
    .title {
      font-weight: bold;
    }
  }
}
</style>
