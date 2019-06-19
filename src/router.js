import Vue from 'vue'
import Router from 'vue-router'

const login = r =>
  require.ensure([], () => r(require('@/views/login')), 'login') //client 登入页面
const home = r => require.ensure([], () => r(require('@/views/home')), 'home') // client 点餐页面

const adminLogin = r =>
  require.ensure([], () => r(require('@/views/adminLogin')), 'login') //admin登入

const adminLayout = r =>
  require.ensure([], () => r(require('@/views/adminLayout')), 'adminLayout')
const adminHome = r =>
  require.ensure([], () => r(require('@/views/adminHome')), 'adminHome') //

const addShop = r =>
  require.ensure([], () => r(require('@/views/addShop')), 'addShop')
const addGoods = r =>
  require.ensure([], () => r(require('@/views/addGoods')), 'addGoods')
const userList = r =>
  require.ensure([], () => r(require('@/views/userList')), 'userList')
const shopList = r =>
  require.ensure([], () => r(require('@/views/shopList')), 'shopList')
const foodList = r =>
  require.ensure([], () => r(require('@/views/foodList')), 'foodList')
const orderList = r =>
  require.ensure([], () => r(require('@/views/orderList')), 'orderList')
const adminList = r =>
  require.ensure([], () => r(require('@/views/adminList')), 'adminList')
const visitor = r =>
  require.ensure([], () => r(require('@/views/visitor')), 'visitor')
const newMember = r =>
  require.ensure([], () => r(require('@/views/newMember')), 'newMember')
const uploadImg = r =>
  require.ensure([], () => r(require('@/views/uploadImg')), 'uploadImg')
const vueEdit = r =>
  require.ensure([], () => r(require('@/views/vueEdit')), 'vueEdit')
const adminSet = r =>
  require.ensure([], () => r(require('@/views/adminSet')), 'adminSet')
const addStaff = r =>
  require.ensure([], () => r(require('@/views/addStaff')), 'addStaff')
const sendMessage = r =>
  require.ensure([], () => r(require('@/views/sendMessage')), 'sendMessage')
const explain = r =>
  require.ensure([], () => r(require('@/views/explain')), 'explain')
const notFound = r => require.ensure([], () => r(require('@/views/404')), '404')
const draggble = r =>
  require.ensure([], () => r(require('@/views/draggble')), 'draggble')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Login',
      component: login,

      authorisation: []
    },
    {
      path: '/draggable',
      name: 'draggable',
      component: draggble,

      authorisation: ['staff', 'manager']
    },

    {
      path: '/home',
      name: 'home',
      component: home,

      authorisation: ['staff', 'manager']
    },

    {
      path: '/manage/',
      component: adminLayout,
      name: '',
      authorisation: ['manager'],
      children: [
        {
          path: 'home',
          component: adminHome,
          meta: [],
          authorisation: ['manager']
        },
        {
          path: 'addShop',
          component: addShop,
          meta: ['设置', '商铺设置'],
          authorisation: ['manager']
        },
        {
          path: 'addGoods',
          component: addGoods,
          meta: ['添加数据', '添加商品'],
          authorisation: ['manager']
        },
        {
          path: 'userList',
          component: userList,
          meta: ['数据管理', '用户列表'],
          authorisation: ['manager']
        },
        {
          path: 'shopList',
          component: shopList,
          meta: ['数据管理', '商家列表'],
          authorisation: ['manager']
        },
        {
          path: 'foodList',
          component: foodList,
          meta: ['数据管理', '食品列表'],
          authorisation: ['manager']
        },
        {
          path: 'orderList',
          component: orderList,
          meta: ['数据管理', '订单列表'],
          authorisation: ['manager']
        },
        {
          path: 'adminList',
          component: adminList,
          meta: ['数据管理', '管理员列表'],
          authorisation: ['manager']
        },
        {
          path: 'visitor',
          component: visitor,
          meta: ['图表', '用户分布'],
          authorisation: ['manager']
        },
        {
          path: 'newMember',
          component: newMember,
          meta: ['图表', '用户数据'],
          authorisation: ['manager']
        },
        {
          path: 'uploadImg',
          component: uploadImg,
          meta: ['文本编辑', 'MarkDown'],
          authorisation: ['manager']
        },
        {
          path: 'vueEdit',
          component: vueEdit,
          meta: ['编辑', '文本编辑'],
          authorisation: ['manager']
        },
        {
          path: 'adminSet',
          component: adminSet,
          meta: ['设置', '管理员设置'],
          authorisation: ['manager']
        },
        {
          path: 'addStaff',
          component: addStaff,
          meta: ['设置', '员工设置'],
          authorisation: ['manager']
        },
        {
          path: 'sendMessage',
          component: sendMessage,
          meta: ['设置', '发送通知'],
          authorisation: ['manager']
        },
        {
          path: 'explain',
          component: explain,
          meta: ['说明', '说明'],
          authorisation: ['manager']
        }
      ]
    },
    {
      path: '/404',
      component: notFound,
      name: '',
      meta: ['店铺管理'],
      authorisation: []
    }
  ]
})
