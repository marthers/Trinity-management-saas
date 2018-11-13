
<template>
    <div class="create">
        <div class = "box">
            <header class = "header">
                <div class = "left"></div>
                <div class="right">
                    编辑商户
                </div>
            </header>
            <div class = "first">
                <span v-show = "selectedMerchant.organizationName && selectedMerchant.organizationName.length > 0">
                    您已经选择{{selectedMerchant.organizationName}}。
                </span>
                <span v-show = "!selectedMerchant.organizationName">若已有上级商户，请选择您的上级商户。</span>
                <span class = "choose" @click.stop.prevent = "chooseUpper">点此选择您的上级商户</span>
            </div>
            <div class = "id-con">
                <div class = "face-con">
                    <p class = "info">上传公司证照正面：</p>
                    <img-upload @base64   = "corpBase64" @deleteBase64 = "deleteCorp" :modalTitle = "corpModalTitle" :uploadId   = "corpUploadId"></img-upload>
                </div>
            </div>
            <div class = "logo">
                <p class = "logo-title">公司Logo: </p>
                <img-upload @base64   = "logoBase64" @deleteBase64 = "deleteLogo" :modalTitle = "logoModalTitle" :uploadId   = "logoUploadId"></img-upload>
            </div>
            <div class = "con corp-name">
                <p class = "info">公司注册名称：</p>
                <input type="text" v-model="userName" class = "input" placeholder="公司注册名称"  maxlength = "20"/>
            </div>
            <div class = "con corp-id">
                <p class = "info">公司证照号码：</p>
                <input type="text" v-model="IDNumber" class = "input" placeholder="请输入公司证照号码"  maxlength = "20"/>
            </div>
            <div class = "con corp-id">
                <p class = "info">公司简要描述：</p>
                <Input v-model="des" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入公司简要描述(选填)" @on-keyup="des=des.replace(/[^\u4E00-\u9FA5|,|.]/g,'')"/>
            </div>
            <footer>
                <div class = "back" @click.stop.prevent = "backToPerson">上一步</div>
                <div class = "next" @click = "toEditLegalPerson">下一步： 编辑法人信息</div>
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
// import { VueEditor } from "vue2-editor";
import ImgUpload from '@/components/ImgUpload';
import JoinInOrg from '@/components/JoinInOrg';
// import CreateLegal from './CreateLegal';
import {
    validateCName
} from '@/libs/validate.js';
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
            userName        : '',
            IDNumber        : '',
            logoModalTitle  : '公司Logo',
            logoUploadId    : 'logoUploadId',
            des             : '',
            superior        : 'superior',
            selectOrgShow   : false,
            corpBase64Data  : '',               //公司证照正面,
            corpModalTitle  : '公司证照正面',
            corpUploadId    : 'corpUploadId',
            selectedMerchant: {},
            logoBase64Data  : '',
            orgList         : [],
            page_index      : 1,
            page_size       : 20,
            total_pages     : 1000,
            // content : '',
            // customToolbar: [
            //     ["bold", "italic", "underline"],
            //     // [{ list: "ordered" }, { list: "bullet" }],
            //     // ["image", "code-block"]
            // ]
        }
    },
    components : {
        ImgUpload,
        JoinInOrg
        // VueEditor
    },
    methods : {
        editorBlur(){
            console.log(this.content);
        },
        superiorSelected(selectedSuperior){
            console.log(selectedSuperior);
            this.selectedMerchant = selectedSuperior;
            this.$emit('selectedSuperior',selectedSuperior)
        },
        pullup(page_index) {
            // debugger
            console.log(`this.page_index=${page_index}`)
            // this.page_index = page_index;
            // this.getOrg(false);
            getOrgList(baseUrl + '/trinity-backstage/organization/list',
            {
                'priority': 5,
                'group'   : 0,
                'data'    : {
                    'page_index': page_index,
                    'page_size' : this.page_size
                }
            })
            .then(res => {
                console.log(res)
                if(res.status && res.status == 200 && res.data.code == 0) {
                    console.log("res.data:");
                    console.log(res.data)
                    let data         = res.data.data;
                        this.orgList = this.orgList.concat(data.organization_list);
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
        },
        chooseOrgBack() {
            this.selectOrgShow = false;
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
                        "filters"   : [
                            {"key":"idOrganization","operator":"=","value":1,"join":"or"},
                            {"key":"parentIdOrganization","operator":"=","value":1,"join":"and"}
                        ]
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
        backToPerson() {
            this.$emit('back-to-person')
        },
        toEditLegalPerson() {
            // if(this.selectedMerchant.length == 0) {
            //     this.$Notice.error({
            //         title: '您暂未选择任何上级组织',
            //         desc : '请先选择您的上级组织'
            //     });
            //     return false
            // }
            if(this.logoBase64Data.length == 0) {
                this.$Notice.error({
                    title: 'Logo照片暂未上传',
                    desc : '请先上传Logo照片'
                });
                return false
            }
            if(this.corpBase64Data.length == 0) {
                this.$Notice.error({
                    title: '公司营业执照照片暂未上传',
                    desc : '请先上传公司营业执照照片'
                });
                return false
            }
            if(this.des.replace(/s+/g,'').length > 0) {
                console.log(`filterStr(this.des)=${filterStr(this.des)}`);
            }
            this.$emit('to-legal',{
                'selectedMerchant': JSON.stringify(this.selectedMerchant),
                'logoBase64Data'  : this.logoBase64Data,
                'corpBase64Data'  : this.corpBase64Data,
                'IDNumber'        : this.IDNumber,
                'corpName'        : this.userName,
                'des'             : this.des
            })
        },
        logoBase64(base64) {
            console.log('logoBase64_base64:');
            console.log(base64);
            this.logoBase64Data = base64;
        },
        superiorChange() {
            console.log(this.superior)
            // if(this.superior == 'org') {
            //     this.selectOrgShow = true
            // }else{
            //     this.selectOrgShow = false
            // }
        },
        corpBase64(base64) {
            console.log('corpBase64_base64:')
            console.log(base64);
            this.corpBase64Data = base64
        },
        deleteCorp() {
            this.corpBase64Data = ''
        },
        deleteLogo() {
            this.logoBase64Data = ''
        }
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
</style>
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
        .logo {
            width          : 100%;
            height         : 96px;
            display        : flex;
            justify-content: left;
            flex-direction : row;
            align-items    : top;
            margin         : 20px 0;
            cursor         : pointer;
            margin-bottom  : 8vh;
            .logo-title {
                /* color       : #4A4A4A;
                font-size   : 14px;
                margin-right: 20px; */
                width       : 140px;
                height      : 20px;
                font-size   : 14px;
                font-family : PingFangSC-Medium;
                font-weight : 500;
                color       : rgba(74,74,74,1);
                line-height : 20px;
                text-align  : right;
                margin-right: 15px;
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
        }
        .first {
            width      : 100%;
            height     : 36px;
            background : rgba(248,231,28,0.12);
            border     : 1px solid;
            font-size  : 14px;
            text-align : left;
            line-height: 36px;
            text-indent: 1em;
            margin     : 20px;
            .choose {
                color        : #48A8DA;
                border-bottom: 1px solid  #48A8DA;
                cursor       : pointer;
            }
        }
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
                /* align-items    : center; */
                height      : 153px;
                margin-right: 45px;
                .info {
                    width       : 140px;
                    height      : 20px;
                    font-size   : 14px;
                    font-family : PingFangSC-Medium;
                    font-weight : 500;
                    color       : rgba(74,74,74,1);
                    line-height : 20px;
                    text-align  : right;
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
                width       : 140px;
                height      : 20px;
                font-size   : 14px;
                font-family : PingFangSC-Medium;
                font-weight : 500;
                color       : rgba(74,74,74,1);
                line-height : 20px;
                text-align  : right;
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

        footer {
            display        : flex;
            flex-direction : row;
            justify-content: left;
            width          : 100%;
            height         : 36px;
            div {
                cursor       : pointer;
                height       : 100%;
                text-align   : center;
                line-height  : 36px;
                font-size    : 18px;
                border-radius: 4px;
            }
            .back {
                color : #4A4A4A;
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
