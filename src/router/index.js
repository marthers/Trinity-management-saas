import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview';
import routes from './routes.js'
import {getToken} from './../libs/util'
import { deflate } from 'zlib';
Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'
router.beforeEach((to,from,next) => {
  iView.LoadingBar.start();
  iView.LoadingBar.config({
      color      : 'pink',
      failedColor: '#f0ad4e',
      height     : 5
  });
  if(localStorage.getItem('Trinity-Token') != null) {
    //当前已登录
    console.log('当前已登录')
    if(to.name == LOGIN_PAGE_NAME) {
      console.log('当前已登录,即将跳转到Login页面')
      next({
        name: 'home'
      })
    }else {
      console.log(`当前已登录,即将跳转到${to.name}页面`)
      next();
    }
  }
  //当前未登录
  else{
    console.log('当前未登录')
    console.log(next)
    if(to.name == LOGIN_PAGE_NAME) {
      console.log("当前未登录,即将跳转到Login页面")
      next()
    }else {
      console.log(`当前未登录,即将跳转到${to.name}页面`)
      next({
        name: LOGIN_PAGE_NAME
      })
    }
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
export default router;
