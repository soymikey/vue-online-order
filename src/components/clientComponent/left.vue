<template>
  <div class="home-left">
    <el-tabs>
      <el-tab-pane label="点餐">
        <div id='order-details'>
          <el-table
            :data="cartList"
            style="width: 100%"
            @cell-dblclick="showDialog"
            border
            :height='tableHeight'
          >

            >
            <el-table-column
              prop="nameWithSpecs"
              label="商品"
            >
              <template slot-scope="scope">
                {{ scope.row.nameWithSpecs }}

                <div v-if="scope.row.extra">
                  <el-tag
                    size="medium"
                    v-for="item in scope.row.extra"
                  >{{item.name }}</el-tag>
                </div>

              </template>

            </el-table-column>
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
                  @click="addToCart(scope.row.id, scope.row.name, scope.row.price, scope.row.specs,scope.row.extra)"
                >+</el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="removeOutCart(scope.row)"
                >-</el-button>
              </template>
            </el-table-column>
          </el-table>

        </div>
        <div class="summary">
          <div class="totalDiv">
            <small>数量：</small>

            <strong>{{totalNum}}</strong> &nbsp;&nbsp;&nbsp;&nbsp;
            <small>总计：</small>
            <strong>{{totalPrice}}</strong> 元
          </div>
          <div class="order-btn">
            <el-button
              type="warning"
              class="button"
              :disabled='totalNum===0'
            >挂单</el-button>
            <el-button
              type="danger"
              class="button"
              @click="clearCart()"
              :disabled='totalNum===0'
            >删除</el-button>
            <el-button
              type="success"
              class="button"
              @click="checkout()"
              :disabled='totalNum===0'
            > 结账</el-button>

          </div>
        </div>

      </el-tab-pane>

      <el-tab-pane label="挂单">
        挂单
      </el-tab-pane>
      <el-tab-pane label="外卖">
        外卖
      </el-tab-pane>

    </el-tabs>
    <!-- 显示额外添加 -->
    <section
      class='extra-dialog'
      v-if="showExtra"
    >
      <el-dialog
        title='额外'
        :visible.sync="showExtra"
        width="80%"
      >

        <el-tabs
          type="border-card"
          tab-position='left'
          style="height: 100%;"
        >
          <el-tab-pane
            v-bind:key="category.name"
            v-for="category in extraMenu "
            :label="category.name"
            class="tag-container"
          >
            <div
              v-for="item in category.children"
              :label="item"
              class="tag"
            >
              <el-checkbox-button v-model="item.selected">{{item.name}}</el-checkbox-button>
            </div>

          </el-tab-pane>
        </el-tabs>
        <div class="button-container">
          <el-button @click="cancelExtra">取 消</el-button>
          <el-button
            type="primary"
            @click="confirmExtra"
          >确 定</el-button>
        </div>

      </el-dialog>
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import PrintHTML from '../../config/PrintHTML.js'
import extraMenu from '../../assets/extraMenu.js'

export default {
  props: {
    menu: { type: Array },
    shopId: { type: String }
  },
  data() {
    return {
      data: [],
      tableData: [], //订单列表的值

      totalMoney: 0, //订单总价格
      tableHeight: window.innerHeight - 216, //table的高度
      showExtra: false,
      extraMenu: extraMenu,
      selectedFood: null,
      canvasUrl: null
    }
  },
  created() {},
  mounted: function() {
    window.addEventListener(
      'resize',
      function(event) {
        this.tableHeight = event.currentTarget.innerHeight - 216
      }.bind(this)
    )
  },
  computed: {
    ...mapState(['cartList']),

    //购物车中总共商品的价格
    totalPrice: function() {
      let total = 0
      this.cartList.forEach(item => {
        total += item.num * item.price
      })
      return total.toFixed(2)
    },

    //购物车中总共商品的数量
    totalNum: function() {
      let num = 0
      this.cartList.forEach(item => {
        num += item.num
      })
      return num
    }
  },
  watch: {},
  methods: {
    ...mapMutations(['ADD_CART', 'REDUCE_CART', 'CLEAR_CART']),
    //加入购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格

    addToCart(food_id, name, price, specs, extra) {
      // console.log('add', category_id, item_id, food_id, name, price, specs)
      let nameWithSpecs = specs ? `${name}+${specs}` : name
      this.ADD_CART({
        shopid: this.shopId,
        food_id,
        name,
        price,
        specs,
        nameWithSpecs,
        extra
      })
    },

    //移出购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
    removeOutCart(food) {
      let index = this.cartList.indexOf(food)

      this.REDUCE_CART({
        index
      })
    },

    //清除购物车
    clearCart() {
      // this.toggleCartList();
      this.CLEAR_CART()
    },
    showDialog(row, column, cell, event) {
      console.log('show')

      if (column.label == '商品') {
        this.selectedFood = row

        if (this.selectedFood.extra.length) {
          //把已选择的extra id 放到数组里面
          let extraId = []
          for (const extra of this.selectedFood.extra) {
            extraId.push(extra.id)
          }

          for (const category of this.extraMenu) {
            for (const item of category.children) {
              if (extraId.includes(item.id)) {
                item.selected = true
              } else {
                item.selected = false
              }
            }
          }
        } else {
          for (const category of this.extraMenu) {
            for (const item of category.children) {
              item.selected = false
            }
          }
        }
        this.showExtra = !this.showExtra
      }
    },

    cancelExtra() {
      this.showExtra = !this.showExtra
    },
    confirmExtra() {
      const selectedExtraList = []
      for (const category of this.extraMenu) {
        for (const item of category.children) {
          if (item.selected) {
            selectedExtraList.push({
              name: category.name + item.name,
              id: item.id
            })
          }
        }
      }

      if (this.selectedFood.num > 1) {
        this.selectedFood.num--
        let food_id = this.selectedFood.id
        let name = this.selectedFood.name
        let price = this.selectedFood.price
        let specs = this.selectedFood.specs
        let nameWithSpecs = this.selectedFood.nameWithSpecs
        let extra = this.selectedFood.extra

        this.ADD_CART({
          shopid: this.shopId,
          food_id,
          name,
          price,
          specs,
          nameWithSpecs,
          extra: [...selectedExtraList]
        })
      } else {
        this.selectedFood.extra = [...selectedExtraList]
      }

      this.showExtra = !this.showExtra
    },
    checkout() {
      if (this.cartList.length) {
        // printPDF()
        PrintHTML(this.cartList, this.totalNum, this.totalPrice)
      } else {
        window.alert('没有需要打印的')
      }
    }
  }
}
</script>

<style scoped  lang="scss">
.order-btn {
  margin-top: 20px;
  margin-bottom: 20px;
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
.button-container {
  margin-top: 30px;
}
.tag-container {
  display: flex;
  flex-wrap: wrap;
  .tag {
    // width: 10%;
  }
}
.button {
  width: 150px;
  height: 80px;
}
</style>
