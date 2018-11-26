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
export const OrganizationNew = (url,data) => {
    return axios.request({
        url: url,
        data : data,
        method: 'post'
    })
}
export const undo_user_organization = url=> {
  return axios.request({
    url: url,
    method: 'post'
  })
}
export const joinOrg = (url,data)=> {
  return axios.request({
    url: url,
    data: data,
    method: 'post'
  })
}
