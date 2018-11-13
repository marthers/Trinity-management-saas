
<template>
    <div class="create">
        <div class = "box">
            <header class = "header">
                <div class = "left"></div>
                <div class="right">
                    创建个人信息
                </div>
            </header>
            <!-- <div class = "logo">
                <p class = "logo-title">公司Logo: </p>
                <div class = "img-not-uploaded-box">
                    <div class = "img-not-uploaded"></div>
                </div>
            </div> -->
            <div class = "con username">
                <p class = "info">姓名：</p>
                <input type="text" v-model.trim="userName" class = "input" :placeholder="userNamePlaceholder"  maxlength = "20" onkeyup="this.value=this.value.replace(/[^\u4e00-\u9fa5]/g,'')"/>
            </div>
            <div class = "con id-number">
                <p class = "info">身份证号：</p>
                <input type="text" v-model="IDNumber" class = "input" :placeholder="IDPlaceholder"  onkeyup="this.value=this.value.replace(/[^\w]/g,'');"/>
            </div>
            <div class = "id-con">
                <div class = "face-con">
                    <p class = "info">证件正面照：</p>
                    <img-upload
                                                                                                @base64       = "frontBase64"
                                                                                                @deleteBase64 = "deleteFront"
                                                                                              :modalTitle     = "frontModalTitle"
                                                                                              :uploadId       = "frontUploadId"
                                                                                              :beforeHasData  = "beforeHasDataUp"
                                                                                              :indentImg      = 'indentImgUp'></img-upload>
                </div>
                <div class = "face-con">
                    <p class = "info">证件反面照：</p>
                    <!-- <div class = "img-not-uploaded-box">
                        <div class = "img-not-uploaded"></div>
                    </div> -->
                    <img-upload
                                                                                                    @base64       = "versoBase64"
                                                                                                    @deleteBase64 = "deleteVerso"
                                                                                                  :modalTitle     = "frontModalTitle"
                                                                                                  :beforeHasData  = "beforeHasData"
                                                                                                  :indentImg      = 'indentImg'
                                                                                                  :uploadId       = "versoUploadId">
                    </img-upload>
                </div>
            </div>
            <div class = "first" v-if= "!createShow">
                <span v-show = "selectedMerchant.organizationName && selectedMerchant.organizationName.length > 0" class = "chosen-org">
                    您已经选择{{selectedMerchant.organizationName}}。
                </span>
                <span v-show = "!selectedMerchant.organizationName">请选择您要加入的上级商户。</span>
                <span class = "choose" @click = "chooseUpper">点此选择您的上级商户</span>
            </div>
            <footer>
                <div class = "back" @click.stop.prevent = "backToIndex">返回</div>
                <div class = "next" @click.stop.prevent = "toMerchant" v-if = "createShow">下一步：商户信息</div>
                <div class = "next"   @click.stop.prevent = "chooseUpper" v-else>确定</div>
            </footer>
        </div>
        <Modal
            v-model = "selectOrgShow"
            closable
            width  = '1000'
            @on-ok = "selectOrgShow = false"
            footer-hide
            class-name = "create-modal">
            <join-in-org
                :JoinInOrgShow       = "selectOrgShow"
                :orgList.sync        = "orgList"
                  @chooseOrgBack     = "chooseOrgBack"
                :total_pages         = "total_pages"
                  @superior-selected = "superiorSelected" ></join-in-org>
        </Modal>
    </div>
</template>
<script>
import {
    validateCName,
    identifyID
} from '@/libs/validate.js';
import {UserInfoEdit} from '@/api/user.js';
import ImgUpload from '@/components/ImgUpload';
import JoinInOrg from '@/components/JoinInOrg';
import {
    filterStr
} from '@/libs/filter.js';
import {getOrgList} from '@/api/org/org.js';
import baseConfig from '@/config/index';
const baseUrl = baseConfig.baseUrl.localOrgHost;
export default {
    name: 'CreatePerson',
    data() {
        return {
            selectedMerchant   : {},
            userName           : '',
            IDNumber           : '',
            files              : [],
            frontModalTitle    : '身份证正面照',
            frontBase64Data    : '',
            versoData          : '',
            versoUploadId      : 'versoUploadId',
            frontUploadId      : 'frontUploadId',
            isEdit             : false,
            userNamePlaceholder: '请输入真实姓名',
            IDPlaceholder      : '请输入身份证号码',
            beforeHasData      : false,
            indentImg          : '',
            beforeHasDataUp    : false,
            indentImgUp        : '',
            selectOrgShow      : false,
            orgList            : [],
            total_pages        : 1000,
        }
    },
    methods : {
        backToIndex() {
            this.$emit('person-back')
        },
        chooseOrgBack() {
            this.selectOrgShow = false;
        },
        toMerchant() {
            // this.$emit('createPersonSuccess');
            if(this.userName == localStorage.getItem('ident_name') && this.IDNumber == localStorage.getItem('ident_num') && this.frontBase64Data.length == 0 && localStorage.getItem('ident_down') != null && localStorage.getItem('ident_up') != null && this.versoData.length == 0) {
                this.$emit('createPersonSuccess',{});
            }else {
                if(this.userName != localStorage.getItem('ident_name') && this.IDNumber != localStorage.getItem('ident_num') && this.frontBase64Data.length != 0 && this.versoData.length != 0) {
                    if(this.userName.length > 0) {
                        if(!validateCName(this.userName)) {
                            this.$Notice.error({
                                title: '中文姓名格式有误',
                                desc : '请仔细检查您所输入的中文姓名'
                            });
                            return false
                        }else {
                            if(this.IDNumber.length > 0) {
                                if(!identifyID(this.IDNumber)) {
                                    this.$Notice.error({
                                        title: '身份证号格式有误',
                                        desc : '请仔细检查您所输入的身份证号'
                                    });
                                    return false
                                }else {
                                    if(this.frontBase64Data.length > 0 && this.versoData.length > 0) {
                                        UserInfoEdit(baseUrl + '/trinity-backstage/user/edit_info',
                                        {
                                            'priority': 5,
                                            'group'   : 0,
                                            'data'    : {
                                                // 'edit_mode'  : this.isEdit ? 0: 1,
                                                'edit_mode'  : 0,
                                                'need_verify': 1,
                                                'user_info'  : {
                                                    'ident_name': this.userName,
                                                    'ident_num' : this.IDNumber,
                                                    'ident_up'  : this.frontBase64Data,
                                                    'ident_down': this.versoData
                                                }
                                            }
                                        }
                                    )
                                        .then(res => {
                                            console.log("res:")
                                            console.log(res)
                                            console.log("res.data:")
                                            console.log(res.data)
                                            if(res.status && res.status == 200) {
                                                    console.log(`code=${res.data.code}`)
                                                if(res.data) {
                                                    let code = res.data.code;
                                                    console.log(`code=${res.data.code}`)
                                                    if(code == 1) {
                                                        this.$Message.info({
                                                            content : "Token因为超时而失效",
                                                            duration: 5,
                                                            closable: true
                                                        });
                                                    }else if(code == 0) {
                                                        this.$emit('createPersonSuccess',res.data.user_info);
                                                    }
                                                }
                                            }else {
                                                this.$Message.error({
                                                    content : '网络异常，请联系管理员及时处理',
                                                    duration: 5,
                                                    closable: true
                                                })
                                            }
                                        }).catch(err => {
                                            console.log(err)
                                        })
                                        console.log(" this.$emit('person-forward')")

                                    }
                                    else {
                                        this.$Notice.error({
                                            title: '身份证照片缺失',
                                            desc : '身份证照片缺失'
                                        });
                                        return false
                                    }
                                }
                            }else {
                                if(!validateCName(this.userName)) {
                                    this.$Notice.error({
                                        title: '错误',
                                        desc : '暂未输入身份证号'
                                    });
                                    return false
                                }
                            }
                        }
                    }else {
                        if(!validateCName(this.userName)) {
                            this.$Notice.error({
                                title: '错误',
                                desc : '暂未输入姓名'
                            });
                            return false
                        }
                    }
                }
                else {
                    let user_info = {};
                    if(this.userName != localStorage.getItem('ident_name')) {
                        user_info.ident_name = this.userName;
                        if(!validateCName(this.userName)) {
                            this.$Notice.error({
                                title: '错误',
                                desc : '暂未输入姓名'
                            });
                            return false
                        }
                    }
                    if(this.IDNumber != localStorage.getItem('ident_num')) {
                        user_info.ident_num = this.IDNumber;
                        if(!identifyID(this.IDNumber)) {
                            this.$Notice.error({
                                title: '身份证号格式有误',
                                desc : '请仔细检查您所输入的身份证号'
                            });
                            return false
                        }
                    }
                    if(this.frontBase64Data.length != 0) {
                        user_info.ident_up = this.frontBase64Data
                    }
                    if(this.versoData.length != 0) {
                        user_info.ident_down = this.versoData
                    };
                    console.log("user_info:");
                    console.log(user_info);


                    UserInfoEdit(baseUrl + '/trinity-backstage/user/edit_info',
                        {
                            'priority': 5,
                            'group'   : 0,
                            'data'    : {
                                // 'edit_mode'  : this.isEdit ? 0: 1,
                                'edit_mode'  : 0,
                                'need_verify': 1,
                                'user_info'  : user_info
                            }
                        }
                    )
                    .then(res => {
                        console.log("res:")
                        console.log(res)
                        console.log("res.data:")
                        console.log(res.data)
                        if(res.status && res.status == 200) {
                                console.log(`code=${res.data.code}`)
                            if(res.data) {
                                let code = res.data.code;
                                console.log(`code=${res.data.code}`)
                                if(code == 1) {
                                    this.$Message.info({
                                        content : "Token因为超时而失效",
                                        duration: 5,
                                        closable: true
                                    });
                                }else if(code == 0) {
                                    for(let item in res.data.user_info) {
                                        localStorage.setItem(item,res.data.user_info[item])
                                    }
                                    this.$emit('createPersonSuccess',res.data.user_info);
                                }
                            }
                        }else {
                            this.$Message.error({
                                content : '网络异常，请联系管理员及时处理',
                                duration: 5,
                                closable: true
                            })
                        }
                    }).catch(err => {
                        console.log(err)
                    })

                }
            }



            console.log(identifyID(this.IDNumber))
        },
        frontBase64(base64) {
            console.log('frontBase64:')
            // console.log(base64);
            this.frontBase64Data = base64
        },
        deleteFront () {
            this.frontBase64Data = '';
            if(localStorage.getItem('ident_up') != null && localStorage.getItem('ident_up').length >  0) {
                localStorage.removeItem('ident_up')
            }
        },
        deleteVerso () {
            this.versoData = '';
            if(localStorage.getItem('ident_down') != null && localStorage.getItem('ident_down').length >  0) {
                localStorage.removeItem('ident_down')
            }
        },
        versoBase64(base64) {
            console.log('versoBase64:')
            // console.log(base64);
            this.versoData = base64
        },
        //选择上级商户
        chooseUpper() {
            // this.getOrg(true)
            // // this.$emit('merchant-select-upper')
            this.$nextTick(() => {
                getOrgList(baseUrl + '/trinity-backstage/organization/list',
                {
                    'priority': 5,
                    'group'   : 0,
                    'data'    : {
                        'page_index': 1,
                        'page_size' : 20,
                        // "filters"   : [
                        //     {"key":"idOrganization","operator":"=","value":1,"join":"or"},
                        //     {"key":"parentIdOrganization","operator":"=","value":1,"join":"and"}
                        // ]
                    }
                })
                .then(res => {
                    console.log(res)
                    if(res.status && res.status == 200 && res.data.code == 0) {
                        console.log("res.data:");
                        console.log(res.data)
                        let data             = res.data.data;
                            this.orgList     = data.organization_list
                            this.total_pages = data.page.total_pages;
                        // setTimeout(() => {
                            this.selectOrgShow = true;
                        // },500)
                    }
                    else{
                        this.$Message.error({
                            content : '网络异常，请联系管理员及时处理',
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
            })
        },
        superiorSelected(selectedSuperior){
            console.log(selectedSuperior);
            this.selectedMerchant = selectedSuperior;
            this.$emit('selectedSuperior',selectedSuperior)
        },
    },
    created() {
        // console.log(`localStorage.getItem('create')=${localStorage.getItem('create')}`)
        // if(localStorage.getItem('create') != null) {
        //     this.createShow = localStorage.getItem('create')
        // // }
        // else {
        //     this.createShow = false
        // }
        if(localStorage.getItem('ident_name') != null && localStorage.getItem('ident_name').length >  0) {
            this.userNamePlaceholder = localStorage.getItem('ident_name');
            this.userName            = localStorage.getItem('ident_name');
        }else {
            this.userNamePlaceholder = '请输入真实姓名'
            this.userName            = ''
        }

        if(localStorage.getItem('ident_num') != null && localStorage.getItem('ident_num').length >  0) {
            this.IDPlaceholder = localStorage.getItem('ident_num');
            this.IDNumber      = localStorage.getItem('ident_num');
        }else {
            this.IDPlaceholder = '请输入身份证号码';
            this.IDNumber      = ''
        }

        if(localStorage.getItem('ident_down') != null && localStorage.getItem('ident_down').length >  0) {
            this.beforeHasData = true;
            this.indentImg     = localStorage.getItem('ident_down');

        }else {
            this.beforeHasData = false;
            this.indentImg     = ''
        }

        if(localStorage.getItem('ident_up') != null && localStorage.getItem('ident_up').length >  0) {
            this.beforeHasDataUp = true;
            this.indentImgUp     = localStorage.getItem('ident_up')
        }else {
            this.beforeHasDataUp = false;
            this.indentImgUp     = ''
        }
    },
    props : {
        createShow : {
            type   : Boolean,
            default: true
        }
    },
    components : {
        ImgUpload,JoinInOrg
    }
}
</script>
<style lang= "less" scoped>
.create{
    width  : 100%;
    height : 100%;
    padding: 2.5% 0 0 2.5%;
    color  : #4A4A4A;
    .box {
        width : 95%;
        height: 95%;
        .header {
            width          : 100%;
            height         : 36px;
            display        : flex;
            justify-content: left;
            align-items    : center;
            .left {
                width       : 4px;
                height      : 36px;
                background  : linear-gradient(180deg,rgba(67,170,246,1) 0%,rgba(63,128,247,1) 100%);
                margin-right: .625rem /* 10/16 */;
            }
            .right {
                max-width  : 200px;
                font-size  : 18px;
                height     : 36px;
                line-height: 36px;
                text-align : center;
            }
        }
        /* .logo {
            width          : 100%;
            height         : 96px;
            display        : flex;
            justify-content: left;
            flex-direction : row;
            align-items    : top;
            margin         : 20px 0;
            .logo-title {
                color       : #4A4A4A;
                font-size   : 14px;
                margin-right: 20px;
            }
            .img-not-uploaded-box {
                width        : 96px;
                height       : 96px;
                background   : rgba(255,255,255,0.2);
                border-radius: 6px;
                border       : 1px solid #DEDEDE;
                .img-not-uploaded {
                    width              : 64px;
                    height             : 60px;
                    background-size    : contain;
                    background-position: center;
                    background-image   : url('./../../../assets/images/noData/imgNotUploaded.png');
                    @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                        background-image: url('./../../../assets/images/noData/imgNotUploaded@2x.png');
                    }
                    margin: 18px 16px;
                }
            }
        } */
        .id-con {
            margin-bottom  : 6vh;
            display        : flex;
            flex-direction : row;
            justify-content: left;
            align-items    : center;
            height         : 153px;
            max-width      : 100%;
            .face-con {
                display        : flex;
                flex-direction : row;
                justify-content: left;
                align-items    : center;
                height         : 153px;
                margin-right   : 45px;
                .info {
                    width       : 84px;
                    height      : 20px;
                    font-size   : 14px;
                    font-family : PingFangSC-Medium;
                    font-weight : 500;
                    color       : rgba(74,74,74,1);
                    line-height : 20px;
                    text-align  : center;
                    margin-right: 15px;
                }
                .img-not-uploaded-box {
                    width        : 240px;
                    height       : 153px;
                    background   : rgba(255,255,255,0.2);
                    border-radius: 6px;
                    border       : 1px solid #DEDEDE;
                    cursor       : pointer;
                    .img-not-uploaded {
                        width              : 64px;
                        height             : 60px;
                        background-size    : contain;
                        background-position: center;
                        background-image   : url('./../../../assets/images/noData/imgNotUploaded.png');
                        @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                            background-image: url('./../../../assets/images/noData/imgNotUploaded@2x.png');
                        }
                        margin: 46.5px 88px;
                    }
                }
            }
        }

        .con {
            margin         : 4vh 0;
            display        : flex;
            flex-direction : row;
            justify-content: left;
            align-items    : center;
            height         : 36px;
            .info {
                width       : 84px;
                height      : 20px;
                font-size   : 14px;
                font-family : PingFangSC-Medium;
                font-weight : 500;
                color       : rgba(74,74,74,1);
                line-height : 20px;
                text-align  : center;
                margin-right: 15px;
            }
            .input {
                width        : 240px;
                height       : 36px;
                background   : rgba(255,255,255,0.2);
                border-radius: 6px;
                border       : 1px solid #1CA1C6;
                font-size    : 12px;
                line-height  : 36px;
                text-align   : left;
                text-indent  : 2em;
                outline      : none;                   //去掉Chromefocus边框
            }
        }

        .first {
            width          : 100%;
            height         : 36px;
            background     : rgba(248,231,28,0.12);
            border         : 1px solid;
            font-size      : 14px;
            text-align     : left;
            line-height    : 36px;
            text-indent    : 1em;
            margin         : 20px 0;
            display        : flex;
            justify-content: left;
            align-items    : center;
            span{
                display: inline-block;
            }
            .choose {
                color        : #48A8DA;
                border-bottom: 1px solid  #48A8DA;
                cursor       : pointer;
            }
            .chosen-org {
                max-width    : 600px;
                overflow     : hidden;
                white-space  : nowrap;
                text-overflow: ellipsis;
            }
        }
        footer {
            display        : flex;
            flex-direction : row;
            justify-content: left;
            width          : 100%;
            height         : 36px;
            align-items    : center;
            div {
                cursor       : pointer;
                height       : 100%;
                text-align   : center;
                line-height  : 36px;
                font-size    : 18px;
                border-radius: 4px;
            }
            .back {
                color : #4a4a4a;
                border: 1px solid #DEDEDE;
                width : 160px;
            }
            .next {
                border       : 1px solid rgba(72,168,218,1);
                background   : rgba(72,168,218,1);
                border-radius: 4px;
                color        : #fff;
                width        : 272px;
                margin-left  : 30px;
            }
        }
    }
}
</style>
