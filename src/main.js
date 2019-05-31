import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
import ElementUI, { TabPane } from 'element-ui'
import '../src/style/reset.scss'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)

function loginNotification(type, message) {
  ElementUI.Message({
    type,
    message
  })
}

const allRouter = {}
const staffRouter = []
const managerRouter = []
for (const parent of router.options.routes) {
  if (!parent.children) {
    if (!(parent.path === '/404')) {
      allRouter[parent.path] = parent.meta
    }
  } else {
    for (const child of parent.children) {
      if (child.path === '') {
        allRouter['/manage'] = child.meta
      } else {
        allRouter[parent.path + child.path] = child.meta
      }
    }
  }
}
router.beforeEach((to, from, next) => {
  console.log('to.path', to.path)

  if (allRouter.hasOwnProperty(to.path)) {
    if (to.path === '/') {
      next()
    } else if (to.path === '/admin') {
      next()
    } else {
      if (
        store.getters.state.adminInfo.status === 1 ||
        store.getters.state.adminInfo.status === 2
      ) {
        next()
      } else {
        store.dispatch('getAdminData').then(() => {
          if (
            store.getters.state.adminInfo.status === 1 ||
            store.getters.state.adminInfo.status === 2
          ) {
            if (to.path === '/home') {
              next()
            } else {
              if (store.getters.state.adminInfo.status === 1) {
                loginNotification('error', '普通管理员的权限不够')

                next({ path: '/admin' })
              } else {
                next()
              }
            }
          } else {
            if (to.path === '/home') {
              next({ path: '/' })
              loginNotification('error', '你还未登录，请登录...')
            } else {
              next({ path: '/admin' })
              loginNotification('error', '你还未登录，请登录...')
            }
          }
        })
      }
    }
  } else if (to.path === '/404') {
    next()
  } else {
    next({ path: '/404' })
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
