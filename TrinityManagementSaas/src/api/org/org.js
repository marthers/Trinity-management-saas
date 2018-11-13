import axios from '@/libs/api.request';
export const getOrgList = (url,data) => {
    return axios.request({
      url: url,
      data : data,
      method: 'post'
    })
  }
export const orgEdit = (url,data) => {
    return axios.request({
      url: url,
      data : data,
      method: 'post'
    })
  }