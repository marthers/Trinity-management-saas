/*
 * @Description : 业务相关
 * @Author      : ZhangYG
 * @Date        : 2018-10-23 09: 48: 46
 * @LastEditTime: 2018-10-23 10: 32: 01
 * @LastEditors : your name
 */


export const getToken = () => {
    const token = localStorage.getItem('Trinity-Token')
    if (token && token != null) {
      return token

    }else {
      return false
    }
  }