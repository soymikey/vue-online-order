<template>
  <div>
    <head-top></head-top>
    <section class="data_section">
      <header class="section_title">数据统计</header>
      <el-row
        :gutter="20"
        style="margin-bottom: 10px;"
      >
        <el-col :span="4">
          <div class="data_list today_head"><span class="data_num head">当日数据：</span></div>
        </el-col>

        <el-col :span="4">
          <div class="data_list"> 今日营业额<span class="data_num">{{totalMoneyCount}}</span></div>
        </el-col>
        <el-col :span="4">
          <div class="data_list"> 新增订单<span class="data_num">{{orderCount}}</span></div>
        </el-col>

      </el-row>

    </section>
    <tendency
      :sevenDate='sevenDate'
      :sevenDay='sevenDay'
    ></tendency>
  </div>
</template>

<script>
import headTop from '@/components/adminComponent/headTop'
import tendency from '@/components/adminComponent/tendency'
import moment from 'moment'
import { mapState } from 'vuex'

import { countOrder, totalMoneyOrder } from '@/apiService/clientApi'

export default {
  data() {
    return {
      userCount: null,
      orderCount: null,
      totalMoneyCount: null, // 营业额
      adminCount: null,
      allUserCount: null,
      allOrderCount: null,
      allAdminCount: null,
      sevenDay: [],
      sevenDate: [[], [], []]
    }
  },
  components: {
    headTop,
    tendency
  },
  mounted() {
    this.initData()
    for (let i = 6; i > -1; i--) {
      const date = moment(new Date().getTime() - 86400000 * i).format(
        'YYYY-MM-DD'
      )

      this.sevenDay.push(date)
    }

    this.getSevenData()
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    async initData() {
      const today = moment().format('YYYY-MM-DD')
      const orderTotalMoney = await totalMoneyOrder({
        date: today,
        restaurantId: this.userInfo.restaurantId
      })
      const orderCount = await countOrder({
        date: today,
        restaurantId: this.userInfo.restaurantId
      })

      this.orderCount = orderCount.data
      this.totalMoneyCount = orderTotalMoney.data

      // Promise.all([
      //   userCount(today),
      //   orderCount(today),
      //   adminDayCount(today),
      //   getUserCount(),
      //   getOrderCount(),
      //   adminCount()
      // ])
      //   .then(res => {
      //     this.userCount = res[0].count
      //     this.orderCount = res[1].count
      //     this.adminCount = res[2].count
      //     this.allUserCount = res[3].count
      //     this.allOrderCount = res[4].count
      //     this.allAdminCount = res[5].count
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
    },
    async getSevenData() {
      const apiArr = [[], [], []]
      this.sevenDay.forEach(day => {
        apiArr[0].push(
          totalMoneyOrder({
            date: day,
            restaurantId: this.userInfo.restaurantId
          })
        )
        apiArr[1].push(
          countOrder({ date: day, restaurantId: this.userInfo.restaurantId })
        )
        // apiArr[2].push(adminDayCount(item))
      })
      const promiseArr = [...apiArr[0], ...apiArr[1]]

      const res = await Promise.all(promiseArr)
      const resArr = [[], [], []]
      res.forEach((item, index) => {
        if (item.status == 1) {
          resArr[Math.floor(index / 7)].push(item.data)
        }
      })

      this.sevenDate = resArr
    }
  }
}
</script>

<style lang="scss">
@import '../style/mixin';
.data_section {
  padding: 20px;
  margin-bottom: 40px;
  .section_title {
    text-align: center;
    font-size: 30px;
    margin-bottom: 10px;
  }
  .data_list {
    text-align: center;
    font-size: 14px;
    color: #666;
    border-radius: 6px;
    background: #e5e9f2;
    .data_num {
      color: #333;
      font-size: 26px;
      margin: 0 10px 0 10px;
    }
    .head {
      border-radius: 6px;
      font-size: 22px;
      padding: 4px 0;
      color: #fff;
      display: inline-block;
    }
  }
  .today_head {
    background: #ff9800;
  }
  .all_head {
    background: #20a0ff;
  }
}
.wan {
  @include sc(16px, #333);
}
</style>
