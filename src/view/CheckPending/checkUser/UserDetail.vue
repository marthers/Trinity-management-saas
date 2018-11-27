<template>
    <div class = "user-detail-box">
        <header>
            <div class = "title">
                <div class= "line"></div>
                <div class= "title-word">待审核员工</div>
            </div>
            <div class= "back-con" @click.stop.prevent = "$router.back()">
                <div class = "back-icon"></div>
                <div class = "back"></div>
            </div>
        </header>
        <div class = "up">
            <div class = "left">
                <div class = "avatar" :style = "{backgroundImage: 'url(' + avatar + ')'}"></div>
                <!-- <div class = "avatar"></div> -->
                <div class = "right-con">
                    <span class = "name">{{name}}</span>
                    <span class = "verified">{{verified | filterVerified}}</span>
                </div>
            </div>
            <button class = "edit" @click.stop.prevent = "editUser">编辑员工</button>
        </div>
        <div class = "user-detail">
            <span class = "detail-title">员工账号:</span>
            <span>{{phone}}</span>
        </div>
        <div class = "user-detail">
            <span class = "detail-title">身份证号:</span>
            <span>{{phone}}</span>
        </div>
        <div class = "user-detail">
            <div class = "detail-title">证件正面照:</div>
            <div class = "photo"></div>
        </div>
        <div class = "user-detail">
            <div class = "detail-title">证件反面照:</div>
            <div class = "photo"></div>
        </div>
        <div class = "user-detail">
            <span class = "detail-title">所属上级:</span>
            <span>{{orgName}}</span>
        </div>
    </div>
</template>
<script>
import {
  getUserDetail
  } from '@/api/login.js';
import baseConfig from '@/config/index';
export default {
    name : 'UserDetail',
    data() {
        return {
            phone : '',
            name : '玛尼玛尼',
            verified : '-1',
            avatar: '',
            orgName : 'hdsakdsajksd'
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
        backToCheckList() {
            this.$router.back();
        },
        editUser() {
            console.log("editUser")
        }
    },
    created() {
        console.table(this.$route.params);
        getUserDetail(baseConfig.baseUrl.devHost + '/trinity-backstage/user/detail',
                {
                    'priority': 5,
                    'id_organization'   : this.$route.params.fid_organization,
                    'data' : {
                        'user_id' : this.$route.params.id_user
                    }
                }
        )
        .then(res => {
            console.log('getUserDetail_res:')
            console.log(res);
            if(res.status && res.status == 200 && res.data.success && res.data.code == 0) {
                let data = res.data.data
                console.log(data)
                // this.frontBase64Data = prefixUrl + data.ident_up;
                // this.versoLegalBase64Data = prefixUrl + data.ident_down;
                // this.legalName = data.ident_name;
                // this.legalID =  data.ident_num;
            }
            else {
            // this.$Message.error({
            //     content : res.data.msg ? res.data.msg : '网络异常，请联系管理员及时处理',
            //     duration: 5,
            //     closable: true
            // })
            }
        })
        .catch(err => {
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
.user-detail-box{
    width : 100%;
    height : 100%;
    user-select: none;
    padding: 1% ;
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
                background-image: url('./../../../assets/images/user/userDefaultAvatar.png');
                @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                    background-image: url('./../../../assets/images/user/userDefaultAvatar@2x.png');
                };
            }
            .right-con {
                margin: 30px 0 0 8px;
                height : 24px;
                line-height: 24px;
                .name {
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
            background-image: url('./../../../assets/images/UserDetail/backWord.png');
            @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                background-image: url('./../../../assets/images/UserDetail/backWord@2x.png');
            };
        }
    }
}
</style>


