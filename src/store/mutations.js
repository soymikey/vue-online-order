import {
  SAVE_ADMIN_INFO,
  RECORD_ADDRESS,
  RESET_STATE,
  ADD_CART,
  REDUCE_CART,
  INIT_BUYCART,
  CLEAR_CART,
  RECORD_SHOPDETAIL,
  RECORD_USERINFO,
  GET_USERINFO,
  CONFIRM_REMARK,
  CONFIRM_INVOICE,
  CHOOSE_SEARCH_ADDRESS,
  SAVE_GEOHASH,
  CONFIRM_ADDRESS,
  CHOOSE_ADDRESS,
  NEED_VALIDATION,
  SAVE_CART_ID_SIG,
  SAVE_ORDER_PARAM,
  CHANGE_ORDER_PARAM,
  ORDER_SUCCESS,
  SAVE_SHOPID,
  SAVE_ORDER,
  OUT_LOGIN,
  RETSET_NAME,
  SAVE_AVANDER,
  SAVE_ADDRESS,
  SAVE_ADDDETAIL,
  SAVE_QUESTION,
  ADD_ADDRESS,
  BUY_CART
} from './mutation-types.js'

import { setStore, getStore } from '../config/mUtils'

export default {
  [RESET_STATE](state) {
    Object.assign(state, {
      adminInfo: {
        avatar: 'default.jpg',
        status: 0 //0 是没有登陆，1 员工账号，2管理员账号
      },
      latitude: '', // 当前位置纬度
      longitude: '', // 当前位置经度
      cartList: [], // 加入购物车的商品列表
      restaurantInfo: null, // 商家详情信息
      userInfo: null, // 用户信息
      shopid: null, // 商铺id
      remarkText: null, // 可选备注内容
      inputText: '', // 输入备注内容
      invoice: false, // 开发票
      newAddress: [], // 确认订单页新的地址
      searchAddress: null, // 搜索并选择的地址
      geohash: '31.22299,121.36025', // 地址geohash值
      choosedAddress: null, // 选择地址
      addressIndex: null, // 选择地址的索引值
      needValidation: null, // 确认订单时是否需要验证
      cartId: null, // 购物车id
      sig: null, // 购物车sig
      orderParam: null, // 订单的参数
      orderMessage: null, // 订单返回的信息
      orderDetail: null, // 订单详情
      login: true, // 是否登录
      imgPath: null, // 头像地址
      removeAddress: [], // 移除地址
      addAddress: '', // 新增地址
      question: null, // 问题详情
      cartPrice: null // 会员卡价格
    })
  },
  [SAVE_ADMIN_INFO](state, userInfo) {
    state.userInfo = userInfo
  },
  // 记录当前经度纬度
  [RECORD_ADDRESS](state, { latitude, longitude }) {
    state.latitude = latitude
    state.longitude = longitude
  },

  [RECORD_SHOPDETAIL](state, detail) {
    state.restaurantInfo = detail
  },
  // 加入购物车
  [ADD_CART](
    state,
    { shopid, food_id, name, price, specs, nameWithSpecs, extra, food = '' }
  ) {
    let isHave = false
    let index = null
    let paramsExtraString = extra.map(item => item.name).toString()
    // 判断是否这个商品已经存在于订单列表

    for (let i = 0; i < state.cartList.length; i++) {
      let originalSpecs = state.cartList[i].specs
      let originalExtra = state.cartList[i].extra
        .map(item => item.name)
        .toString()
      if (
        state.cartList[i].id === food_id &&
        originalSpecs === specs &&
        originalExtra === paramsExtraString
      ) {
        isHave = true
        index = i
      }
    }

    if (isHave) {
      // 存在就进行数量添加
      if (food) {
        food.num--
      }
      let arr = state.cartList.filter(o => state.cartList.indexOf(o) === index)
      arr[0].num++
    } else {
      if (food) {
        if (food.num === 1) {
          food.extra = extra
        } else {
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
          food.num--
          state.cartList.push(newFoodObject)
        }
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
    }
    state.cartList = state.cartList.filter(food => food.num !== 0)
    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
  // 更新购物车
  [REDUCE_CART](state, { index }) {
    // 判断是否这个商品已经存在于订单列表
    for (let i = 0; i < state.cartList.length; i++) {
      if (i === index) {
        if (state.cartList[i].num > 1) {
          state.cartList[i].num--
        } else {
          state.cartList = state.cartList.filter(
            o => state.cartList.indexOf(o) !== index
          )
        }
      }
    }
  },
  // 移出购物车
  [REDUCE_CART](state, { index }) {
    // 判断是否这个商品已经存在于订单列表
    for (let i = 0; i < state.cartList.length; i++) {
      if (i === index) {
        if (state.cartList[i].num > 1) {
          state.cartList[i].num--
        } else {
          state.cartList = state.cartList.filter(
            o => state.cartList.indexOf(o) !== index
          )
        }
      }
    }
  },
  // 网页初始化时从本地缓存获取购物车数据
  [INIT_BUYCART](state) {
    let initCart = getStore('buyCart')
    if (initCart) {
      state.cartList = JSON.parse(initCart)
    }
  },
  // 清空当前商品的购物车信息
  [CLEAR_CART](state) {
    state.cartList = []
    setStore('buyCart', state.cartList)
  },
  // 记录用户信息
  [RECORD_USERINFO](state, info) {
    state.userInfo = info
    state.login = true
    setStore('user_id', info.user_id)
  },
  // 获取用户信息存入vuex
  [GET_USERINFO](state, info) {
    if (state.userInfo && state.userInfo.username !== info.username) {
      return
    }
    if (!state.login) {
      return
    }
    if (!info.message) {
      state.userInfo = { ...info }
    } else {
      state.userInfo = null
    }
  },
  // 修改用户名
  [RETSET_NAME](state, username) {
    state.userInfo = Object.assign({}, state.userInfo, { username })
  },
  // 保存商铺id
  [SAVE_SHOPID](state, shopid) {
    state.shopid = shopid
  },
  // 记录订单页面用户选择的备注, 传递给订单确认页面
  [CONFIRM_REMARK](state, { remarkText, inputText }) {
    state.remarkText = remarkText
    state.inputText = inputText
  },
  // 是否开发票
  [CONFIRM_INVOICE](state, invoice) {
    state.invoice = invoice
  },
  // 选择搜索的地址
  [CHOOSE_SEARCH_ADDRESS](state, place) {
    state.searchAddress = place
  },
  // 保存geohash
  [SAVE_GEOHASH](state, geohash) {
    state.geohash = geohash
  },
  // 确认订单页添加新的的地址
  [CONFIRM_ADDRESS](state, newAddress) {
    state.newAddress.push(newAddress)
  },
  // 选择的地址
  [CHOOSE_ADDRESS](state, { address, index }) {
    state.choosedAddress = address
    state.addressIndex = index
  },
  // 保存下单需要验证的返回值
  [NEED_VALIDATION](state, needValidation) {
    state.needValidation = needValidation
  },
  // 保存下单后购物id 和 sig
  [SAVE_CART_ID_SIG](state, { cart_id, sig }) {
    state.cart_id = cart_id
    state.sig = sig
  },
  // 保存下单参数，用户验证页面调用
  [SAVE_ORDER_PARAM](state, orderParam) {
    state.orderParam = orderParam
  },
  // 修改下单参数
  [CHANGE_ORDER_PARAM](state, newParam) {
    state.orderParam = Object.assign({}, state.orderParam, newParam)
  },
  // 下单成功，保存订单返回信息
  [ORDER_SUCCESS](state, order) {
    state.cartPrice = null
    state.orderMessage = order
  },
  // 进入订单详情页前保存该订单信息
  [SAVE_ORDER](state, orderDetail) {
    state.orderDetail = orderDetail
  },
  // 退出登录
  [OUT_LOGIN](state) {
    state.userInfo = {}
    state.login = false
  },
  // 保存图片
  [SAVE_AVANDER](state, imgPath) {
    state.imgPath = imgPath
  },
  // 删除地址列表
  [SAVE_ADDRESS](state, newAdress) {
    state.removeAddress = newAdress
  },
  // 添加地址name
  [SAVE_ADDDETAIL](state, addAddress) {
    state.addAddress = addAddress
  },
  // 保存所选问题标题和详情
  [SAVE_QUESTION](state, question) {
    state.question = { ...question }
  },
  // 增加地址
  [ADD_ADDRESS](state, obj) {
    state.removeAddress = [obj, ...state.removeAddress]
  },
  // 会员卡价格纪录
  [BUY_CART](state, price) {
    state.cartPrice = price
  }
}
