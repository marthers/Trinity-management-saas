<template>
    <div class = "org-detail-box">
        <header>
            <div class = "title">
                <div class= "line"></div>
                <div class= "title-word">待审核商户</div>
            </div>
            <div class= "back-con" @click.stop.prevent = "orgDetailback">
                <div class = "back-icon"></div>
                <div class = "back"></div>
            </div>
        </header>
        <div class = "up">
            <div class = "left">
                <div class = "avatar" :style = "{backgroundImage: 'url(' + logo + ')'}"></div>
                <!-- <div class = "avatar"></div> -->
                <div class = "right-con">
                    <span class = "organizationName">{{organizationName}}</span>
                    <span class = "verified">{{verified | filterVerified}}</span>
                </div>
            </div>
            <button class = "edit" @click.stop.prevent = "editOrg">编辑商户</button>
        </div>
        <div class = "user-detail">
            <span class = "detail-title">公司简介:</span>
            <span>{{organization_desc}}</span>
        </div>
        <div class = "user-detail">
            <span class = "detail-title">所属上级:</span>
            <span>{{upperName}}</span>
        </div>
        <div class = "user-detail">
            <span class = "detail-title">公司证照号:</span>
            <span>{{organization_num}}</span>
        </div>
        <div class = "user-detail">
            <div class = "detail-title">公司证照:</div>
            <div class = "photo" :style = "{backgroundImage: 'url(' + organization_license_up + ')'}"></div>
        </div>
        <div class = "user-detail">
            <span class = "detail-title">法人:</span>
            <span>{{corporate_name}}</span>
        </div>
        <div class = "user-detail">
            <span class = "detail-title">法人证件号:</span>
            <span>{{corporate_ident}}</span>
        </div>
        <div class = "user-detail">
            <div class = "detail-title">证件正面照:</div>
            <div class = "photo" :style = "{backgroundImage: 'url(' + corporate_card_up + ')'}"></div>
        </div>
        <div class = "user-detail">
            <div class = "detail-title">证件反面照:</div>
            <div class = "photo" :style = "{backgroundImage: 'url(' + corporate_card_down + ')'}"></div>
        </div>
        <footer>
            <button class = "reject" @click.stop.prevent = "reject">不通过</button>
            <button class = "approve" @click.stop.prevent = "approve">通过</button>
        </footer>
    </div>
</template>
<script>
import {
  getOrgDetail
  } from '@/api/login.js';
import baseConfig from '@/config/index';
export default {
    name : 'OrgDetail',
    data() {
        return {
            organization_desc : '',
            organizationName : '',
            verified : -1,
            logo: '',
            organization_num : '',
            ident_down : '',
            organization_license_up : '',
            corporate_name : '',
            corporate_ident : '',
            corporate_card_down : '',
            corporate_card_up : ''
        }
    },
    filters: {
        filterVerified : verified => {
            if(verified == -1) {
                return '审核中'
            }
            else {
                return '有异常'
            }
        }
    },
    methods : {
        orgDetailback() {
            this.$router.push({
                name : 'CheckList',
                params : {
                    // 'user_id' : this.$route.params.id_user
                    who : 'notUser'
                }
            })
        },
        approve() {},
        reject() {},
        backToCheckList() {
            this.$router.back();
        },
        editOrg() {
            console.log("editOrg");
            this.$router.push({
                name : 'CreateMerchant',
                params : {
                    'fromUpperEdit' : true,
                    'typeChosen' : 'join',
                    'organization_id' : this.$route.params.organization_id
                }
            })
        }
    },
    created() {
        console.table("this.$route.params:");
        console.table(this.$route.params);
        this.$LoadingBar.start();
        this.upperName = localStorage.getItem('corporate_name') != null ? localStorage.getItem('corporate_name') : '暂无上级名称'
        getOrgDetail(baseConfig.baseUrl.devHost + '/trinity-backstage/organization/detail',
                {
                    'priority': 5,
                    'id_organization'   : this.$route.params.organization_id,
                    'data' :  {
                        'organization_id' : this.$route.params.organization_id
                    }
                }
        )
        .then(res => {
            console.log('getUserDetail_res:')
            console.log(res);
            if(res.status && res.status == 200 && res.data.success && res.data.code == 0) {
                this.$LoadingBar.finish();
                let data = res.data.data.organization_mini
                console.log("data:")
                console.log(data)
                this.organizationName = data.organizationName ? data.organizationName : '暂未设置姓名';
                this.verified = data.verified ? data.verified : -1;
                this.organization_desc = data.organization_desc ? data.organization_desc : '暂无';
                this.organization_num = data.organization_num ? data.organization_num : '暂无';
                this.corporate_name = data.corporate_name ? data.corporate_name : '暂无';
                this.corporate_ident = data.corporate_ident ? data.corporate_ident : '暂无';
                let prefixUrl = ''
                if(process.env.NODE_ENV == 'development') {
                    prefixUrl = 'http://trinity-local.oss-cn-huhehaote.aliyuncs.com'
                }else {
                    prefixUrl = 'http://trinity-product.oss-cn-huhehaote.aliyuncs.com'
                }
                this.logo = data.logo && data.logo.length > 0 ? prefixUrl + data.logo : require('./../../../assets/images/ShunXiangLogo.png');
                this.organization_license_up = data.organization_license_up ? prefixUrl + data.organization_license_up : '';
                this.corporate_card_up = data.corporate_card_up ? prefixUrl + data.corporate_card_up : '';
                this.corporate_card_down = data.corporate_card_down ? prefixUrl + data.corporate_card_down : '';

            }
            else {
                this.$LoadingBar.error();
                this.$Message.error({
                    content : res.data.msg ? res.data.msg : '网络异常，请联系管理员及时处理',
                    duration: 5,
                    closable: true
                })
            }
        })
        .catch(err => {
            console.log(err)
            this.$LoadingBar.error();
            this.$Message.error({
                content : '网络异常，请联系管理员及时处理',
                duration: 5,
                closable: true
            })
        })
    }
}
</script>
<style lang="scss" scoped>
.org-detail-box{
    width : 100%;
    height : 100%;
    overflow: hidden;
    overflow-y: auto;
    user-select: none;
    padding: 1% 1% 300px 1%;
    header {
        display: flex;
        flex-direction: row;
        height: 24px;
        display: flex;
        justify-content: left;
        align-items: center;
        .title {
            display: flex;
            flex-direction: row;
            height : 24px;
            .title-word {
                height: 100%;
                font-size: 18px;
                color: #4A4A4A;
                font-weight: bold;
                margin-left : 10px;
                height: 24px;
                line-height: 24px;
                max-width: 300px;
                text-align: left;
            }
            .line{
                width : 4px;
                height: 24px;
                background : linear-gradient(180deg,rgba(67,170,246,1) 0%,rgba(63,128,247,1) 100%);
            }
        }
        .back-con{
            width : 90px;
            height: 22px;
            background-size    : 100% 100%;
            background-position: center;
            background-image: url('./../../../assets/images/UserDetail/back_bg.png');
            @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                background-image: url('./../../../assets/images/UserDetail/back_bg@2x.png');
            };
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            margin-left : 10px;
            cursor: pointer;
            .back-icon {
                width : 15px;
                height: 15px;
                background-size    : 100% 100%;
                background-position: center;
                background-image: url('./../../../assets/images/UserDetail/backToCheckList.png');
                @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                    background-image: url('./../../../assets/images/UserDetail/backToCheckList@2x.png');
                };
            }
            .back{
                margin-left : 5px;
                width : 50px;
                height: 15px;
                background-size    : 100% 100%;
                background-position: center;
                background-image: url('./../../../assets/images/UserDetail/backWord.png');
                @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                    background-image: url('./../../../assets/images/UserDetail/backWord@2x.png');
                };
            }
        }
    }
    .up {
        display: flex;
        flex-direction: row;
        height: 140px;
        width : 100%;
        justify-content: space-between;
        align-items: center;
        .edit {
            cursor: pointer;
            color : #48A8DA;
            font-size: 14px;
            outline: none;
            border:none;
            background: none;
            margin-right : 40px;
        }
        .left {
            height: 98px;
            display: flex;
            flex-direction: row;
            .avatar {
                width : 98px;
                height: 98px;
                border-radius : 50%;
                background-size    : 100% 100%;
                background-position: center;
                // background-image: url('./../../../assets/images/user/userDefaultAvatar.png');
                // @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                //     background-image: url('./../../../assets/images/user/userDefaultAvatar@2x.png');
                // };
            }
            .right-con {
                margin: 30px 0 0 8px;
                height : 24px;
                line-height: 24px;
                .organizationName {
                    color : 000;
                    font-size: 24px;
                    font-weight: bold;
                }
                .verified {
                    color: #48A8DA;
                    font-size : 16px;
                }
            }
        }
        border-bottom : 1px dashed #DEDEDE;
    }
    .user-detail {
        color : #4A4A4A;
        font-size: 14px;
        display: flex;
        flex-direction: row;
        justify-content: left;
        align-items: flex-start;
        margin : 20px 0;
        .detail-title {
            margin-right : 4px;
            display: inline-block;
            width : 200px;
            text-align: right;
        }
        .photo {
            width : 30vw;
            height: 20vh;
            background-size    : 100% 100%;
            background-position: center;
            // background-image: url('./../../../assets/images/UserDetail/backWord.png');
            // @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
            //     background-image: url('./../../../assets/images/UserDetail/backWord@2x.png');
            // };
        }
    }
    footer {
        text-align: left;
        button {
            background: none;
            width : 160px;
            box-sizing: content-box;
            height: 36px;
            line-height: 36px;
            font-size : 16px;
            outline: none;
            border-radius:4px;
            cursor: pointer;
            margin-left: 30px;
        }
        .reject{
            color: #4A4A4A;
            border : 1px solid #DEDEDE;
        }
        .approve{
            color: #fff;
            background:rgba(72,168,218,1);
            border : 1px solid rgba(72,168,218,1);
        }
    }
}
</style>


