import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
import ElementUI from 'element-ui'
import '../src/style/reset.scss'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
  console.log('store', store)
  // console.log("store", store.getters.state);
  if (to.path === '/') {
    next()
  } else {
    store.dispatch('getAdminData').then(() => {
      console.log('store.getters', store.getters.state.adminInfo)
    })
    // if (
    //   store.getters.state.adminInfo.status === 2 ||
    //   store.getters.state.adminInfo.status === 1
    // ) {
    //   next()
    // } else {
    //   console.log(
    //     'ElementUI',
    //     ElementUI.Message({
    //       type: 'error',
    //       message: '你还未登入'
    //     })
    //   )
    //   next({ path: '/' })
    // }
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
