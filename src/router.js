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

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/admin',
      component: adminLogin,
      name: ''
    },
    {
      path: '/manage',
      component: adminLayout,
      name: '',
      children: [
        {
          path: '',
          component: adminHome,
          meta: []
        },
        {
          path: '/addShop',
          component: addShop,
          meta: ['添加数据', '添加商铺']
        },
        {
          path: '/addGoods',
          component: addGoods,
          meta: ['添加数据', '添加商品']
        },
        {
          path: '/userList',
          component: userList,
          meta: ['数据管理', '用户列表']
        },
        {
          path: '/shopList',
          component: shopList,
          meta: ['数据管理', '商家列表']
        },
        {
          path: '/foodList',
          component: foodList,
          meta: ['数据管理', '食品列表']
        },
        {
          path: '/orderList',
          component: orderList,
          meta: ['数据管理', '订单列表']
        },
        {
          path: '/adminList',
          component: adminList,
          meta: ['数据管理', '管理员列表']
        },
        {
          path: '/visitor',
          component: visitor,
          meta: ['图表', '用户分布']
        },
        {
          path: '/newMember',
          component: newMember,
          meta: ['图表', '用户数据']
        },
        {
          path: '/uploadImg',
          component: uploadImg,
          meta: ['文本编辑', 'MarkDown']
        },
        {
          path: '/vueEdit',
          component: vueEdit,
          meta: ['编辑', '文本编辑']
        },
        {
          path: '/adminSet',
          component: adminSet,
          meta: ['设置', '管理员设置']
        },
        {
          path: '/sendMessage',
          component: sendMessage,
          meta: ['设置', '发送通知']
        },
        {
          path: '/explain',
          component: explain,
          meta: ['说明', '说明']
        }
      ]
    }
  ]
})
