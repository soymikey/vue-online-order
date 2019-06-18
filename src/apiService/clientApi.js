import axios from '../config/axios'
import { getStore } from '../config/mUtils'

/**
 * user
 */

export const register = data => axios.post('/user/register', data)
export const registerStaff = data => axios.post('/user/registerstaff', data)
export const login = data => axios.post('/user/login', data)
export const getUserInfo = async () => await axios.get('/user/info')

/**
 * restaurant
 */
export const addRestaurant = async data =>
  await axios.post('/restaurant/add', data)
export const updateRestaurant = async data =>
  await axios.post('/restaurant/update', data)
export const getRestaurantInfo = async data =>
  await axios.post('/restaurant/info', data)
export const getMenu = async data => await axios.post('/restaurant/menu', data)

/**
 * category
 */
export const getCategories = async data =>
  await axios.post('/category/get', data)
export const addCategory = async data => await axios.post('/category/add', data)
export const deleteCategory = async data =>
  await axios.post('/category/delete', data)

/**
 * food
 */
export const getFoods = async data => await axios.post('/food/get', data)
export const addFood = async data => await axios.post('/food/add', data)
export const deleteFood = async data => await axios.post('/food/delete', data)

/**
 * place a order
 */

export const placeOrder = async data =>
  await axios.post('/order/placeOrder', data)
export const getOrders = async data => await axios.post('/order/get', data)
