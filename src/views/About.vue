cartList: function(val) {
      const cartListCopyVersion = JSON.parse(JSON.stringify(this.cartList))
      console.log('cartListCopyVersion', cartListCopyVersion)

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
          >

            <ul class='cookList'>
              <li
                v-bind:key="item.name"
                v-for="item in category.children"
              >
                <section v-if="!item.length">
                  <span class="foodName">{{item.name}}</span>
                </section>
              </li>
            </ul>

          </el-tab-pane>

        </el-tabs>

        <el-button @click="showExtra = false">取 消</el-button>
        <el-button
          type="primary"
          @click="showExtra = false"
        >确 定</el-button>
        </span>
      </el-dialog>
    </section>


 for (let i = 0; i < state.cartList.length; i++) {
      let extraString = state.cartList[i].extra.toString()
      let paramsExtraString = extra.toString()
      if (
        state.cartList[i].id === food_id &&
        state.cartList[i].specs === specs &&
        extraString === paramsExtraString
      ) {
        if (state.cartList[i].num === 1) {
          state.cartList = state.cartList.filter(
            o => state.cartList.indexOf(o) !== i
          )
        } else {
          state.cartList[i].num--
          break
        }
      }
    }

     // 加入购物车
  [ADD_CART] (
    state,
    { shopid, food_id, name, price, specs, nameWithSpecs, extra }
  ) {
    let isHave = false

    // 判断是否这个商品已经存在于订单列表

    for (let i = 0; i < state.cartList.length; i++) {
      let extraString = state.cartList[i].extra.toString()
      let paramsExtraString = extra.toString()
      if (
        state.cartList[i].id === food_id &&
        state.cartList[i].specs === specs &&
        extraString === paramsExtraString
      ) {
        isHave = true // 存在
        console.log('存在')
      }
    }
    if (isHave) {
      // 存在就进行数量添加
      let arr = state.cartList.filter(
        o =>
          o.id === food_id &&
          o.specs === specs &&
          o.extra.toString() === extra.toString()
      )
      arr[0].num++
    } else {
      // 不存在就推入数组
      let newFoodObject = {
        shopId: shopid,
        num: 1,
        name,
        id: food_id,
        price,
        specs,
        nameWithSpecs,
        extra
      }
      state.cartList.push(newFoodObject)
    }

    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
