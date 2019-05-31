import Vue from 'vue'
import Router from 'vue-router'
// import home from './views/home.vue'
// import login from './views/login.vue'
// import adminLogin from './views/adminLogin.vue'
// import helloWorld from './views/helloWorld.vue'
// import adminLayout from './views/adminLayout.vue'
// import adminHome from './views/adminHome.vue'
// import foodList from './views/foodList.vue'
// import orderList from './views/orderList.vue'
// import adminList from './views/adminList.vue'

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
const sendMessage = r =>
  require.ensure([], () => r(require('@/views/sendMessage')), 'sendMessage')
const explain = r =>
  require.ensure([], () => r(require('@/views/explain')), 'explain')
const notFound = r => require.ensure([], () => r(require('@/views/404')), '404')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Login',
      component: login,
      meta: []
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      meta: ['manager', 'superManager']
    },
    {
      path: '/admin',
      component: adminLogin,
      name: '',
      meta: []
    },
    {
      path: '/manage/',
      component: adminLayout,
      name: '',
      children: [
        {
          path: '',
          component: adminHome,
          meta: ['manager', 'superManager']
        },
        {
          path: 'addShop',
          component: addShop,
          meta: ['manager', 'superManager']
        },
        {
          path: 'addGoods',
          component: addGoods,
          meta: ['manager', 'superManager']
        },
        {
          path: 'userList',
          component: userList,
          meta: ['manager', 'superManager']
        },
        {
          path: 'shopList',
          component: shopList,
          meta: ['manager', 'superManager']
        },
        {
          path: 'foodList',
          component: foodList,
          meta: ['manager', 'superManager']
        },
        {
          path: 'orderList',
          component: orderList,
          meta: ['manager', 'superManager']
        },
        {
          path: 'adminList',
          component: adminList,
          meta: ['manager', 'superManager']
        },
        {
          path: 'visitor',
          component: visitor,
          meta: ['manager', 'superManager']
        },
        {
          path: 'newMember',
          component: newMember,
          meta: ['manager', 'superManager']
        },
        {
          path: 'uploadImg',
          component: uploadImg,
          meta: ['manager', 'superManager']
        },
        {
          path: 'vueEdit',
          component: vueEdit,
          meta: ['manager', 'superManager']
        },
        {
          path: 'adminSet',
          component: adminSet,
          meta: ['manager', 'superManager']
        },
        {
          path: 'sendMessage',
          component: sendMessage,
          meta: ['manager', 'superManager']
        },
        {
          path: 'explain',
          component: explain,
          meta: ['manager', 'superManager']
        }
      ]
    },
    {
      path: '/404',
      component: notFound,
      name: '',
      meta: []
    }
  ]
})
