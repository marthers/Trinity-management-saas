<template>
    <div class = "nodata-index">
        <div class = "bg">
            <p class = "welcome">welcome</p>
            <p class = "welcome-chinese">欢迎来到自助设备运营管理平台</p>
        </div>
        <div class= "buttons-con">
            <div class = "con" @click.stop.prevent = "twoClicked('join')">
                <div class = "icon join"></div>
                <!-- <div class = "word">申请加入已有组织</div> -->
                <div class = "word-con">
                    <p class = "up">我是一有商户的一名员工 </p>
                    <p class = "down">选择我的商户</p>
                </div>
            </div>
            <div class = "con" @click.stop.prevent = "twoClicked('create')">
                <div class = "icon create"></div>
                <!-- <div class = "word">创建新组织</div> -->
                <div class = "word-con">
                    <p class = "up">我是一个新的商户 </p>
                    <p class = "down">创建商户</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'NoDataIndex',
    data() {
        return {

        }
    },
    methods : {
        twoClicked(type) {
            console.log(`type=${type}`)
            this.$emit('two-clicked',type)
            console.log(this.$route.meta)
        }
    }
}
</script>
<style lang= "less" scoped>
.nodata-index{
    width           : 100%;
    height          : 100%;
    background-color: #fff;
    .bg {
        width: 100%;
        height : 25%;
        background-size : contain;
        background-position : center;
        background-image: url('./../../assets/images/noData/surveyBg.png');
        @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
            background-image: url('./../../assets/images/noData/surveyBg@2x.png');
        }
        display : flex;
        justify-content : center;
        align-items : center;
        flex-direction : column;
        .welcome {
            width:251px;
            height:84px;
            font-size:60px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(255,255,255,1);
            line-height:84px;
            text-shadow:0px 3px 12px rgba(0,0,0,0.73);
        }
        .welcome-chinese {
            width:252px;
            height:25px;
            font-size:18px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height:25px;
            text-shadow:0px 3px 12px rgba(0,0,0,0.73);
            margin-top : 20px;
        }
    }
    .buttons-con {
        width : 100%;
        height : 75%;
        display : flex;
        justify-content : center;
        align-items : center;
        flex-direction : column;
        .con {
            width          : 384px;
            height         : 98px;
            background     : rgba(255,255,255,1);
            border-radius  : 12px;
            border         : 1px solid #DEDEDE;
            margin         : 20px;
            overflow       : hidden;
            display        : flex;
            justify-content: left;
            align-items    : center;
            flex-direction : row;
            cursor         : pointer;
            .icon {
                width              : 60px;
                height             : 60px;
                background-size    : contain;
                background-position: center;
                margin             : 0 30px;
            }
            .join {
                background-image: url('./../../assets/images/noData/joinOrg.png');
                @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                    background-image: url('./../../assets/images/noData/joinOrg@2x.png');
                }
            }
            .create {
                background-image: url('./../../assets/images/noData/createOrg.png');
                @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                    background-image: url('./../../assets/images/noData/createOrg@2x.png');
                }
            }
            /* .word {
                font-size : 16px;
                color     : #505050;
                text-align: left;
                max-width : 300px;
            } */
            .word-con {
                width:258px;
                height:56px;
                font-size:20px;
                font-family:PingFangSC-Medium;
                font-weight:500;
                color:rgba(80,80,80,1);
                line-height:28px;
                text-align : left;
                .down {
                    color : #48A8DA;
                    font-size: 16px;
                }
            }
        }
    }
}
</style>
