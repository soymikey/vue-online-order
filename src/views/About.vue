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
