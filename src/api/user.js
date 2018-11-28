import axios from '@/libs/api.request'
export const login = ({ userName, password }) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url   : 'get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const signOut = (url) => {
  return axios.request({
    url   : url,
    method: 'post'
  })
}
export const UserInfoEdit = (url,data) => {
    return axios.request({
        url   : url,
        method: 'post',
        data
    })
}

//申请加入组织的用户个数接口
// export const ApplyJoinOrganization  = url => {
//   return axios.request({
//       url   : url,
//       method: 'post'
//   })
// }

//获取用户列表
export const getUserList  = (url,data) => {
  return axios.request({
      url   : url,
      data: data,
      method: 'post'
  })
}
//员工列表的批处理功能，包括审核、角色分配
export const UserBatchOperations  = (url,data) => {
    return axios.request({
        url   : url,
        data: data,
        method: 'post'
    })
  }
