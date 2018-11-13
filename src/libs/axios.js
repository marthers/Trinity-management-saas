import axios from 'axios'
import store from '@/store'
import iView from 'iview';
import router from '@/router';
import {uuid} from '@/libs/uuid';
import baseConfig from '@/config/index'
iView.Message.config({
    top     : 350,
    duration: 2
});
// import { Spin } from 'iview'
// const addErrorLog = errorInfo => {
//   const { statusText, status, request: { responseURL } } = errorInfo
//   let info = {
//     type: 'ajax',
//     code: status,
//     mes: statusText,
//     url: responseURL
//   }
//   if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
// }

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue   = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      // console.log('nterceptors.request__config:')
      // console.log(config)
      config.headers= {
        'Content-Type'    : 'application/json; charset=utf-8',
        'Trinity-Token'   : localStorage.getItem('Trinity-Token') != null ? localStorage.getItem('Trinity-Token'): uuid(8,16),
        'Request-Datatime': new Date().getTime()
      };
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      console.log("interceptor_res")
      console.log(res)
      const { data, status } = res
      const code             = data.code || '';
      if(code != 0) {
        if(code < 0) {
          console.log('code=-1');
          iView.Message.error({
              content : '未知错误,请及时联系管理员',
              duration: 5,
              closable: true
          });
        }
        //code > 0
        else {
          console.log(`code=${code}`)
          if(code == 101) {
            iView.Message.info({
                content : '需要手机图形验证码',
                duration: 5,
                closable: true
            });
          }
          else if(code == 1) {
            iView.Message.info({
                content : 'Token因为超时而失效',
                duration: 5,
                closable: true
            });
            console.log("this:")
            console.log(this)
            console.log("router:")
            console.log(router)
            if(router.history.current.name) {
                localStorage.setItem('beforeName',router.history.current.name)
            }
            if(localStorage.getItem('Trinity-Token') != null) {
                localStorage.removeItem('Trinity-Token')
            }
            router.push({
                name: 'login'
            })
          }
          else if(code == 102) {
            iView.Message.info({
                content : '需要设备图形验证码',
                duration: 5,
                closable: true
            });
          }
          else if(code == 104) {
            iView.Message.warning({
                content : '两次输入的密码不一致',
                duration: 5,
                closable: true
            });
          }
          else if(code == 105) {
            iView.Message.info({
                content : '更换新设备校验',
                duration: 5,
                closable: true
            });
          }
          else if(code == 400) {
            iView.Message.info({
                content : '输入参数错误，请及时联系管理员处理',
                duration: 5,
                closable: true
            });
          }
          else if(code == 401) {
            iView.Message.warning({
                // content : '认证信息错误，请及时联系管理员处理',
                // content : '账号不存在',
                content : data.msg  || '认证信息错误',
                duration: 5,
                closable: true
            });
          }
          else if(code == 404) {
            iView.Message.error({
                content : '忘记密码流程过期',
                duration: 5,
                closable: true
            });
          }
          else if(code == 413 || code == 414) {
            iView.Message.error({
                content : code == 413 ? '图形验证码错误': '短信验证码错误',
                duration: 5,
                closable: true
            });
          }
          else if(code == 415) {
            iView.Message.error({
                content : '该用户暂未注册',
                duration: 5,
                closable: true
            });
          }
          else if(code == 416) {
            iView.Message.error({
                content : '权限不足',
                duration: 5,
                closable: true
            });
          }
          else if(code == 500) {
            iView.Message.error({
                content : '服务器异常，请稍后重试',
                duration: 5,
                closable: true
            });
          }
          else if(code == 600) {
            iView.Message.error({
                content : '异常操作',
                duration: 5,
                closable: true
            });
          }
          else if(code == 700) {
            iView.Message.error({
                content : '数据不一致',
                duration: 5,
                closable: true
            });
          }
        }
      }
      console.log(data,status)
      return { data, status }
    }, error => {
      this.destroy(url)
      // addErrorLog(error.response)
      iView.Message.error({
          content : '网络异常',
          duration: 5,
          closable: true
      });
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
          options  = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
