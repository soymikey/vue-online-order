import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
import ElementUI from 'element-ui'
import { getStore } from './config/mUtils'
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

const staffRouter = []
const managerRouter = []
for (const router of router.options.routes) {
  if (!router.children) {
    if (!router.authorisation.length) {
      staffRouter.push(router.path)
      managerRouter.push(router.path)
    } else if (router.authorisation.indexOf('staff') !== -1) {
      staffRouter.push(router.path)
      managerRouter.push(router.path)
    } else {
      managerRouter.push(router.path)
    }
  } else {
    for (const childRouter of router.children) {
      if (!childRouter.authorisation.length) {
        staffRouter.push(childRouter.path)
        managerRouter.push(childRouter.path)
      } else if (childRouter.authorisation.indexOf('staff') !== -1) {
        staffRouter.push(childRouter.path)
        managerRouter.push(childRouter.path)
      } else {
        managerRouter.push(router.path + childRouter.path)
      }
    }
  }
}
router.beforeEach((to, from, next) => {
  if (managerRouter.indexOf(to.path) !== -1) {
    if (to.path === '/') {
      next()
    } else if (to.path === '/404') {
      next()
    } else {
      if (!getStore('token')) {
        next({ path: '/' })
      } else if (store.getters.state.userInfo.auth === 0) {
        store.dispatch('getUserData').then(() => {
          console.log(
            'store.getters.state.userInfo.auth',
            store.getters.state.userInfo
          )

          if (store.getters.state.userInfo.auth === 0) {
            next({ path: '/' })
          } else if (store.getters.state.userInfo.auth === 1) {
            if (staffRouter.indexOf(to.path) !== -1) {
              next()
            } else {
              loginNotification('error', '请登陆管理员账号')
            }
          } else if (store.getters.state.userInfo.auth === 2) {
            next()
          } else {
            loginNotification('error', '路由逻辑出错')
          }
        })
      } else if (store.getters.state.userInfo.auth === 1) {
        if (staffRouter.indexOf(to.path) !== -1) {
          next()
        } else {
          loginNotification('error', '请登陆管理员账号')
        }
      } else if (store.getters.state.userInfo.auth === 2) {
        next()
      } else {
        loginNotification('error', '路由逻辑出错')
      }
    }
  } else {
    next({ path: '/404' })
  }
})

// router.beforeEach((to, from, next) => {
//   //没有state的情况下
//   if (managerRouter.indexOf(to.path) !== -1) {
//     if (to.path === '/') {
//       next()
//     } else if (to.path === '/admin') {
//       next()
//     } else if (to.path === '/404') {
//       next()
//     } else {
//       //如果没有auth
//       if (!store.getters.state.userInfo.auth) {
//         store.dispatch('getUserData').then(() => {
//           if (store.getters.state.userInfo.auth === 2) {
//             next()
//           } else if (store.getters.state.userInfo.auth === 1) {
//             if (staffRouter.indexOf(to.path) !== -1) {
//               next()
//             } else {
//               loginNotification('error', '普通管理员的权限不够')
//               next({ path: '/admin' })
//             }
//           } else {
//             loginNotification('error', '请登录...')
//             next({ path: '/' })
//           }
//         })
//       } else {
//         if (store.getters.state.userInfo.auth === 2) {
//           next()
//         } else if (store.getters.state.userInfo.auth === 1) {
//           if (staffRouter.indexOf(to.path) !== -1) {
//             next()
//           } else {
//             loginNotification('error', '普通管理员的权限不够')
//             next({ path: '/admin' })
//           }
//         }
//       }
//     }
//   } else {
//     next({ path: '/404' })
//   }
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
