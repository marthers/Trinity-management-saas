<template>
    <div class = "user-detail">
        <header>
            <div class = "title">
                员工详情
            </div>
            <button class = "back" @click = "backToCheckList">返回上级</button>
        </header>
        <div class = ""></div>
    </div>
</template>
<script>
export default {
    name : 'UserDetail',
    data() {

    },
    methods : {
        backToCheckList() {
            this.$route.back();
        }
    }
}
</script>
<style lang="scss" scoped>
.user-detail{
    width : 100%;
    height : 100%;
    user-select: none;

}
</style>


