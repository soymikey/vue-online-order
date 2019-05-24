<template>
  <div class="home-left">
    <el-tabs>
      <el-tab-pane label="点餐">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            label="商品"
          ></el-table-column>
          <el-table-column
            prop="num"
            label="数量"
            width="70"
          ></el-table-column>
          <!-- <el-table-column
                  prop="price"
                  label="金额"
                  width="70"
                ></el-table-column> -->
          <el-table-column
            label="操作"
            width="110"
          >
            <template scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="addToCart(scope.row,scope.row.category_id, scope.row.item_id, scope.row.food_id, scope.row.name, scope.row.price, scope.row.specs)"
              >+</el-button>
              <el-button
                type="danger"
                size="small"
                @click="removeOutCart(scope.row)"
              >-</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="totalDiv">
          <small>数量：</small>

          <strong>{{totalCount}}</strong> &nbsp;&nbsp;&nbsp;&nbsp;
          <small>总计：</small>
          <strong>{{totalMoney}}</strong> 元
        </div>

        <div class="order-btn">

          <el-button type="warning">挂单</el-button>
          <el-button
            type="danger"
            @click="delAllGoods()"
          >删除</el-button>
          <el-button
            type="success"
            @click="checkout()"
          > 结账</el-button>

        </div>
      </el-tab-pane>

      <el-tab-pane label="挂单">
        挂单
      </el-tab-pane>
      <el-tab-pane label="外卖">
        外卖
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { totalmem } from 'os'
export default {
  data() {
    return {
      data: [],
      tableData: [], //订单列表的值

      totalMoney: 0, //订单总价格
      totalCount: 0, //订单商品总数量
      shopId: null
    }
  },
  created() {
    this.shopId = '2'
  },
  mounted: function() {
    var orderHeight = document.body.clientHeight

    document.getElementById('order-list').style.height = orderHeight + 'px'
  },
  computed: {
    ...mapState(['cartList'])
  },
  watch: {
    cartList: function(val) {
      const cartListCopyVersion = JSON.parse(JSON.stringify(this.cartList))
      let newTableData = []
      let totalMoney = 0
      let totalCount = 0
      const categories = Object.values(Object.values(cartListCopyVersion)[0])
      categories.forEach(category => {
        Object.values(category).forEach(food => {
          Object.values(food).forEach(foodSpecs => {
            newTableData.push(foodSpecs)
          })
        })
      })
      newTableData.forEach(item => {
        totalMoney += item.num * item.price
        totalCount += item.num
        item.name = `${item.name}${
          item.specs == '默认' ? '' : '+' + item.specs
        }`
      })
      this.tableData = newTableData
      this.totalCount = totalCount
      this.totalMoney = totalMoney
    }
  },
  methods: {
    ...mapMutations(['Add_TO_BASKET', 'REMOVE_FROM_BASKET']),
    //加入购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
    addToCart(value, category_id, item_id, food_id, name, price, specs) {
      console.log('value', value)

      this.Add_TO_BASKET({
        shopid: this.shopId,
        category_id,
        item_id,
        food_id,
        name,
        price,
        specs
      })
    },

    //移出购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
    removeOutCart(category_id, item_id, food_id, name, price, specs) {
      this.REMOVE_FROM_BASKET({
        shopid: this.shopId,
        category_id,
        item_id,
        food_id,
        name,
        price,
        specs
      })
    },

    //删除所有商品
    delAllGoods() {
      this.tableData = []
      this.totalCount = 0
      this.totalMoney = 0
    },
    //汇总数量和金额
    getAllMoney() {
      this.totalCount = 0
      this.totalMoney = 0
      if (this.tableData) {
        this.tableData.forEach(element => {
          this.totalCount += element.count
          this.totalMoney = this.totalMoney + element.price * element.count
        })
      }
    },
    //结账方法模拟
    checkout() {
      if (this.totalCount != 0) {
        this.tableData = []
        this.totalCount = 0
        this.totalMoney = 0
        this.$message({
          message: '结账成功，感谢你又为店里出了一份力!',
          type: 'success'
        })
      } else {
        this.$message.error('不能空结。老板了解你急切的心情！')
      }
    }
  }
}
</script>

<style scoped  lang="scss">
.order-btn {
  margin-top: 10px;
  text-align: center;
}

.title {
  height: 20px;
  border-bottom: 1px solid #d3dce6;
  background-color: #f9fafc;
  padding: 10px;
}

.often-goods-list ul li {
  list-style: none;
  float: left;
  border: 1px solid #e5e9f2;
  padding: 10px;
  margin: 5px;
  background-color: #fff;
  cursor: pointer;
}

.goods-type {
  clear: both;
}

.o-price {
  color: #58b7ff;
}

.often-goods-list {
  border-bottom: 1px solid #c0ccda;
  height: auto;
  overflow: hidden;
  padding-bottom: 10px;
  background-color: #f9fafc;
}
.cookList {
  padding: 0 10px;
  display: flex;
  flex-wrap: wrap;
}

.cookList li {
  list-style: none;
  width: 20%;
  box-sizing: border-box;
  border: 3px solid #eff2f7;
  height: auot;
  background-color: #fff;
  padding: 2px;
  /* margin: 2px; */
  cursor: pointer;
  text-align: center;
}

.cookList li span {
  display: block;
  /* float: left; */
}

.foodImg {
  width: 40%;
  height: 100px;
}

.foodName {
  font-size: 13px;

  color: brown;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.foodPrice {
  font-size: 16px;
  padding-left: 10px;
  padding-top: 10px;
}

.totalDiv {
  height: auot;
  overflow: hidden;
  text-align: right;
  font-size: 16px;
  background-color: #fff;
  border-bottom: 1px solid #e5e9f2;
  padding: 10px;
}
.red {
  color: red;
}
</style>
