<template>
    <div class = "my-org">
        <div class = "child"></div>
    </div>
</template>
<script>
  export default {
      name : 'MyOrg',
      data() {
          return {
              
          }
      }
  }
</script>
<style lang = "scss" scoped>
@function vh($height) {
    @return ($height/1080*100) + vh;
}
@function vw($width) {
    @return ($width/1920*100) + vw;
}
.my-org{
    width : vw(1440);
    height : vh(272);
    background:rgba(255,255,255,1);
    border : 1px solid #DEDEDE;
    border-radius : 8px;
    display : flex;
    justify-content : left;
    align-items: center;
    .child {
        width : vw(400);
        height : vh(400);
        background : pink;
    }
}
</style>