<template>
  <div class="home-right">
    <div class="often-goods">
      <div class="title">常用商品<div>{{specsIndex}}</div>
      </div>
      <div class="often-goods-list">

        <ul>
          <!-- <li
                  v-for="goods in oftenGoods"
                  @click="addOrderList(goods)"
                >
                  <span>{{goods.goodsName}}</span>
                  <span class="o-price">￥{{goods.price}}元</span>
                </li> -->

        </ul>
      </div>
    </div>

    <div class="goods-type">

      <el-tabs stretch>
        <el-tab-pane
          v-bind:key="category.id"
          :label="category.name"
          v-for="category in menu"
        >
          <ul class='cookList'>
            <li
              v-bind:key="item.item_id"
              v-for="item in category.foods"
            >
              <section
                v-if="!item.specifications.length"
                @click="addToCart(item.specfoods[0].food_id, item.specfoods[0].name, item.specfoods[0].price,'',)"
              >
                <!-- <span class="foodImg">
                      <img
                        :src="goods.image"
                        style="height: 100%; width: 100%;"
                      >
                    </span> -->
                <span class="foodName">{{item.name}}</span>
                <span class="foodPrice">￥{{item.specfoods[0].price}}元</span>

              </section>
              <section
                v-else
                @click="showChooseList(item)"
              > <span class="foodName">{{item.name}}</span>
                <span class="foodPrice">￥{{item.specfoods[0].price}}元</span>
              </section>
            </li>
          </ul>
        </el-tab-pane>

      </el-tabs>
    </div>
    <section
      class='specs-dialog'
      v-if="showSpecs"
    >
      <el-dialog
        :visible.sync="showSpecs"
        :title="choosedFoods.name"
      >
        <section class="specs_details">
          <h5 class="specs_details_title">{{choosedFoods.specifications[0].name}}</h5>
          <div class="spec-button">
            <el-button
              v-for="(item, itemIndex) in choosedFoods.specifications[0].values"
              :class="{specs_activity: itemIndex == specsIndex}"
              :key="itemIndex"
              @click="chooseSpecs(itemIndex)"
            > {{item}}</el-button>

          </div>
        </section>
        <footer class="specs_footer">
          <div class="specs_price">
            <span>¥ </span>
            <span>{{choosedFoods.specfoods[specsIndex].price}}</span>
          </div>

          <el-button
            type="primary"
            class="specs_addto_cart"
            @click="addSpecs(choosedFoods.specfoods[specsIndex].food_id, choosedFoods.specfoods[specsIndex].name, choosedFoods.specfoods[specsIndex].price, choosedFoods.specifications[0].values[specsIndex])"
          >加入购物车</el-button>
        </footer>

      </el-dialog>
    </section>

  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { spread } from 'q'
export default {
  name: 'home-right',
  props: {
    menu: { type: Array },
    shopId: { type: String }
  },
  components: {},
  data() {
    return {
      choosedFoods: null,
      showSpecs: false,
      specsIndex: 0
    }
  },
  created() {},
  computed: {},
  methods: {
    ...mapMutations(['ADD_CART']),
    //加入购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格

    addToCart(food_id, name, price, specs) {
      this.ADD_CART({
        shopid: this.shopId,
        food_id,
        name,
        price,
        specs,
        nameWithSpecs: name,
        extra: []
      })
    },

    showChooseList(foods) {
      if (foods) {
        this.choosedFoods = foods
      }
      this.showSpecs = !this.showSpecs
      this.specsIndex = 0
    },
    //记录当前所选规格的索引值
    chooseSpecs(index) {
      this.specsIndex = index
    },
    //多规格商品加入购物车
    addSpecs(food_id, name, price, specs) {
      let nameWithSpecs = specs
        ? `${name}${specs == '默认' ? '' : '+' + specs}`
        : name
      this.ADD_CART({
        shopid: this.shopId,
        food_id,
        name,
        price,
        specs,
        nameWithSpecs,
        extra: []
      })
      this.showChooseList()
    }
  }
}
</script>

<style scoped lang="scss">
.pos {
  font-size: 12px;
  text-align: center;
}

.pos-order {
  background-color: #f9fafc;
  border-right: 1px solid #c0ccda;
}

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
.specs_activity {
  border-color: #3199e8;
  color: #3199e8;
}
</style>
