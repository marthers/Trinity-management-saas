<template>
    <div class = "header">

        <div class = "header-left">
                <div class = "header-left-logo"></div>
                <div class = "header-left-slogan">自助设备运营管理平台</div>
                <!-- <Dropdown class = "header-left-dropdown">
                    <DropdownMenu slot="list">
                        <DropdownItem>驴打滚</DropdownItem>
                        <DropdownItem>炸酱面</DropdownItem>
                        <DropdownItem>豆汁儿</DropdownItem>
                        <Dropdown placement="right-start">
                            <DropdownItem>
                                北京烤鸭
                                <Icon type="ios-arrow-forward"></Icon>
                            </DropdownItem>
                            <DropdownMenu slot="list">
                                <DropdownItem>挂炉烤鸭</DropdownItem>
                                <DropdownItem>焖炉烤鸭</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <DropdownItem>冰糖葫芦</DropdownItem>
                    </DropdownMenu>
                </Dropdown> -->
                <div class = "header-left-dropdown">北京</div>
        </div>
        <div class = "header-right">
            <div class = "header-right-search-con">
                <input placeholder="Enter text" style="width: auto" class = "header-right-search" />
            </div>
            <!-- <Icon type="ios-search-outline" slot = "suffix"/> -->
            <div class= "header-right-line"></div>
            <div class= "header-right-group">
                <div class= "header-right-group-icon"></div>
                <div class= "header-right-group-number">
                    <!-- {{
                        groupNumber
                    }} -->
                </div>
            </div>
            <!-- <div class= "header-right-Personal" @click = "logOut"></div> -->
            <div class= "header-right-Personal"></div>
        </div>
    </div>
</template>
<script>
// import {signOut} from '@/api/user.js';
// import {orgEdit} from '@/api/org/org.js';
// import baseConfig from '@/config/index';
// const baseUrl = baseConfig.baseUrl.dev;
// const localOrgHost = baseConfig.baseUrl.localOrgHost
// import NoDataIndex from '@/view/noData/index';
// import CreatePerson from '@/view/noData/create/CreatePerson';
// import CreateMerchant from '@/view/noData/create/CreateMerchant';
// import CreateLegal from '@/view/noData/create/CreateLegal';
// import JoinInOrg from '@/components/JoinInOrg';
// import {getOrgDetail} from '@/api/login.js';
export default {
    name: 'CommonHeader'
}
<style lang="less" scoped>
.header{
width           : 100vw;
height          : 60px;
background-color: #26303A;
color           : #FFF;
text-align      : center;
display         : flex;
flex-direction  : row;
align-items     : center;
padding         : 0 30px;
justify-content : space-between;
position        : fixed;
top             : 0;
&-left {
    font-size     : 20px;
    display       : flex;
    flex-direction: row;
    align-items   : center;
    &-logo{
        width              : 55px;
        height             : 55px;
        background-image   : url('./../../assets/images/home/logo.png');
        background-size    : contain;
        background-position: center;
        @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
            background-image: url('./../../assets/images/home/logo@2x.png');
        }
    }
    &-slogan {
        font-size: 28px;
        color    : #FFF;
        margin   : 16px;
    }
    &-dropdown {
        width                     : 124px;
        height                    : 36px;
        border-top-left-radius    : 18px;
        border-top-right-radius   : 18px;
        border-bottom-left-radius : 18px;
        border-bottom-right-radius: 18px;
        background                : rgba(255,255,255,0.3);
        color                     : #FFF;
        font-size                 : 16px;
        text-align                : center;
        line-height               : 36px;
    }
}
&-right{
    color         : green;
    display       : flex;
    flex-direction: row;
    align-items   : center;
    &-search {
        width                     : 240px !important;
        height                    : 36px;
        border-top-left-radius    : 18px;
        border-top-right-radius   : 18px;
        border-bottom-left-radius : 18px;
        border-bottom-right-radius: 18px;
        background                : rgba(255,255,255,0.3);
        color                     : #FFF;
        font-size                 : 16px;
        text-align                : left;
        text-indent               : 1em;
        line-height               : 36px;
        border                    : none;
        //去掉边框颜色
        outline: none;
    }
    &-line {
        width           : 1px;
        height          : 36px;
        background-color: #D8D8D8;
        margin          : 0 20px;
    }
    &-group {
        display       : flex;
        flex-direction: row;
        cursor        : pointer;
        &-icon {
            width              : 18px;
            height             : 20px;
            background-image   : url('./../../assets/images/home/Group3.png');
            background-size    : contain;
            background-position: center;
            @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                background-image: url('./../../assets/images/home/Group3@2x.png');
            }
        }
        &-number {
            background   : #B32436;
            width        : 17px;
            height       : 17px;
            color        : #fff;
            font-size    : 12px;
            text-align   : center;
            line-height  : 17px;
            border-radius: 50%;
            position     : relative;
            left         : -10px;
            bottom       : 2px;
        }
    }
    &-Personal {
        width              : 22px;
        height             : 22px;
        cursor             : pointer;
        background-image   : url('./../../assets/images/home/Personal.png');
        background-size    : contain;
        background-position: center;
        @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
            background-image: url('./../../assets/images/home/Personal@2x.png');
        }
    }
}
}
</style>


