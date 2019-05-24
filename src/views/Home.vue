<template>
  <div class="home">
    <homeNav></homeNav>
    <div class="main">
      <el-row>
        <el-col
          :span="8"
          class="pos-order"
          id="order-list"
        >
          <home-Left></home-Left>
        </el-col>
        <el-col :span="16">
          <home-Right :menu="menuList"></home-Right>
        </el-col>

      </el-row>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import homeLeft from '@/components/home/left.vue'
import homeRight from '@/components/home/right.vue'
import homeNav from '@/components/home/nav.vue'
import { shopDetails, foodMenu } from '@/service/getData'
export default {
  name: 'home',
  components: { homeNav, homeLeft, homeRight },
  mounted: function() {
    var orderHeight = document.body.clientHeight
    document.getElementById('order-list').style.height = orderHeight + 'px'
  },
  data() {
    return {
      tableData: [], //订单列表的值
      oftenGoods: [],
      type0Goods: [],
      type1Goods: [],
      type2Goods: [],
      type3Goods: [],
      totalMoney: 0, //订单总价格
      totalCount: 0, //订单商品总数量
      shopId: null,
      menuList: []
    }
  },
  created() {
    this.shopId = '2'
    // axios
    //   .get('http://localhost:8001/shopping/v2/menu?restaurant_id=2')
    //   .then(response => {
    //     // console.log("response", response);
    //     // this.oftenGoods = response.data;
    //     this.data = response.data

    //     console.log('data', this.data)
    //   })
    //   .catch(error => {
    //     console.log(error)
    //     alert('网络错误，不能访问')
    //   })
    // //读取分类商品列表

    // // const appData = require("../../assets/data.json");
    // // this.data = appData.goods;
    // // this.tableData = this.data[0].foods;
    // // console.log("appData", appData.goods[0]);

    // // const newData = JSON.parse(appData);
    // // console.log("newData", newData);
  },
  mounted() {
    this.initData()
    this.windowHeight = window.innerHeight
  },
  methods: {
    async initData() {
      //获取商铺信息
      // this.shopDetailData = await shopDetails(
      //   this.shopId,
      //   this.latitude,
      //   this.longitude
      // );
      //获取商铺食品列表
      this.menuList = await foodMenu(this.shopId)
    }
  }
}
</script>
<style scoped lang="scss">
.home {
  height: 100%;
  font-size: 12px;
  text-align: center;
}
.main {
  float: left;
  width: 95%;
  background-color: #eff2f7;
  height: 100%;
  overflow: auto;
}
.pos-order {
  background-color: #f9fafc;
  border-right: 1px solid #c0ccda;
}
</style>
