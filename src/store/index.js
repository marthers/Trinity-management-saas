import Vue from 'vue'
import Vuex from 'vuex'

// import user from './module/user'
// import app from './module/app'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //home page left menu show or not
    menuShow : false
  },
  mutations: {
    //switchMenuShow
    setMenuShowTrue(state) {
      state.menuShow = true
    },
    setMenuShowFalse(state) {
      state.menuShow = false
    },
  },
  actions: {
    //
  },
  modules: {
    // user,
    // app
  }
})
