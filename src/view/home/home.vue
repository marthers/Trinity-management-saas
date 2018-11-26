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
                <div class = "left-side-con" id = "left-side-main" v-show = "$store.state.menuShow" ref = "leftSideCon">
                    <div class= "left-side-box">
                        <div :class = "{'item-con' : true,'left-side-selected' : iconSelected == item.id_index1}"
                            v-for = "(item,index) in menuList"
                            :key = "index"
                            @click.stop.prevent = "iconSelect(item)">
                            <div :class = "[item.class,'inside-item']"></div>
                        </div>
                    </div>
                </div>
                <div class = "left-menu-con" v-if = "leftSideSelected == 'menu'" v-show = "$store.state.menuShow" ref = "leftMenuCon">
                    <div class = "menu-head">
                        <span>organization_level:{{organization_level}}</span>
                        <span>role_level:{{role_level}}</span>
                    </div>
                    <!-- <button class = "back">返回</button> -->
                    <div v-for = "(item,index) in menuList" :key = "index">
                        <div class = "survey-menu-con menu-con" v-for = "(m,n) in item.sub_items" :key = "n" v-if = "iconSelected == item.id_index1">
                        <!-- <div class = "survey-menu-con menu-con" v-for = "(m,n) in item.sub_items" :key = "n" v-if = "m.clicked%2 > 0"> -->
                            <!-- <div :class= "[selectedIdIndex2 == m.id_index2 && selectedIdIndex1 == m.id_index1 ? 'second-selected' : '','title-con']"> -->
                            <div :class= "['title-con']">
                                <button class = "title" @click.stop.prevent = "titleClicked(index,n)">
                                    <div :class = "[m.clicked%2 > 0 ? 'triangle-down' :'triangle-up']"></div>
                                    <a class = "title-name">
                                        {{
                                            m.name
                                        }}
                                    </a>
                                </button>
                            </div>
                            <!-- <a class = "menu-child" v-for = "(i,key) in item.sub_items" :key = "key" v-if = "item.clicked%2 > 0"> -->
                            <a
                                v-for = "(x,y) in m.sub_items"
                                :key = "y"
                                v-if = "m.clicked%2 > 0"
                                @click.stop.prevent = "thirdSelected(item,m,x)"
                                :class = "[selectedIdIndex3 == x.id_index3 && selectedIdIndex2 == m.id_index2 && selectedIdIndex1 == item.id_index1 ? 'third-selected' : '' , 'menu-child']">
                                {{
                                    x.name
                                }}
                            </a>
                        </div>
                    </div>
                </div>
                <div class = "content">
                    <router-view></router-view>
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
const localOrgHost = baseConfig.baseUrl.localOrgHost;
import JoinInOrg from '@/components/JoinInOrg';
import {
  getOrgDetail,
  getUserDetail
  } from '@/api/login.js';
export default {
    data() {
        return {
            selectedIdIndex3 : -1,
            selectedIdIndex2 : -1,
            selectedIdIndex1 : -1,
            // menuShow : false,
            iconSelected : 1,
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
            merchantData          : {},
            organization_level : -1,
            role_level : -1
        }
    },
    components : {
        JoinInOrg
    },
    methods : {
        iconSelect(item) {
            console.log('iconSelect')
            console.log(item)
            this.iconSelected = item.id_index1;
            item.sub_items.forEach((m,n) => {
                m.clicked = 1
            });
            this.selectedIdIndex1 = item.id_index1
            this.selectedIdIndex2 = item.sub_items[0].id_index2;
            this.selectedIdIndex3 = item.sub_items[0].sub_items[0].id_index3;
            // this.$router.push({
            //     path : item.sub_items[0].sub_items[0].url
            // })
        },
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
        // 三级菜单被电击
        thirdSelected(item,m,x){
            console.log("item")
            console.log(item)
            console.log("m")
            console.log(m)
            this.selectedIdIndex3 = x.id_index3;
            this.selectedIdIndex2 = m.id_index2
            this.selectedIdIndex1 = item.id_index1
            console.log("x")
            console.log(x);
            this.$router.push({
                path : x.url
            })
        },
        titleClicked(iconIndex,secondIndex) {
            // console.log(`index=${index}`)
            // console.log(`this.menuList[index].clicked=${this.menuList[index].clicked}`)
            let item = this.menuList[iconIndex].sub_items[secondIndex];
            console.log(`item=${item}`)
            ++item.clicked
            this.menuList[iconIndex].sub_items.splice(secondIndex,1,item)
            console.log(`iconIndex=${iconIndex}`);
            console.log(`item=${item}`)
            console.log(`secondIndex=${secondIndex}`)
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
            console.log(type);
            if(type === 'create') {
                this.NoDataIndexShow        = false;
                this.createPersonalInfoShow = true;
                this.createShow             = true;
                localStorage.setItem('ifPerson',0);
            }else {
                this.createShow = false
                this.NoDataIndexShow        = false;
                this.createPersonalInfoShow = true;
                localStorage.setItem('ifPerson',1)
            }
        },
        chooseOrgBack() {
            this.JoinInOrgShow          = false;
            // this.NoDataIndexShow        = true;
            this.$router.push({
              name : 'NoDataIndex'
            })
            this.createPersonalInfoShow = false;
        },
        personBack() {
            // this.NoDataIndexShow        = true;
            this.$router.push({
              name : 'NoDataIndex'
            })
                // this.$route.meta.showName = 'NoDataIndex'
            this.createPersonalInfoShow = false;
        },
        createPersonSuccess (user_info) {
            console.log("user_info:");
            console.log(user_info);
            this.NoDataIndexShow        = false;
            this.createPersonalInfoShow = false;
            this.createMerchantInfoShow = true;
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
            this.createPersonalInfoShow = false;
            this.createMerchantInfoShow = false;
            this.createLegalShow        = false;
            let reqData                     = {
                'property' : 0,
                // 'record_status' : 1,
                'rightful_status' : 1,
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
                    'id_organization'   : 0,
                    'data'    : {
                        'edit_mode'        : 0,
                        'organization_info': reqData
                    }
                }
            )
            .then(res => {
                console.log(res)
                if(res.status&& res.status == 200) {
                  // debugger
                    console.log(res.data);
                    Promise.all(
                      [
                        getOrgDetail(baseConfig.baseUrl.devHost + '/trinity-backstage/organization/detail',
                            {
                              'priority': 5,
                              'id_organization'   : 0,
                              'data' :  {
                                'organization_id' : localStorage.getItem('fid_organization')
                              }
                            }
                        ),
                        getUserDetail(baseConfig.baseUrl.devHost + '/trinity-backstage/user/detail',
                            {
                              'priority': 5,
                              'id_organization'   : 0,
                              'data' : {
                                'user_id' : localStorage.getItem('id_user')
                              }
                            })
                      ]
                    )
                    .then((result) => {
                      console.log(result);
                      if(result && result.length == 2) {
                        localStorage.setItem('fid_organization',result[1].data.data.fid_organization);
                        localStorage.setItem('user_verified',result[1].data.data.verified)
                        localStorage.setItem('org_verified',result[0].data.data.verified)
                        this.$router.push({
                          name : 'userReview'
                        })
                      }
                    }).catch((err) => {
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

    },
    mounted() {
      console.log("this.$LoadingBar:")
      console.log(this.$LoadingBar)
        if(localStorage.getItem('fid_organization') == 0 || this.$route.params.NoDataIndexShow) {
            // this.NoDataIndexShow        = true;
            if(localStorage.getItem('fid_organization') == 0 || this.$route.params.NoDataIndexShow){
              this.$store.commit('setMenuShowFalse')
            }
            else {
              this.$store.commit('setMenuShowTrue')
            }
            this.$router.push({
              name : 'NoDataIndex'
            })
            this.JoinInOrgShow          = false;
            this.createPersonalInfoShow = false;
            this.createMerchantInfoShow = false;
            this.createLegalShow        = false;
        }else {
            this.$store.commit('setMenuShowTrue')
            this.NoDataIndexShow = false;
            // this.$router.push({
            //   name : 'userReview'
            // })
            let organization_level = parseInt(localStorage.getItem('organization_level'));
            let role_level = parseInt(localStorage.getItem('role_level'));
            this.organization_level = parseInt(localStorage.getItem('organization_level'));
            this.role_level = parseInt(localStorage.getItem('role_level'));
            // item.organization_array[organization_level] == 1 && item.role_array[role_level] == 1
            // this.menuList= JSON.parse(localStorage.getItem('permission')).filter(item => {
            //     return item.organization_array[this.organization_level] == 1 && item.role_array[this.role_level] == 1
            // });
            let filterPermission = arr => {
                if(!arr) {
                    return false
                }
                else {
                    if(arr.length > 0) {
                        // debugger
                        let iconArr = []
                        arr.forEach((item,index) => {
                            if(item.organization_array[organization_level] == 1 && item.role_array[role_level] == 1) {
                                item.class = 'icon' + index
                                item.clicked = 1;
                                iconArr.push(item)
                            }
                        });
                        iconArr.forEach((m,n) => {
                            if(m.sub_items) {
                                let secondSub = []
                                m.sub_items.forEach((x,y) => {
                                    if(x.organization_array[organization_level] == 1 && x.role_array[role_level] == 1) {
                                        if(x.sub_items) {
                                            let thirdArr = []
                                            x.sub_items.forEach((q,w) => {
                                                if(q.organization_array[organization_level] == 1 && q.role_array[role_level] == 1) {
                                                    q.clicked = 1;
                                                    thirdArr.push(q)
                                                }
                                            })
                                            x.sub_items = thirdArr;
                                        }
                                        x.clicked = 1;
                                        secondSub.push(x);
                                    }
                                });
                                // debugger
                                // m.clicked = 0;
                                m.sub_items = secondSub;
                                console.log(m);
                            }
                        })
                        return iconArr;
                    }
                    else {
                        // debugger
                        return []
                    }
                }
            }
            if(localStorage.getItem('permission') != null && localStorage.getItem('permission').length > 0) {
                this.menuList = filterPermission(JSON.parse(localStorage.getItem('permission')));
                // this.menuList = JSON.parse(localStorage.getItem('permission'));
                this.selectedIdIndex1 = this.menuList[0].id_index1
                this.selectedIdIndex2 = this.menuList[0].sub_items[0].id_index2;
                this.selectedIdIndex3 = this.menuList[0].sub_items[0].sub_items[0].id_index3;
                // this.$router.push({
                //     path : this.menuList[0].sub_items[0].sub_items[0].url
                // })
            }else{
                this.menuList = []
            }
            console.log("this.menuList:")
            console.log(this.menuList)
        }
        this.fidOrg = localStorage.getItem('fid_organization');
        console.log('created:');
        console.log(this.$store.state)
        console.log("this.$route.params")
        console.log(this.$route.params);
        console.log("this.$refs.leftSideCon:")
        console.log(this.$refs.leftSideCon.clientHeight);
        console.log(this.$refs.leftMenuCon.clientHeight);
        this.$refs.leftSideCon.style.height = this.$refs.leftMenuCon.style.height;
        console.log(this.$refs.leftMenuCon.style)
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
    height: 100vh;
    overflow: hidden;
    // overflow-y: auto;
  .header{
    width           : 100vw;
    height          : 6vh;
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
            background-size    : 100% 100%;
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
                background-size    : 100% 100%;
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
            background-size    : 100% 100%;
            background-position: center;
            @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                background-image: url('./../../assets/images/home/Personal@2x.png');
            }
        }
    }
  }
  .body {
      width         : 100vw;
      height        : 94vh;
      min-height    : 100vh;
      display       : flex;
      flex-direction: row;
      position      : fixed;
      overflow      : auto;
      top           : 6vh;
        .left-side-con {
            // @media screen and(min-width:800px) {
            //   width : 50px;
            // }
            // @media screen  and(max-width:800px){
            //   width : 50px;
            // }
            width : 60px;
            min-height          : 100%;
            height: auto;
            background-color: #08131E;
            text-align      : center;
            display         : flex;
            flex-direction  : column;
            justify-content : center;
            // align-items     : center;
            .left-side-box {
                width: 50px;
                height:auto;
                position: fixed;
                top     : 45vh;
                // @media screen and(min-width:800px) {
                //   width : 3vw;
                //   margin : 0 1vw;
                // }
                // @media screen  and(max-width:800px){
                //   width : 40px;
                //   margin : 0 5px;
                // }
                .item-con {
                    // @media screen and(min-width:800px) {
                    //   width           : 3vw;
                    //   height          : 3vw;
                    //   border-radius   : 1.5vw;
                    // }
                    // @media screen  and(max-width:800px){
                    //   width           : 40px;
                    //   height          : 40px;
                    //   border-radius   : 20px;
                    // }
                    width           : 40px;
                    height          : 40px;
                    border-radius   : 20px;
                    margin          : 2vh 0;
                    background-color: #08131E;
                    display         : flex;
                    justify-content : center;
                    align-items     : center;
                    transform       : translateY(-300%);
                    .inside-item {
                        width              : 24px;
                        height             : 24px;
                        cursor             : pointer;
                        background-size    : 100% 100%;
                        background-position: center;
                    }
                }
            }
            //被选中
            .left-side-selected {
                background: linear-gradient(180deg,rgba(59,165,178,1) 0%,rgba(72,168,218,1) 100%);
            }
            .icon0 {
                background-image: url('./../../assets/images/home/Home.png');
                @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                    background-image: url('./../../assets/images/home/Home@2x.png');
                }
            }
            .icon1 {
                background-image: url('./../../assets/images/home/merchant.png');
                @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                    background-image: url('./../../assets/images/home/merchant@2x.png');
                }
            }
            .icon2{
                background-image: url('./../../assets/images/home/order.png');
                @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                    background-image: url('./../../assets/images/home/order@2x.png');
                }
            }
            .icon3 {
                background-image: url('./../../assets/images/home/merchandise.png');
                @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                    background-image: url('./../../assets/images/home/merchandise@2x.png');
                }
            }
            .icon4 {
                background-image: url('./../../assets/images/home/device.png');
                @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                    background-image: url('./../../assets/images/home/device@2x.png');
                }
            }
            .icon5 {
                background-image: url('./../../assets/images/home/Home.png');
                @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                    background-image: url('./../../assets/images/home/Home@2x.png');
                }
            }
            .icon6 {
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
            // @media screen and(min-width:800px){
            //   width           : 16vw;
            // }
            // @media screen and(max-width:799px){
            //   width           : 160px;
            // }
            width : 180px;
            min-height      : 100vh;
            height          : 100%;
            background-color: #DEDEDE;
            text-align      : center;
            overflow: hidden;
            overflow-y: auto;
            padding-bottom: 50px;
            .menu-head {
                width        : 180px !important;
                // @media screen and(min-width:800px){
                //   width           : 16vw;
                // }
                // @media screen and(max-width:799px){
                //   width           : 160px;
                // }
                height       : 6vh;
                line-height  : 6vh;
                text-align   : center;
                font-size    : 12px;width: 48px;
                font-size    : 12px;
                font-family  : PingFangSC-Medium;
                font-weight  : 500;
                color        : rgba(21,24,54,1);
                border-bottom: 1px solid rgba(66,160,186,0.49);
            }
            .back {
                width       : 180px;
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
                width           : 180px !important;
                overflow        : hidden;
                text-align      : left;
                font-size       : 12px;
                color           : #000;
                background-color: #DEDEDE;
            }
            .second-selected{
                background-color : pink;
            }
            .title-con {
                width      : 180px;
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
            .third-selected {
                background:linear-gradient(180deg,rgba(59,165,178,1) 0%,rgba(72,168,218,1) 100%);
            }
            .menu-child:link {
                color           : #fff;
                background-color: #48A8DA;
            }
            .menu-child:visited {
                color           : #fff;
                background-color: #48A8DA;
            }
            // .menu-child:hover {
            //     color           : #fff;
            //     background-color: #48A8DA;
            // }
            .menu-child:active {
                color           : #fff;
                background-color: #48A8DA;
            }
        }
        .left-menu-con::-webkit-scrollbar-track-piece { //滚动条凹槽的颜色，还可以设置边框属性
            background-color : grey;
        }
        .left-menu-con::-webkit-scrollbar {//滚动条的宽度
            width:6px;
            height:39px;
            background:rgba(72,168,218,1);
            border-radius:3px;
        }
        .left-menu-con::-webkit-scrollbar-thumb {//滚动条的设置
            background: linear-gradient(180deg, #3ba5b2 0%, #48a8da 100%);
            background-clip:padding-box;
            min-height:28px;
        }
        .left-menu-con::-webkit-scrollbar-thumb:hover {
            background-color:#bbb;
        }
  }
}
</style>


