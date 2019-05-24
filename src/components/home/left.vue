<template>
  <div class="home-left">
    <el-tabs>
      <el-tab-pane label="点餐">
        <el-table
          :data="cartFoodList"
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
                @click="addToCart(scope.row.category_id, scope.row.item_id, scope.row.food_id, scope.row.name, scope.row.price, scope.row.specs)"
              >+</el-button>
              <el-button
                type="danger"
                size="small"
                @click="removeOutCart(scope.row.category_id, scope.row.item_id, scope.row.food_id, scope.row.name, scope.row.price, scope.row.specs)"
              >-</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="totalDiv">
          <small>数量：</small>

          <strong>{{totalNum}}</strong> &nbsp;&nbsp;&nbsp;&nbsp;
          <small>总计：</small>
          <strong>{{totalPrice}}</strong> 元
        </div>

        <div class="order-btn">

          <el-button type="warning">挂单</el-button>
          <el-button
            type="danger"
            @click="clearCart()"
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
export default {
  props: {
    menu: { type: Array },
    shopId: { type: String }
  },
  data() {
    return {
      data: [],
      tableData: [], //订单列表的值
      cartFoodList: [],
      totalMoney: 0, //订单总价格

      totalPrice: 0
    }
  },
  created() {
    this.initCategoryNum()
  },
  mounted: function() {
    var orderHeight = document.body.clientHeight
    document.getElementById('order-list').style.height = orderHeight + 'px'
  },
  computed: {
    ...mapState(['cartList']),
    //当前商店购物信息
    shopCart: function() {
      return { ...this.cartList[this.shopId] }
    },
    //购物车中总共商品的数量
    totalNum: function() {
      let num = 0
      this.cartFoodList.forEach(item => {
        num += item.num
      })
      return num
    }
  },
  watch: {
    //showLoading变化时说明组件已经获取初始化数据，在下一帧nextTick进行后续操作

    shopCart: function(value) {
      this.initCategoryNum()
    },
    //购物车列表发生变化，没有商铺时，隐藏
    cartFoodList: function(value) {
      if (!value.length) {
        this.showCartList = false
      }
    }
  },
  methods: {
    ...mapMutations(['ADD_CART', 'REDUCE_CART', 'CLEAR_CART']),
    //加入购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
    addToCart(category_id, item_id, food_id, name, price, specs) {
      // console.log('add', category_id, item_id, food_id, name, price, specs)

      this.ADD_CART({
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
      // console.log('remove', category_id, item_id, food_id, name, price, specs)

      this.REDUCE_CART({
        shopid: this.shopId,
        category_id,
        item_id,
        food_id,
        name,
        price,
        specs
      })
    },
    /**
     * 初始化和shopCart变化时，重新获取购物车改变过的数据，赋值 categoryNum，totalPrice，cartFoodList，整个数据流是自上而下的形式，所有的购物车数据都交给vuex统一管理，包括购物车组件中自身的商品数量，使整个数据流更加清晰
     */
    initCategoryNum() {
      let newArr = []
      let cartFoodNum = 0
      this.totalPrice = 0
      this.cartFoodList = []
      this.menu.forEach((item, index) => {
        if (this.shopCart && this.shopCart[item.foods[0].category_id]) {
          let num = 0
          Object.keys(this.shopCart[item.foods[0].category_id]).forEach(
            itemid => {
              Object.keys(
                this.shopCart[item.foods[0].category_id][itemid]
              ).forEach(foodid => {
                let foodItem = this.shopCart[item.foods[0].category_id][itemid][
                  foodid
                ]
                num += foodItem.num
                if (item.type == 1) {
                  this.totalPrice += foodItem.num * foodItem.price
                  if (foodItem.num > 0) {
                    this.cartFoodList[cartFoodNum] = {}
                    this.cartFoodList[cartFoodNum].category_id =
                      item.foods[0].category_id
                    this.cartFoodList[cartFoodNum].item_id = itemid
                    this.cartFoodList[cartFoodNum].food_id = foodid
                    this.cartFoodList[cartFoodNum].num = foodItem.num
                    this.cartFoodList[cartFoodNum].price = foodItem.price
                    this.cartFoodList[cartFoodNum].name = foodItem.name
                    this.cartFoodList[cartFoodNum].specs = foodItem.specs
                    cartFoodNum++
                  }
                }
              })
            }
          )
          newArr[index] = num
        } else {
          newArr[index] = 0
        }
      })
      this.totalPrice = this.totalPrice.toFixed(2)
      this.categoryNum = [...newArr]
      console.log('cartFoodList', this.cartFoodList)
    },
    //清除购物车
    clearCart() {
      // this.toggleCartList();
      this.CLEAR_CART(this.shopId)
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
