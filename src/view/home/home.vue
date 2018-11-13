<template>
  <div class = "home">
        <!-- 头部 -->
        <div class = "header">
            <div class = "header-left">
                    <div class = "header-left-logo"></div>
                    <div class = "header-left-slogan">自助设备运营管理平台</div>
                    <div class = "header-left-dropdown">北京</div>
            </div>
            <div class = "header-right">
                <div class = "header-right-search-con">
                    <input placeholder="Enter text" style="width: auto" class = "header-right-search" />
                </div>
                <div class= "header-right-line"></div>
                <div class= "header-right-group">
                    <div class= "header-right-group-icon"></div>
                    <div class= "header-right-group-number">
                        {{
                            groupNumber
                        }}
                    </div>
                </div>
                <div class= "header-right-Personal" @click = "logOut"></div>
            </div>
        </div>
        <div class = "body">
                <div class = "left-side-con" id = "left-side-main">
                    <div class= "left-side-box">
                        <div :class = "[leftSideSelected == 'back-to-main'? 'left-side-selected' :'','item-con']" @click = "leftSideSelected = 'back-to-main'">
                            <div class = "back-to-main inside-item"></div>
                        </div>
                        <div :class = "[leftSideSelected == 'statistics'? 'left-side-selected' :'','item-con']" @click = "leftSideSelected = 'statistics'">
                            <div class = "statistics inside-item"></div>
                        </div>
                        <div :class = "[leftSideSelected == 'menu'? 'left-side-selected' :'','item-con']" @click = "leftSideSelected = 'menu'">
                            <div class = "menu inside-item"></div>
                        </div>
                        <div :class = "[leftSideSelected == 'briefcase'? 'left-side-selected' :'','item-con']" @click = "leftSideSelected = 'briefcase'">
                            <div class = "briefcase inside-item"></div>
                        </div>
                        <div :class = "[leftSideSelected == 'settings'? 'left-side-selected' :'','item-con']" @click = "leftSideSelected = 'settings'">
                            <div class = "settings inside-item"></div>
                        </div>
                    </div>
                </div>
                <div class = "left-menu-con" v-if = "leftSideSelected == 'menu'">
                    <div class = "menu-head">管理平台</div>
                    <button class = "back">返回</button>
                    <div class = "survey-menu-con menu-con" v-for = "(item,index) in menuList" :key = "index">
                        <div class= "title-con">
                            <!-- <button class = "title" @click = "titleClicked"> -->
                            <button class = "title" @click.stop.prevent = "titleClicked(index)">
                                <!-- <div :class = "[titleTrueClicked ? 'triangle-down' :'triangle-up']"></div> -->
                                <div :class = "[item.clicked%2 > 0 ? 'triangle-down' :'triangle-up']"></div>
                                <a class = "title-name">
                                    {{
                                        item.menuTitle
                                    }}
                                </a>
                            </button>
                        </div>
                        <!-- <a class = "menu-child" v-for = "(i,key) in surveyArr" :key = "key" v-show = "titleTrueClicked"> -->
                        <!-- <a class = "menu-child" v-for = "(i,key) in surveyArr" :key = "key" v-if = "item.clicked"> -->
                        <a class = "menu-child" v-for = "(i,key) in item.childArr" :key = "key" v-if = "item.clicked%2 > 0">
                            {{
                                i.name
                            }}
                        </a>
                    </div>
                </div>
                <div class = "content">
                    <!-- <h2>User {{ $route.params.id }}</h2> -->
                    <!-- <router-view></router-view> -->
                    <!-- <router-view class="view" :name="contentRouterView"></router-view> -->
                    <no-data-index @two-clicked = "twoClicked" v-if = "NoDataIndexShow && fidOrg == 0"></no-data-index>
                    <!-- <no-data-index @two-clicked = "twoClicked" v-if = "$route.meta.showName == 'NoDataIndex'"></no-data-index> -->

                    <create-person  v-if = "createPersonalInfoShow && fidOrg == 0" @person-back = "personBack" @person-forward = "personForword" @createPersonSuccess = "createPersonSuccess" :createShow = "createShow"></create-person>
                    <!-- <create-person v-if = "$route.meta.showName != 'NoDataIndex'" @person-back = "personBack" @person-forward = "personForword" @createPersonSuccess = "createPersonSuccess"></create-person> -->

                    <create-merchant  v-if = "createMerchantInfoShow && fidOrg == 0" @back-to-person = "merchantBack" @to-legal = "toLegal" @merchant-select-upper = "merchantSelectUpper" @selectedSuperior = "selectedSuperiorMethod"></create-merchant>

                    <create-legal  v-if = "createLegalShow && fidOrg == 0" @back-to-merchant = "legalBack" @submit-create = "submitCreate"></create-legal>

                    <!-- <join-in-org :JoinInOrgShow = "JoinInOrgShow" @chooseOrgBack = "chooseOrgBack"></join-in-org> -->
                </div>
        </div>
        <Modal
                    v-model      = "JoinInOrgShow"
                  :closable      = "closable"
                  :mask-closable = "maskClosable"
                    width        = '1000'
                    @on-ok       = "JoinInOrgShow = false"
            footer-hide
            class-name = "create-modal">
            <join-in-org :JoinInOrgShow = "JoinInOrgShow" @chooseOrgBack = "chooseOrgBack"></join-in-org>
        </Modal>
  </div>
</template>
<script>
import {signOut} from '@/api/user.js';
import {orgEdit} from '@/api/org/org.js';
import baseConfig from '@/config/index';
const baseUrl      = baseConfig.baseUrl.dev;
const localOrgHost = baseConfig.baseUrl.localOrgHost
import NoDataIndex from '@/view/noData/index';
import CreatePerson from '@/view/noData/create/CreatePerson';
import CreateMerchant from '@/view/noData/create/CreateMerchant';
import CreateLegal from '@/view/noData/create/CreateLegal';
import JoinInOrg from '@/components/JoinInOrg';
import {getOrgDetail} from '@/api/login.js';
export default {
    data() {
        return {
            createShow           : true,
            leftSideSelected     : 'menu',
            groupNumber          : 20,
            titleTrueClicked     : false,
            orderTitleTrueClicked: false,
            count                : 0,        //概况
            orderCount           : 0,        //订单管理
            settleCount          : 0,        //结算管理
            goodsCount           : 0,        //商品管理
            memberCount          : 0,        //会员管理
            pointCount           : 0,        //点位管理
            deviceCount          : 0,        //设备管理
            activityCount        : 0,        //活动管理
            dataCount            : 0,        //数据分析
            systemCount          : 0,        //系统管理
            surveyArr            : [
                {
                    name: '概况1'
                },
                {
                    name: '概况2'
                },
                {
                    name: '概况3'
                },
                {
                    name: '概况4'
                },
                {
                    name: '概况5'
                }
            ],
            fidOrg           : -2,
            contentRouterView: 'MyOrg',
            selectedSuperior : {},
            menuList         : [
                {
                    menuTitle: '概况',
                    childArr : [
                        {
                            name: '概况1'
                        },
                        {
                            name: '概况2'
                        },
                        {
                            name: '概况3'
                        },
                        {
                            name: '概况4'
                        },
                        {
                            name: '概况5'
                        }
                    ],
                    clicked: 1,
                },
                {
                    menuTitle: '订单管理',
                    childArr : [
                        {
                            name: '订单管理1'
                        },
                        {
                            name: '订单管理2'
                        },
                        {
                            name: '订单管理3'
                        },
                        {
                            name: '订单管理4'
                        },
                        {
                            name: '订单管理5'
                        }
                    ],
                    clicked: 0
                },
                {
                    menuTitle: '结算管理',
                    childArr : [
                        {
                            name: '结算管理子菜单1'
                        },
                        {
                            name: '结算管理子菜单1'
                        },
                        {
                            name: '结算管理子菜单1'
                        },
                        {
                            name: '结算管理子菜单1'
                        },
                        {
                            name: '结算管理子菜单1'
                        }
                    ],
                    clicked: 0
                },
                {
                    menuTitle: '会员管理',
                    childArr : [
                        {
                            name: '会员管理子菜单1'
                        },
                        {
                            name: '会员管理子菜单2'
                        },
                        {
                            name: '会员管理子菜单3'
                        },
                        {
                            name: '会员管理子菜单4'
                        },
                        {
                            name: '会员管理子菜单5'
                        }
                    ],
                    clicked: 0
                },
                {
                    menuTitle: '商品管理',
                    childArr : [
                        {
                            name: '商品管理子菜单1'
                        },
                        {
                            name: '商品管理子菜单2'
                        },
                        {
                            name: '商品管理子菜单3'
                        },
                        {
                            name: '商品管理子菜单4'
                        },
                        {
                            name: '商品管理子菜单5'
                        }
                    ],
                    clicked: 0
                },
                {
                    menuTitle: '点位管理',
                    childArr : [
                        {
                            name: '子菜单1'
                        },
                        {
                            name: '子菜单2'
                        },
                        {
                            name: '子菜单3'
                        }
                    ],
                    clicked: 0
                },
                {
                    menuTitle: '设备管理',
                    childArr : [
                        {
                            name: '子菜单1'
                        },
                        {
                            name: '子菜单2'
                        },
                        {
                            name: '子菜单3'
                        }
                    ],
                    clicked: 0
                },
                {
                    menuTitle: '活动管理',
                    childArr : [
                        {
                            name: '子菜单1'
                        },
                        {
                            name: '子菜单2'
                        },
                        {
                            name: '子菜单3'
                        }
                    ],
                    clicked: 0
                },
                {
                    menuTitle: '数据分析',
                    childArr : [
                        {
                            name: '子菜单1'
                        },
                        {
                            name: '子菜单2'
                        },
                        {
                            name: '子菜单3'
                        }
                    ],
                    clicked: 0
                },
                {
                    menuTitle: '系统管理',
                    childArr : [
                        {
                            name: '子菜单1'
                        },
                        {
                            name: '子菜单2'
                        },
                        {
                            name: '子菜单3'
                        }
                    ],
                    clicked: 0
                }
            ],
            NoDataIndexShow       : false,   //没有任何个人数据
            createPersonalInfoShow: false,   //创建个人信息
            createMerchantInfoShow: false,
            createLegalShow       : false,
            JoinInOrgShow         : false,
            maskClosable          : false,
            closable              : false,
            merchantData          : {}
        }
    },
    components : {
        NoDataIndex,
        CreatePerson,
        CreateMerchant,
        CreateLegal,
        JoinInOrg
    },
    methods : {
        handleScroll () {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            console.log(scrollTop)
        },
        logOut() {
            signOut(baseUrl + 'user/sign_out_web').then(res => {
                console.log("res:::::::")
                console.log(res)
                console.log(res.data)
                if(res.status == 200 && res.data.code == 0) {
                    this.$Message.info({
                        content : '退出成功',
                        duration: 5,
                        closable: true
                    })
                    if(localStorage.getItem('Trinity-Token') != null) {
                        localStorage.removeItem('Trinity-Token');
                    }
                    this.$router.push({
                        name: 'login'
                    })
                }else{
                    this.$Message.error({
                        content : '退出失败',
                        duration: 5,
                        closable: true
                    })
                }
            }).catch(err => {
                console.log(err);
                this.$Message.error({
                    content : '网络异常，请联系管理员及时处理',
                    duration: 5,
                    closable: true
                })
            })
        },
        titleClicked(index) {
            //    let target = ev.target.innerText || ev.srcElement.innerText;
            console.log(`this.menuList[index].clicked=${this.menuList[index].clicked}`)
            // let val = ++this.menuList[index].clicked;
            let item = this.menuList[index];
            console.log(`item=${item}`)
            ++item.clicked
            this.menuList.splice(index,1,item)
            console.log(`index=${index}`);
            console.log(`item=${item}`)
            //    this.menuList.forEach((item,index) => {
            //        if(item.menuTitle == target) {
            //         //    debugger
            //         //    ++item.clicked
            //            this.splice(this.menuList[index].clicked,1,++this.menuList[index].clicked)
            //             // switch (target) {
            //             //     case '概况':
            //             //             ++this.count;
            //             //             if(this.count%2 >0) {
            //             //                 this.menuList[index].clicked = true
            //             //             }else {
            //             //                 this.menuList[index].clicked = false
            //             //             };
            //             //     case '订单管理':
            //             //             ++this.orderCount;
            //             //             if(this.orderCount%2 >0) {
            //             //                 this.menuList[index].clicked = true
            //             //             }else {
            //             //                 this.menuList[index].clicked = false
            //             //             };
            //             //     case '结算管理':
            //             //             ++this.settleCount;
            //             //             if(this.settleCount%2 >0) {
            //             //                 this.menuList[index].clicked = true
            //             //             }else {
            //             //                 this.menuList[index].clicked = false
            //             //             };
            //             //     case '会员管理':
            //             //             ++this.memberCount;
            //             //             if(this.memberCount%2 >0) {
            //             //                 this.menuList[index].clicked = true
            //             //             }else {
            //             //                 this.menuList[index].clicked = false
            //             //             };
            //             //     case '商品管理':
            //             //             ++this.goodsCount;
            //             //             if(this.goodsCount%2 >0) {
            //             //                 this.menuList[index].clicked = true
            //             //             }else {
            //             //                 this.menuList[index].clicked = false
            //             //             };
            //             //             console.log('商品管理this.menuList:');
            //             //             console.log(this.menuList);
            //             //     case '点位管理':
            //             //             ++this.pointCount;
            //             //             if(this.pointCount%2 >0) {
            //             //                 this.menuList[index].clicked = true
            //             //             }else {
            //             //                 this.menuList[index].clicked = false
            //             //             };
            //             //             console.log('点位管理this.menuList:');
            //             //             console.log(this.menuList);
            //             //     case '设备管理':
            //             //             ++this.deviceCount;
            //             //             if(this.deviceCount%2 >0) {
            //             //                 this.menuList[index].clicked = true
            //             //             }else {
            //             //                 this.menuList[index].clicked = false
            //             //             };
            //             //     case '活动管理':
            //             //             ++this.activityCount;
            //             //             if(this.activityCount%2 >0) {
            //             //                 this.menuList[index].clicked = true
            //             //             }else {
            //             //                 this.menuList[index].clicked = false
            //             //             };
            //             //             console.log('活动管理this.menuList:');
            //             //             console.log(this.menuList);
            //             //     case '数据分析':
            //             //             ++this.dataCount;
            //             //             if(this.dataCount%2 >0) {
            //             //                 this.menuList[index].clicked = true
            //             //             }else {
            //             //                 this.menuList[index].clicked = false
            //             //             };
            //             //         default :  //系统设置
            //             //             ++this.systemCount;
            //             //             if(this.systemCount%2 >0) {
            //             //                 this.menuList[index].clicked = true
            //             //             }else {
            //             //                 this.menuList[index].clicked = false
            //             //             };
            //             // }
            //        }
            //     //    else {
            //     //        item.click = item.clicked;
            //     //    }
            //    })
            //    this.menuList = Object.assign([],this.menuList)
        },
        orderTitleClicked() {
            ++this.orderCount;
            if(this.orderCount%2 >0) {
                this.orderTitleTrueClicked = true
            }else {
                this.orderTitleTrueClicked = false;
            }
        },
        twoClicked(type) {
            console.log(type)
            if(type === 'create') {
                this.NoDataIndexShow        = false;
                this.createPersonalInfoShow = true;
                this.createShow             = true
                // localStorage.setItem('create',true)
                // this.$route.meta.showName = 'CreatePerson'
            }else {
                this.createShow = false
                // localStorage.setItem('create',false)
                // this.JoinInOrgShow = true;
                // this.NoDataIndexShow = false;
                // this.createPersonalInfoShow = false;
                // this.createMerchantInfoShow = false;
                // this.createLegalShow        = false;
                this.NoDataIndexShow        = false;
                this.createPersonalInfoShow = true;
            }
        },
        chooseOrgBack() {
            this.JoinInOrgShow          = false;
            this.NoDataIndexShow        = true;
            this.createPersonalInfoShow = false;
        },
        personBack() {
            this.NoDataIndexShow = true;
                // this.$route.meta.showName = 'NoDataIndex'
            this.createPersonalInfoShow = false;
        },
        createPersonSuccess (user_info) {
            console.log("user_info:");
            console.log(user_info);
            this.NoDataIndexShow        = false;
            this.createPersonalInfoShow = false;
            this.createMerchantInfoShow = true
        },
        personForword() {
            this.NoDataIndexShow        = false;
            this.createPersonalInfoShow = false;
            this.createMerchantInfoShow = true
        },
        merchantBack() {
            this.NoDataIndexShow        = false;
            this.createPersonalInfoShow = true;
            this.createMerchantInfoShow = false
        },
        legalBack() {
            this.NoDataIndexShow        = false;
            this.createPersonalInfoShow = false;
            this.createMerchantInfoShow = true;
            this.createLegalShow        = false;
        },
        submitCreate (legalData) {
                            this.NoDataIndexShow        = true;
                            this.createPersonalInfoShow = false;
                            this.createMerchantInfoShow = false;
                            this.createLegalShow        = false;
                        let reqData                     = {
                'is_select_me'           : legalData.is_select_me,
                'logo'                   : this.merchantData.logoBase64Data,
                'organization_name'      : this.merchantData.corpName,
                'organization_num'       : this.merchantData.IDNumber,
                'organization_license_up': this.merchantData.corpBase64Data,
                'organization_desc'      : this.merchantData.des ? this.merchantData.des: '',
                // 'parent_id_organization' : this.merchantData.id_organization ? this.merchantData.id_organization : 1
                'parent_id_organization': this.selectedSuperior.id_organization ? this.selectedSuperior.id_organization: 1
            }
            console.log('this.selectedSuperior:')
            console.log(this.selectedSuperior)
            console.log('this.merchantData:')
            console.log(this.merchantData)
            console.log('legalData:')
            console.log(legalData)
            if(legalData.is_select_me == 0) {
                console.log(`this.selectedSuperior.id_organization=${this.selectedSuperior.id_organization}`);
                reqData.corporate_name    = legalData.corporate_name;
                reqData.corporate_ident   = legalData.corporate_ident;
                reqData.corporate_card_up = legalData.corporate_card_up;
                reqData.corporate_card_up = legalData.corporate_card_down;
            }
            // debugger
            console.log('reqData:')
            console.log(reqData)
            // debugger
            orgEdit(localOrgHost + '/trinity-backstage/organization/edit_info',
                {
                    'priority': 5,
                    'group'   : 0,
                    'data'    : {
                        'edit_mode'        : 0,
                        'organization_info': reqData
                    }
                }
            )
            .then(res => {
                console.log(res)
                if(res.status&& res.status == 200) {
                    console.log(res.data)
                    localStorage.setItem('Trinity-Token',res.data.data.token)
                    getOrgDetail(baseConfig.baseUrl.localOrgHost + '/trinity-backstage/organization/detail',
                    {
                        'Content-Type'    : 'application/json; charset=utf-8',
                        'Trinity-Token'   : res.data.data.token,
                        'Request-Datatime': new Date().getTime()
                    })
                    .then (res => {
                        console.log(res);
                        if(res.status && res.status == 200) {
                        // debugger
                        if(res.data.success && res.data.code == 0) {
                            if(res.data.data) {
                            // debugger;
                            let data = res.data.data;
                            // for(let item in data) {
                            localStorage.setItem('org_detail_obj' , JSON.stringify(data))
                            // }
                            // debugger
                            }
                        }else {
                            this.$Message.error({
                                content : err.msg ? err.msg: '网络错误',
                                duration: 5,
                                closable: true
                            });
                        }
                        }
                        else {
                        this.$Message.error({
                            content : err.msg ? err.msg: '网络错误',
                            duration: 5,
                            closable: true
                        });
                        }
                    })
                    .catch(err => {
                    console.log(err)
                    this.$Message.error({
                        content : err.msg ? err.msg: '网络错误',
                        duration: 5,
                        closable: true
                    });
                    })
                }else {
                    this.$Message.error({
                        content : res.msg ? res.msg: '网络异常，请联系管理员及时处理',
                        duration: 5,
                        closable: true
                    })
                }
            })
            .catch(err => {
                console.log(err);
                this.$Message.error({
                    content : '网络异常，请联系管理员及时处理',
                    duration: 5,
                    closable: true
                })
            })
            console.log("reqData:")
            console.log(reqData)
        },
        toLegal(data) {
            this.NoDataIndexShow        = false;
            this.createPersonalInfoShow = false;
            this.createMerchantInfoShow = false;
            this.createLegalShow        = true;
            this.merchantData           = data;
            console.log("this.merchantData:")
            console.log(this.merchantData)
        },
        merchantSelectUpper () {
            this.JoinInOrgShow          = true;
            this.NoDataIndexShow        = false;
            this.createPersonalInfoShow = false;
            this.createMerchantInfoShow = false;
            this.createLegalShow        = false;
        },
        selectedSuperiorMethod(data) {
            console.log(data);
            this.selectedSuperior = data
        }
    },
    created () {
        console.log(this.$route.matched);
        if(localStorage.getItem('fid_organization') == 0) {
            this.NoDataIndexShow = true
        }else {
            this.NoDataIndexShow = false
        }
        // this.$route.meta.showName = 'NoDataIndex'
        // this.$delete(this.$route.matched[0].components,'NoDataIndex')
        'use strict';
        var person = {
            name : 'sss',
            age  : 18,
            child: {
                name: 'childP',
                age : 2
            }
        };
        console.log(Object.getOwnPropertyDescriptor(person,'child'));
        console.log(Object.getOwnPropertyDescriptor(person,'name'))
        console.log(Object.getOwnPropertyDescriptor(person,'dwjkhhjdwhdwa'));
        console.log(Object.getOwnPropertyDescriptor(person,'age'));
        // localStorage.clear();
        this.fidOrg = localStorage.getItem('fid_organization')
    },
    mounted() {
        // debugger
        // try{
        //     if(this.$route.matched[0].components.MyOrg) {
        //         debugger
        //         // this.$route.matched[0].components.MyOrg = ''
        //     }
        // }catch(err) {
        //     console.log(err)
        // }
        // console.log(this.$router);
        console.log(this.$route);
        // console.log(this)
    }
}
</script>
<style>
.create-modal .ivu-modal{
    display        : flex;
    justify-content: center;
    align-items    : center;
}
.create-modal .ivu-modal .ivu-modal-content{
    width   : 80vw !important;
    height  : 90vh !important;
    overflow: hidden !important;
}
.create-modal .ivu-modal .ivu-modal-content .ivu-modal-body{
    width : 90% !important;
    height: 90% !important;
}
.create-modal .ivu-input-search{
    background-color: #48A8DA !important;
    border-color    : #48A8DA !important;
}
.search .ivu-input{
    border-color: #48A8DA !important;
}
</style>
<style lang="less" scoped>
.home {
    .fade-enter-active, .fade-leave-active {
        transition: opacity 5.5s
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
    }
    button {
        border-width: 0;
        outline     : none;
        background  : #DEDEDE;
        cursor      : pointer;
    }
    width: 100vw;
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
  .body {
      width         : 100vw;
      height        : 100%;
      min-height    : 100vh;
      display       : flex;
      flex-direction: row;
      position      : fixed;
      overflow      : auto;
      top           : 60px;
        .left-side-con {
            width           : 50px;
            height          : 100%;
            background-color: #08131E;
            text-align      : center;
            display         : flex;
            flex-direction  : column;
            justify-content : center;
            // align-items     : center;
            .left-side-box {
                // width: 100%;
                // height:auto;
                position: fixed;
                top     : 45vh;
                .item-con {
                    width           : 40px;
                    height          : 40px;
                    border-radius   : 20px;
                    margin          : 2vh 0;
                    background-color: #08131E;
                    display         : flex;
                    justify-content : center;
                    align-items     : center;
                    transform       : translateY(-500%);
                    .inside-item {
                        width              : 24px;
                        height             : 24px;
                        cursor             : pointer;
                        background-size    : contain;
                        background-position: center;
                    }
                }
            }
            //被选中
            .left-side-selected {
                background: linear-gradient(180deg,rgba(59,165,178,1) 0%,rgba(72,168,218,1) 100%);
            }
            .back-to-main {
                background-image: url('./../../assets/images/home/Home.png');
                @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                    background-image: url('./../../assets/images/home/Home@2x.png');
                }
            }
            .statistics {
                background-image: url('./../../assets/images/home/Shares.png');
                @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                    background-image: url('./../../assets/images/home/Shares@2x.png');
                }
            }
            .menu{
                background-image: url('./../../assets/images/home/Notes.png');
                @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                    background-image: url('./../../assets/images/home/Notes@2x.png');
                }
            }
            .briefcase {
                background-image: url('./../../assets/images/home/Job.png');
                @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                    background-image: url('./../../assets/images/home/Job@2x.png');
                }
            }
            .settings {
                background-image: url('./../../assets/images/home/Settings.png');
                @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                    background-image: url('./../../assets/images/home/Settings@2x.png');
                }
            }
        }
        .content {
            width : 100%;
            height: 100%;
        }

        .left-menu-con {
            width           : 160px;
            min-height      : 100vh;
            height          : 100%;
            background-color: #DEDEDE;
            text-align      : center;
            .menu-head {
                width        : 160px !important;
                height       : 60px;
                line-height  : 60px;
                text-align   : center;
                font-size    : 12px;width: 48px;
                font-size    : 12px;
                font-family  : PingFangSC-Medium;
                font-weight  : 500;
                color        : rgba(21,24,54,1);
                border-bottom: 1px solid rgba(66,160,186,0.49);
            }
            .back {
                width       : 160px;
                height      : 40px;
                line-height : 40px;
                text-align  : center;
                color       : #000;
                border-width: 0;
                outline     : none;
                background  : #DEDEDE;
                cursor      : pointer;
            }
            // container
            .menu-con {
                width           : 160px !important;
                overflow        : hidden;
                text-align      : left;
                font-size       : 12px;
                color           : #000;
                background-color: #DEDEDE;
            }
            .title-con {
                width      : 160px;
                height     : 40px;
                line-height: 40px;
                .title {
                    width          : 100%;
                    height         : 40px;
                    background     : #DEDEDE;
                    line-height    : 40px;
                    text-align     : center;
                    display        : flex;
                    flex-direction : row;
                    justify-content: left;
                    align-items    : center;
                    .title-name{
                        color: #000;
                    }
                    .triangle-up {
                            width       : 0px;
                            height      : 0px;
                            *width      : 7px;
                            *height     : 10px;
                            font-size   : 0;
                            line-height : 0;
                            overflow    : hidden;
                            border-width: 5px;
                            border-style: dashed dashed solid dashed;
                            border-color: transparent  transparent transparent #9B9B9B;
                            margin      : 3px 10px;
                    }
                    .triangle-down {
                            width       : 0px;
                            height      : 0px;
                            *width      : 7px;
                            *height     : 10px;
                            font-size   : 0;
                            line-height : 0;
                            overflow    : hidden;
                            border-width: 5px;
                            border-style: dashed dashed solid dashed;
                            border-color: #9B9B9B transparent  transparent transparent;
                            margin      : 3px 10px;
                    }
                    &-name {
                        height     : 12px;
                        line-height: 12px;
                    }
                }
                .title:link{
                    background-color: #48A8DA;
                }
                .title:visited{
                    background-color: #DEDEDE;
                    .triangle-down {
                            width       : 0px;
                            height      : 0px;
                            *width      : 7px;
                            *height     : 10px;
                            font-size   : 0;
                            line-height : 0;
                            overflow    : hidden;
                            border-width: 5px;
                            border-style: dashed dashed solid dashed;
                            border-color: #9B9B9B transparent  transparent transparent;
                            margin      : 3px 10px;
                    }
                    .title-name{
                        color: #FFF;
                    }
                }
                .title:hover{
                    background-color: #48A8DA;
                    color           : #FFF;
                    .triangle-up {
                            width       : 0px;
                            height      : 0px;
                            *width      : 7px;
                            *height     : 10px;
                            font-size   : 0;
                            line-height : 0;
                            overflow    : hidden;
                            border-width: 5px;
                            border-style: dashed dashed solid dashed;
                            border-color: transparent  transparent transparent #FFF;
                            margin      : 3px 10px;
                    }
                    .triangle-down {
                            width       : 0px;
                            height      : 0px;
                            *width      : 7px;
                            *height     : 10px;
                            font-size   : 0;
                            line-height : 0;
                            overflow    : hidden;
                            border-width: 5px;
                            border-style: dashed dashed solid dashed;
                            border-color: #fff transparent  transparent transparent;
                            margin      : 3px 10px;
                    }
                    .title-name{
                        color: #FFF;
                    }
                }
                .title:active{
                    background-color: #DEDEDE;
                    .triangle-down {
                            width       : 0px;
                            height      : 0px;
                            *width      : 7px;
                            *height     : 10px;
                            font-size   : 0;
                            line-height : 0;
                            overflow    : hidden;
                            border-width: 5px;
                            border-style: dashed dashed solid dashed;
                            border-color: blue transparent  transparent transparent;
                            margin      : 3px 10px;
                    }
                    .title-name{
                        color: #FFF;
                    }
                }
            }
            .menu-child {
                display      : block;
                font-size    : 12px;
                color        : #4A4A4A;
                text-align   : center;
                box-sizing   : border-box;
                padding      : 0 20px;
                width        : 100%;
                height       : 40px;
                line-height  : 40px;
                overflow     : hidden;
                white-space  : nowrap;
                text-overflow: ellipsis;
            }
            .menu-child:link {
                color           : #fff;
                background-color: #48A8DA;
            }
            .menu-child:visited {
                color           : #fff;
                background-color: #48A8DA;
            }
            .menu-child:hover {
                color           : #fff;
                background-color: #48A8DA;
            }
            .menu-child:active {
                color           : #fff;
                background-color: #48A8DA;
            }
        }
  }
}
</style>


