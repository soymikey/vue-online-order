<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">

      <el-table
        :data="tableData"
        :row-key="row => row.orderId"
        style="width: 100%"
      >

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
        >
        </el-table-column>-->
        <el-table-column
          label="订单日期"
          prop="createdDate"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="160"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="handleView(scope.row)"
            >查看</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
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

      <el-dialog
        title="订单详情"
        v-if="dialogFormVisible"
        :visible.sync="dialogFormVisible"
        width='30%'
      >
        <el-form>

          <el-form-item label="">
            <div class='order-title-box'>

              <div class='order-title-name'>商品</div>
              <div class='order-title'>数量</div>
              <div class='order-title'>价格</div>
            </div>
            <div
              :key='index'
              v-for="(item,index) of currentRow.basket.group"
            >

              <div class='order-item-box'>

                <div class="order-item-title">{{ item[0].nameWithSpecs }}

                  <div
                    class="order-item-tags"
                    v-if="item[0].extra.length"
                  >

                    <el-tag
                      size="medium"
                      :key='index'
                      v-for="(eachExtra,index) of item[0].extra"
                    >{{eachExtra.name }}</el-tag>

                  </div>

                </div>

                <div class="order-item">{{ item[0].num }}</div>

                <div class="order-item">{{ item[0].price*item[0].num }}</div>
              </div>

            </div>
            <div class='order-summary-box'>
              <div class="order-summary"><span class="title">接单员:</span>{{currentRow.userInfo.userName }}</div>
              <div class="order-summary-quantity"><span class="title"> 数量:</span>{{ currentRow.totalQuantity }}</div>
              <div class="order-summary-price"><span class="title">总价:</span>{{currentRow.totalAmount }}</div>

            </div>

            <div class="button-container">
              <el-button
                size="medium "
                type="primary"
                @click="print(scope.row)"
              >打印</el-button>
            </div>

          </el-form-item>

        </el-form>

      </el-dialog>
      <el-dialog
        title="提示"
        :visible.sync="dialogDeleteVisible"
        width="30%"
        center
      >
        <span>确定要删除{{currentRow.orderId}}订单吗?</span>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogDeleteVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="confirmDeleteButton"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// @click="handleDelete(scope.$index,scope.row)"
import headTop from '@/components/adminComponent/headTop'
import PrintHTML from '../config/PrintHTML.js'
import { getOrders, deleteOrder } from '@/apiService/clientApi'
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
      userId: null,
      dialogFormVisible: false,
      dialogDeleteVisible: false,
      currentRow: {}
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
        restaurantId: this.restaurantInfo.restaurantId,
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
        restaurant_id: this.restaurantInfo.restaurantId
      })

      this.tableData = []
      Orders.forEach((item, index) => {
        const tableData = {}
        tableData.total_amount = item.total_amount
        tableData.status = item.status_bar.title
        tableData.id = item.id
        tableData.date = item.formatted_created_at
        tableData.basket = item.basket.group

        this.tableData.push(tableData)
      })
    },
    handleView(row) {
      this.currentRow = row
      // this.getSelectItemData(row, 'edit')
      this.dialogFormVisible = true
    },
    handleDelete(row) {
      this.currentRow = row
      this.dialogDeleteVisible = true
    },
    async confirmDeleteButton() {
      try {
        const result = await deleteOrder({ orderId: this.currentRow.orderId })

        this.$message({
          type: 'success',
          message: result.message
        })
        this.dialogDeleteVisible = false
        this.tableData = this.tableData.filter(
          row => row.orderId !== this.currentRow.orderId
        )
      } catch (err) {
        this.$message({
          type: 'error',
          message: err.message
        })
      }
    },

    print() {
      console.log('print')
    }
  }
}
</script>

<style lang="scss">
@import '../style/mixin';
.table_container {
  padding: 20px;
}

.el-form-item__content {
  width: 100%;
  font-size: 17px;
}

.order-title-box {
  display: flex;
  font-weight: bold;
  .order-title-name {
    width: 50%;
  }
  .order-title {
    width: 20%;
  }
}
.order-item-box {
  display: flex;
  .order-item-title {
    width: 50%;
  }
  .order-item-tags {
    display: flex;
    flex-wrap: wrap;
  }

  .order-item {
    width: 20%;
  }
}
.order-summary-box {
  display: flex;
  .title {
    font-weight: bold;
  }
  .order-summary {
    flex: 5;
  }
  .order-summary-quantity {
    flex: 2;
  }
  .order-summary-price {
    flex: 3;
  }
}
.button-container {
  display: flex;
  justify-content: center;
}
</style>
