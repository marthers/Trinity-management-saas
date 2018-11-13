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
