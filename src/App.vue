<template>
  <div id="app">
        <router-view/>
        <router-view class="view" name="CommonHeader"></router-view>
        <!-- <router-view name = "NoDataIndex" v-if = "$route.meta.NoDataIndex"/> -->
        <!-- <router-view :name = "$route.meta.contentName" v-if = "$route.meta.contentShow"/> -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family            : 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing : antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align             : center;
  color                  : #2c3e50;
  box-sizing             : border-box;
  width                  : 100vw;
  overflow-x             : hidden;
  height                 : 100vh;
  margin                 : 0;
  padding                : 0;
}
</style>
