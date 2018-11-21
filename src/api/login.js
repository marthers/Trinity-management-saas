import axios from '@/libs/api.request'
import baseConfig from './../config/index'
const baseUrl = baseConfig.baseUrl.dev
export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}
export const getOrgDetail = (url,data) => {
  return axios.request({
    url : url,
    data : data,
    method : 'post'
  })
}
export const getUserDetail = (url,data) => {
  return axios.request({
    url : url,
    data : data,
    method : 'post'
  })
}
