// import { getUser, getAddressList } from '../service/getData'
// import { GET_USERINFO, SAVE_ADDRESS } from './mutation-types.js'

// export default {
//   async getUserInfo ({ commit, state }) {
//     let res = await getUser()
//     commit(GET_USERINFO, res)
//   },
//   async saveAddress ({ commit, state }) {
//     if (state.removeAddress.length > 0) return

//     let addres = await getAddressList(state.userInfo.user_id)
//     commit(SAVE_ADDRESS, addres)
//   }
// }
import { getAdminInfo } from '../service/getData'

import { SAVE_ADMIN_INFO } from './mutation-types.js'
export default {
  async getAdminData ({ commit }) {
    try {
      const res = await getAdminInfo()
      if (res.status === 1) {
        commit(SAVE_ADMIN_INFO, res.data)
      } else {
        throw new Error(res.type)
      }
    } catch (err) {
      // console.log(err.message)
    }
  }
}
