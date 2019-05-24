import { Add_TO_BASKET, REMOVE_FROM_BASKET } from './mutation-types.js'

import { setStore, getStore } from '../config/mUtils'

export default {
  // 加入购物车
  [Add_TO_BASKET] (
    state,
    {
      shopid,
      category_id,
      item_id,
      food_id,
      name,
      price,
      specs,
      packing_fee,
      sku_id,
      stock
    }
  ) {
    let cart = state.cartList
    let shop = (cart[shopid] = cart[shopid] || {})
    let category = (shop[category_id] = shop[category_id] || {})
    let item = (category[item_id] = category[item_id] || {})
    if (item[food_id]) {
      item[food_id]['num']++
    } else {
      item[food_id] = {
        num: 1,
        id: food_id,
        name: name,
        price: price,
        specs: specs,
        packing_fee: packing_fee,
        sku_id: sku_id,
        stock: stock
      }
    }
    state.cartList = { ...cart }
    // 存入localStorage
    setStore('basket', state.cartList)
  },
  // 移出购物车
  [REMOVE_FROM_BASKET] (
    state,
    { shopid, category_id, item_id, food_id, name, price, specs }
  ) {
    let cart = state.cartList
    let shop = cart[shopid] || {}
    let category = shop[category_id] || {}
    let item = category[item_id] || {}
    if (item && item[food_id]) {
      if (item[food_id]['num'] > 0) {
        item[food_id]['num']--
        state.cartList = { ...cart }
        // 存入localStorage
        setStore('buyCart', state.cartList)
      } else {
        // 商品数量为0，则清空当前商品的信息
        item[food_id] = null
      }
    }
  }
}
