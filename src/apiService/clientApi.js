import axios from '../config/axios'
import { getStore } from '../config/mUtils'

/**
 * 注册
 */

export const register = data => axios.post('/user/register', data)
export const login = data => axios.post('/user/register', data)
export const getUserInfo = data => axios.get('/user/info')
