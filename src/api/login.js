import axios from '@/libs/api.request'
import baseConfig from './../config/index'
const baseUrl = baseConfig.baseUrl.dev
export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}
export const getOrgDetail = (url,headers) => {
  return axios.request({
    url : url,
    headers : headers,
    method : 'post'
  })
}