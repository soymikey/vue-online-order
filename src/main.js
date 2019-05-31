import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
import ElementUI from 'element-ui'
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
for (const parent of router.options.routes) {
  if (!parent.children) {
    allRouter[parent.path] = parent.meta
    // allRouter.push({ route: parent.path, auth: parent.meta })
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

// let hasState = false
// router.beforeEach((to, from, next) => {
//   if (allRouter.hasOwnProperty(to.path)) {
//     if (
//       store.getters.state.adminInfo.status === 1 ||
//       store.getters.state.adminInfo.status === 2
//     ) {
//       hasState = true
//       if (to.path === '/admin') {
//         next({ path: '/manage' })
//       } else if (to.path === '/') {
//         next({ path: '/home' })
//       } else {
//         next()
//       }
//     } else {
//       if (!hasState) {
//         store.dispatch('getAdminData').then(() => {
//           if (
//             store.getters.state.adminInfo.status === 1 ||
//             store.getters.state.adminInfo.status === 2
//           ) {
//             hasState = true
//             if (to.path === '/admin') {
//               next({ path: '/manage' })
//               loginNotification('success', '检测到您之前登录过，将自动登录')
//             } else if (to.path === '/') {
//               next({ path: '/home' })
//               loginNotification('success', '检测到您之前登录过，将自动登录')
//             } else {
//               next()
//             }
//           } else {
//             hasState = false
//           }
//         })
//       } else {

//         if (to.path === '/home') {
//           next({ path: '/' })
//         } else if (to.path === '/') {
//           next()
//         } else if (to.path === '/admin') {
//           next()
//         } else {
//           next({ path: '/admin' })
//         }
//       }
//     }

//     //----------------
//   } else {
//     next({ path: '/404' })
//   }
// })
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// router.beforeEach((to, from, next) => {
//   console.log('store', store)
//   // console.log("store", store.getters.state);

//   if (!store.getters.state.adminInfo.status) {
//     store.dispatch('getAdminData').then(() => {
//       if (!store.getters.state.adminInfo.status) {
//         if (to.path === '/') {
//           next()
//         } else if (to.path === '/home') {
//           next({ path: '/' })
//         } else if (to.path === '/admin') {
//           next()
//         } else {
//           next({ path: 'admin' })
//         }
//       } else {
//         if (to.path === '/') {
//           next({ path: 'home' })
//           loginNotification('success', '检测到您之前登录过，将自动登录')
//         } else if (to.path === '/home') {
//           if (from.path === '/') {
//             next()
//           } else {
//             next()
//             loginNotification('success', '检测到您之前登录过，将自动登录')
//           }
//         } else if (to.path === '/admin') {
//           next({ path: 'manage' })
//           loginNotification('success', '检测到您之前登录过，将自动登录')
//         } else {
//           next()
//           if (from.path === '/') {
//             loginNotification('success', '检测到您之前登录过，将自动登录')
//           }
//         }
//       }
//     })
//   } else {
//     if (to.path === '/') {
//       next({ path: 'home' })
//       loginNotification('success', '检测到您之前登录过，将自动登录')
//     } else if (to.path === '/home') {
//       if (from.path === '/') {
//         next()
//       } else {
//         next()
//         loginNotification('success', '检测到您之前登录过，将自动登录')
//       }
//     } else if (to.path === '/admin') {
//       next({ path: 'manage' })
//       loginNotification('success', '检测到您之前登录过，将自动登录')
//     } else {
//       next()
//       if (from.path === '/') {
//         loginNotification('success', '检测到您之前登录过，将自动登录')
//       }
//     }
//   }
// })
