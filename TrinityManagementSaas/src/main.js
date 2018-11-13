// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import iView from 'iview';
import axios from '@/libs/api.request';
import 'babel-polyfill';
import 'es6-promise/auto';
const directives = {
  intOnly : {
    bind: function(el,binding,vnode) {
      el.handler = function() {
        el.value = el.value.replace(/\D+/, '')
      }
      el.addEventListener('input', el.handler)
    },
    unbind: function(el,binding,vnode) {
      el.removeEventListener('input', el.handler)
    }
  }
}
// const importDirective = Vue => {
  /**
   * 输入框只能输入数字的指令
   */
  Vue.directive('intOnly',directives.intOnly);
// };
/**
 * 注册指令
 */
// importDirective(Vue)
// import importDirective from '@/directives/index';
console.log(iView)
import VueScroller from 'vue-scroller'
Vue.use(VueScroller)
Vue.use(iView);
import VueParticles from 'vue-particles'
Vue.use(VueParticles)
import 'iview/dist/styles/iview.css'
// import {directives} from "./directive/directive";
// import './index.less'
Vue.config.productionTip = false
Vue.prototype.$axios     = axios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template  : '<App/>'
})
