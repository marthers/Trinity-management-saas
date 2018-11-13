
<template>
    <div class="create">
        <div class = "box">
            <header class = "header">
                <div class = "left"></div>
                <div class="right">
                    编辑法人信息
                </div>
            </header>
            <div class = "con corp-id">
                <p class = "info">是否使用我的身份:</p>
                <RadioGroup v-model="legal" @on-change = "radioChange">
                    <Radio label="self">
                        <span>使用</span>
                    </Radio>
                    <Radio label="notSelf">
                        <span>不使用</span>
                    </Radio>
                </RadioGroup>
            </div>
            <div class = "id-con">
                <div class = "face-con">
                    <p class = "info">证件正面照：</p>
                    <div class = "img-not-uploaded-box" v-if = "disabled" :style = "{backgroundImage : 'url(' + frontBase64Data + ')'}">
                        <!-- <div class = "img-not-uploaded"></div> -->
                    </div>
                    <img-upload 
                        v-else
                        @base64   = "frontBase64" 
                        @deleteBase64 = "deleteFront" 
                        :modalTitle = "frontModalTitle" 
                        :uploadId   = "frontUploadId"
                        :beforeHasData = "beforeHasDataUp"
                        :indentImg = 'indentImgUp'></img-upload>
                </div>
            </div>
            <div class = "id-con">
                <div class = "face-con">
                    <p class = "info">证件反面照：</p>
                    <!-- <div class = "img-not-uploaded-box">
                        <div class = "img-not-uploaded"></div>
                    </div> -->
                    <div class = "img-not-uploaded-box" v-if = "disabled" :style = "{backgroundImage : 'url(' + versoLegalBase64Data + ')'}">
                        <!-- <div class = "img-not-uploaded"></div> -->
                    </div>
                    <img-upload 
                        v-else
                        @base64   = "versoLegalBase64" 
                        @deleteBase64 = "deleteVerso" 
                        :modalTitle = "versoModalTitle" 
                        :uploadId   = "versoUploadId"></img-upload>
                </div>
            </div>
            <div class = "con legal-name">
                <p class = "info">法人姓名：</p>
                <input type="text" v-model="userName" class = "input" :placeholder="legalName"  maxlength = "20" :disabled = "disabled"/>
            </div>
            <div class = "con id-number">
                <p class = "info">法人身份证号：</p>
                <input type="text" v-model="IDNumber" class = "input" :placeholder="legalID"  maxlength = "20" :disabled = "disabled"/>
            </div>
            <footer>
                <div class = "back" @click.stop.prevent = "legalBack">上一步</div>
                <div class = "next" @click = "submitCreate">确认并返回</div>
            </footer>
        </div>
    </div>
</template>
<script>
import ImgUpload from '@/components/ImgUpload';
export default {
    name: 'CreatePerson',
    data() {
        return {
            userName: '',
            IDNumber: '',
            legal : '',
            disabled : false,
            legalID : '请输入身份证号码',
            legalName : '请输入真实姓名',
            frontBase64Data : '',
            versoLegalBase64Data : '',
            frontModalTitle : '证件正面照',
            frontUploadId : 'legalFrontId',
            beforeHasDataUp : false,
            indentImgUp : '',
            versoModalTitle : '证件反面照',
            versoUploadId : 'versoLegalUploadId'
        }
    },
    methods : {
        legalBack() {
            this.$emit('back-to-merchant')
        },
        submitCreate() {
            if(this.legal == 'self') {
                this.$emit('submit-create',{
                    'is_select_me' : 1
                })
            }
            else {
                let o = {
                    'is_select_me' : 0,
                    'corporate_name' : this.userName,
                    'corporate_ident' : this.IDNumber,
                    'corporate_card_up' : this.corporate_card_up,
                    'corporate_card_down' : this.versoLegalBase64Data
                }
                console.log(o)
                this.$emit('submit-create',o)
            }
        },
        radioChange() {
            console.log(`this.legal=${this.legal}`);
            if(this.legal == 'self') {
                this.disabled = true;
                this.legalID = localStorage.getItem('ident_num');
                let peffixUrl = ''
                if(process.env.NODE_ENV == 'development') {
                    peffixUrl = 'http://trinity-local.oss-cn-huhehaote.aliyuncs.com' 
                }else {
                    peffixUrl = 'http://trinity-product.oss-cn-huhehaote.aliyuncs.com' 
                }
                this.frontBase64Data = peffixUrl + localStorage.getItem('ident_up');
                this.versoLegalBase64Data = peffixUrl + localStorage.getItem('ident_down');
                this.legalName = localStorage.getItem('ident_name')
            }else {
                this.disabled = false;
                this.legalID = '请输入身份证号码';
                this.legalName = '请输入真实姓名';
                this.frontBase64Data = ''
                this.versoLegalBase64Data = ''
            }
        },
        frontBase64(base64) {
            console.log('frontBase64:')
            // console.log(base64);
            this.corporate_card_up = base64
        },
        versoLegalBase64(base64) {
            this.versoLegalBase64Data = base64
        },
        deleteFront () {
            this.frontBase64Data = '';
            // if(localStorage.getItem('ident_up') != null && localStorage.getItem('ident_up').length >  0) {
            //     localStorage.removeItem('ident_up')
            // }
        },
        deleteVerso(){
            this.versoLegalBase64Data = ''
        }
    },
    components : {
        ImgUpload
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
            margin-bottom  : 4vh;
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
                    width      : 140px;
                    height     : 20px;
                    font-size  : 14px;
                    font-family: PingFangSC-Medium;
                    font-weight: 500;
                    color      : rgba(74,74,74,1);
                    line-height: 20px;
                    text-align : right;
                    margin-right : 15px;
                }
                .img-not-uploaded-box {
                    width        : 240px;
                    height       : 153px;
                    background   : rgba(255,255,255,0.2);
                    border-radius: 6px;
                    border       : 1px solid #DEDEDE;
                    cursor       : not-allowed;
                    background-size    : contain;
                    background-position: center;
                    background-repeat: no-repeat;
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
            .ivu-radio-wrapper{
                margin-right : 60px;
            }
            .info {
                width      : 140px;
                height     : 20px;
                font-size  : 14px;
                font-family: PingFangSC-Medium;
                font-weight: 500;
                color      : rgba(74,74,74,1);
                line-height: 20px;
                text-align : right;
                margin-right : 15px;
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
