<template>
  <div class= "user-review">
    <!-- 审核中 -->
      <div class = "under-review-con" v-if = "underReviewShow">
          <div class = "under-review-word" v-if = "joinInshow">
              <!-- 商户加盟审核中，请耐心等待 -->
              <div class = "header">
                  <div class = "left" v-if = "corpShow">
                      <div class = "logo"  v-bind:style = "{backgroundImage :'url(' + corpObj.logo + ')'}"></div>
                      <div class= "right-corp">
                          <p class = "corp">
                              <span>{{corpObj.organization_name}}</span>
                              <span class = "state">审核中</span>
                          </p>
                          <p>
                              <span>公司证照号</span>
                              <span>{{corpObj.corporate_ident}}</span>
                          </p>
                      </div>
                  </div>
                  <div class = "left" v-else>
                      <div class = "logo"  v-if = "!userObj.avator || userObj.avator.length == 0" v-bind:style = "{backgroundImage :'url(' + userObj.ident_up + ')'}"></div>
                      <div class = "logo"  v-if = "userObj.avator && userObj.avator.length > 0" v-bind:style = "{backgroundImage :'url(' + userObj.avator + ')'}"></div>
                      <div class= "right-corp">
                          <p class = "corp">
                              <span>{{userObj.ident_name}}</span>
                              <span class = "state">审核中</span>
                          </p>
                          <p>
                              <span>身份证号：</span>
                              <span>{{userObj.ident_num | filterId}}</span>
                          </p>
                      </div>
                  </div>
                  <div class = "right"></div>
              </div>
              <div class = "body">
                <div class = "con" v-if = "corpShow">
                  <p>
                    <span class = "title">公司简介:</span>
                    <span class = "content des">{{corpObj.organization_desc}}</span>
                  </p>
                  <p>
                    <span class = "title">法人:</span>
                    <span class = "content">{{corpObj.corporate_name}}</span>
                  </p>
                  <p>
                    <span class = "title">法人证件号:</span>
                    <span class = "content">{{corpObj.corporate_ident}}</span>
                  </p>
                  <p>
                    <span class = "title">公司营业执照:</span>
                    <span class = "content corporate_card_up" :style = "{backgroundImage : 'url(' + corpObj.corporate_card_up + ')'}"></span>
                  </p>
                </div>
                <div class = "con" v-else>
                  <p>
                    <span class = "title">用户账号:</span>
                    <span class = "content des">{{userObj.phone}}</span>
                  </p>
                  <p>
                    <span class = "title">申请加入的组织是:</span>
                    <span class = "content">{{corpObj.organization_name}}</span>
                  </p>
                  <!-- <p>
                    <span class = "title">法人证件号:</span>
                    <span class = "content">{{userObj.corporate_ident}}</span>
                  </p> -->
                  <p>
                    <span class = "title">身份证正面:</span>
                    <span class = "content corporate_card_up" :style = "{backgroundImage : 'url(' + userObj.ident_down + ')'}"></span>
                  </p>
                  <p>
                    <span class = "title">身份证反面:</span>
                    <span class = "content corporate_card_up" :style = "{backgroundImage : 'url(' + userObj.ident_up + ')'}"></span>
                  </p>
                </div>
              </div>
              <!-- <div class = "footer"></div> -->
              <button class = "cancel" @click.stop.prevent = "cancel">撤销</button>
          </div>
          <!-- <div class = "under-review-word" v-else>员工加入审核中，请耐心等待</div> -->
          <!-- <button class = "cancel" @click.stop.prevent = "cancel">撤销</button> -->
      </div>
    <!-- 我的组织 -->
      <div v-else class = "merchant-info-con">
          <div class = "merchant-con">
            <div class= "up">
              <div class = "left">
                  <div  alt="" class = "logo left" v-bind:style = "{backgroundImage :'url(' + corpObj.logo + ')'}"></div>
                  <!-- <div  alt="" class = "logo left" v-bind:style = "{backgroundImage :'@/assets/images/myOrg/merchants.png'}" v-else></div> -->
                  <div class = "right">
                      <p class = "corp-name">
                          {{
                            corpObj.organization_name
                          }}
                      </p>
                      <p>
                          <span>公司证照号</span>
                          <span>{{corpObj.organization_num}}</span>
                      </p>
                  </div>
              </div>
              <div class = "right">编辑运营商</div>
            </div>
            <div class = "down">
              <p>
                  <span>法律负责人</span>
                  <span>{{corpObj.corporate_name}}</span>
              </p>
              <p>
                  <span>法人证件号</span>
                  <span>{{corpObj.corporate_ident}}</span>
              </p>
            </div>
          </div>
          <div v-if = "auditShow" class = "audit-con">
              <div class = "person" @click.stop.prevent = "audit('user')">
                  <div class = "icon">
                    <div class = "num">
                        {{
                          userCount | filterCount
                        }}
                    </div>
                  </div>
                  <p class = "word">
                    <span>有</span>
                    <span class = "number">{{userCount}}</span>
                    <span>人申请加入组织</span>
                  </p>
              </div>
              <div class = "merchant person" @click.stop.prevent = "audit('merchant')">
                  <div class = "icon">
                    <div class = "num">
                        {{
                          merchantCount | filterCount
                        }}
                    </div>
                  </div>
                  <p class = "word">
                    <span>有</span>
                    <span class = "number">{{merchantCount}}</span>
                    <span>个商户申请加入组织</span>
                  </p>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import {undo_user_organization} from '@/api/org/org.js';
import baseConfig from '@/config/index';
import {
  ApplyJoinOrganization,//申请加入组织的用户个数接口
} from '@/api/user.js';
const jiweiDevHost = baseConfig.baseUrl.jiweiDevHost;
import {
  getOrgDetail,
  getUserDetail
  } from '@/api/login.js';
export default {
  name : 'userReview',
  data() {
    return {
      corpShow : false,
      underReviewShow : false,
      joinInshow : false,
      auditShow : true,
      // legal : '马云',
      // legalId: 0,
      // logo : 'https://u.djicdn.com/uploads/ad_image_file/file/1234/970_250.jpg',
      // corpObj.ident_up : 0,
      corpName : '',
      merchantCount : '',
      userCount :'',
      corpObj : {},
      userObj : {}
    }
  },
  // props : {
  //   underReviewShow : {
  //     type : Boolean,
  //     default : true
  //   },
  //   joinInshow : {
  //     type : Boolean,
  //     default : true
  //   }
  // },
  filters : {
    // 过滤身份证号
      filterId : id => {
        if(!id || id.length == 0){
          return '暂无';
        }
        else {
          return  id.replace(/(\d{3})\d{10}(\d{4})/,'$1**********$2')
        }
      },
      // 过滤加入的数量
      filterCount : count => {
        if(!count) {
          return '0'
        }
        else {
          if(count > 10) {
            return 9 + '+'
          }
        }
      }
  },
  methods : {
    cancel() {
      let url = jiweiDevHost + '/trinity-backstage/organization/undo_user_application'
      undo_user_organization(url)
      .then(res => {
        console.log('undo_user_organization_res：')
        console.log(res)
        if(res.status && res.status == 200) {
          // debugger
          if(res.data.code == 201) {
          }
          else if(res.data.code == 0) {
            // debugger
              Promise.all(
                [
                  // getOrgDetail(baseConfig.baseUrl.localOrgHost + '/trinity-backstage/organization/detail'),
                  getUserDetail(baseConfig.baseUrl.localOrgHost + '/trinity-backstage/user/detail')
                ]
              )
              .then((result) => {
                console.log(result);
                if(result && result.length == 1) {
                  localStorage.setItem('fid_organization',result[0].data.data.fid_organization);
                  localStorage.setItem('user_verified',result[0].data.data.verified)
                  // localStorage.setItem('org_verified',result[0].data.data.verified)
                  // if(result[0].data.data.verified == 1 && result[1].data.data.verified == 1) {
                  //   //跳转到商户信息
                  //     this.$Notice.success({
                  //         title: '跳转到商户信息',
                  //         desc: '跳转到商户信息'
                  //     });
                  // }
                  // else {
                  //   if(result[0].data.data.verified == 1) {
                  //     // 员工加入审核中
                  //     this.$Notice.info({
                  //         title: '员工加入审核中',
                  //         desc: '员工加入审核中'
                  //     });
                  //   }
                  //   else {
                  //     //商户加盟审核中
                  //     this.$Notice.info({
                  //         title: '商户加盟审核中',
                  //         desc: '商户加盟审核中'
                  //     });
                  //   }
                  // }
                }
              })
              .catch((err) => {
                console.log(err)
                this.$Message.error({
                    content : err.msg ? err.msg: '网络错误',
                    duration: 5,
                    closable: true
                });
              })
              this.$Notice.success({
                  title: '撤销成功',
                  desc: '请重新加盟或者加入'
              });
              this.$router.push({
                name : 'home',
                params : {
                  NoDataIndexShow : true
                }
              })
          }
        }
        else {
          // debugger
            this.$Message.error({
                content : '网络异常，请联系管理员及时处理',
                duration: 5,
                closable: true
            })
        }
      }).catch(err => {
        console.log(err);
        this.$Message.error({
            content : err && err.msg ? err.msg :'网络异常，请联系管理员及时处理',
            duration: 5,
            closable: true
        })
      })
    console.log(`process.env.NODE_ENV=${process.env.NODE_ENV}`);
      console.log(`jiweiDevHost=${jiweiDevHost + '/trinity-backstage/organization/undo_user_organization'}`)
    },
    audit(who) {
      console.log(who)
    }
  },
  created() {
    let ov = localStorage.getItem('org_verified'),
    uv = localStorage.getItem("user_verified");
              Promise.all(
                [
                  getOrgDetail(baseConfig.baseUrl.localOrgHost + '/trinity-backstage/organization/detail'),
                  getUserDetail(baseConfig.baseUrl.localOrgHost + '/trinity-backstage/user/detail')
                ]
              )
              .then((result) => {
                console.log(result);
                if(result && result.length == 2) {
                  // localStorage.setItem('fid_organization',result[1].data.data.fid_organization);
                  // localStorage.setItem('user_verified',result[1].data.data.verified)
                  // localStorage.setItem('org_verified',result[0].data.data.verified)
                  if(result[1].data.data.verified) {
                    localStorage.setItem('user_verified',result[1].data.data.verified)
                  }
                  if(result[0].data.code == 0 && result[0].data.data.verified) {
                    localStorage.setItem('user_verified',result[0].data.data.verified)
                  }
                  if(result[1].data.data.fid_organization) {
                    localStorage.setItem('fid_organization',result[1].data.data.fid_organization)
                  }
                  this.corpObj = result[0].data.data.organization_mini;
                  this.userObj = result[1].data.data;
                  let prefixUrl = ''
                  if(process.env.NODE_ENV == 'development') {
                      prefixUrl = 'http://trinity-local.oss-cn-huhehaote.aliyuncs.com'
                  }else {
                      prefixUrl = 'http://trinity-product.oss-cn-huhehaote.aliyuncs.com'
                  }
                  this.corpObj.logo = prefixUrl + this.corpObj.logo;
                  this.userObj.logo = prefixUrl + this.userObj.logo;
                  this.userObj.ident_down = prefixUrl + this.userObj.ident_down
                  this.userObj.ident_up = prefixUrl + this.userObj.ident_up
                  this.corpObj.corporate_card_up = prefixUrl + this.corpObj.corporate_card_up
                  console.log("this.corpObj:")
                  console.log(this.corpObj)
                  console.log(this.userObj)
                }
              })
              .catch((err) => {
                console.log(err)
                this.$Message.error({
                    content : err.msg ? err.msg: '网络错误',
                    duration: 5,
                    closable: true
                });
              });
    if(ov == 1 && uv == 1) {
      this.underReviewShow = false;

              ApplyJoinOrganization(jiweiDevHost + '/trinity-backstage/organization/apply_join_organization')
              .then(res => {
                console.log(res);
                if(res.status && res.status == 200 && res.data.code == 0) {
                  let data = res.data.data;
                  console.log("ApplyJoinOrganization:");
                  console.log(data);
                  this.userCount = data.user_list.length
                  // this.merchantCount = data.organization_list.length
                  this.merchantCount = 333
                }
                else {
                  this.$Message.error({
                      content : res && res.msg ? res.msg: '网络错误',
                      duration: 5,
                      closable: true
                  });
                }
              })
              .catch(err => {
                console.log(err);
                this.$Message.error({
                    content : err && err.msg ? err.msg: '网络错误',
                    duration: 5,
                    closable: true
                });
              })
    }
    else{
      this.underReviewShow = true;
      if(ov == 1) {
        this.joinInshow = true
        this.corpShow = false
      }
      else {
        this.joinInshow = true
        this.corpShow = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.user-review {
  width : 100%;
  height : 100%;
  box-sizing: border-box;
  margin : 0;
  padding : 0;
  .under-review-con,.merchant-info-con {
    width : 100%;
    margin : 0 auto;
    color : #4A4A4A;
    font-size : 16px;
  }
  .under-review-con {
      height : 100%;
      width: 100%;
      background-color: #fff;
      // background-size : contain;
      // background-position : center;
      // background-image: url('./../../assets/images/noData/surveyBg.png');
      // @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
      //     background-image: url('./../../assets/images/noData/surveyBg@2x.png');
      // }
      display : flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding : 2%;
      .under-review-word {
        width : 96%;
        height: 100%;
        overflow : auto;
        // background-color: pink;
        box-sizing: border-box;
        text-align: left;
        .header {
          width : 100%;
          height: 140px;
          padding-bottom : 50px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px dashed #DEDEDE;
          .right {
            width : 120px;
            height: 72px;
            background-size: 100% 100%;
            background-position: center;
            background-image: url('./../../assets/images/myOrg/under_review.png');
            @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                background-image: url('./../../assets/images/myOrg/under_review@2x.png');
            }
          }
          .left {
            display: flex;
            flex-direction: row;
            justify-content: left;
            align-items: center;
            // border-bottom: 2px dashed #DEDEDE;
            .logo {
                width : 98px;
                height: 98px;
                background-size: 100% 100%;
                background-position: center;
            }
            .right-corp {
              margin-left: 20px;
              height: 98px;
              line-height: 98px;
              p {
                height: 49px;
                line-height: 49px;
                color : #4A4A4A;
                font-size : 14px;
                text-align: left;
              }
              .corp {
                font-size : 24px;
                color : #000;
                font-weight: bold;
                .state {
                  color : #48A8DA;
                  font-size : 16px;
                  font-weight: normal;
                }
              }
            }
          }
        }
        .body {
          font-size : 14px;
          color : #000;
          p{
            // height: 20px;
            margin : 3vh 0;
            span {
              display: inline-block;
              height: 100%;
              font-size : 14px;
              vertical-align: text-top;
            }
            .content {
              margin-left : 2%;
            }
            .title {
              width : 20%;
              text-align: right;
            }
            .corporate_card_up {
              width : 50%;
              height: 20vh;
              background-size: 100% 100%;
              background-position: center;
            }
            .des {
              max-width: 70%;
              height: auto;
              // overflow: hidden;
              // white-space: nowrap;
              // text-overflow: ellipsis;
            }
          }
        }
      }
    .cancel {
      font-size:18px;
      font-weight: bold;
      color : #fff;
      outline: none;
      width : 160px;
      height : 36px;
      line-height: 30px;
      text-align: center;
      border-radius : 4px;
      margin-top : 40px;
      // margin-bottom : 200px;
      letter-spacing: 2px;
      border: 1px solid transparent;  //自定义边框
      background:linear-gradient(180deg,rgba(59,165,178,1) 0%,rgba(72,168,218,1) 100%);
      cursor: pointer;
    }
    .cancel:link {
      background:  rgba(59,165,178,1) ;
      color : #fff;
    }
    .cancel:visited {
      background:  rgba(59,165,178,1) ;
      color : #fff;
    }
    .cancel:hover {
      background:  #48A8DA ;
      // color : #fff;
    }
    .cancel:active {
      background:  #4291BA ;
      color : #fff;
    }
  }
  .merchant-info-con {
    width : 90%;
    margin : 10% 5%;
    .merchant-con {
      width : 100%;
      height : 272px;
      padding : 20px 0;
      border-radius:8px;
      border:1px solid #DEDEDE;
      color : #4A4A4A;
      .up,.down {
        width : 92%;
        margin : 0 4%;
        text-align: left;
      }
      .up {
        height : 60%;
        border-bottom : 2px dashed #DEDEDE;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: top;
        .left {
          display: flex;
          justify-content: center;
          align-items: center;
          height : 98px;
          flex-direction: row;
          .logo {
            width : 98px;
            height: 98px;
            background-size: 100% 100%;
            background-position: center;
          }
          .right {
            font-size : 16px;
            color : #4A4A4A;
            p {
              margin : 8px;
            }
            .corp-name {
              font-size : 18px;
              color : #000;
              font-weight : bold;
            }
          }
        }
        .right {
          color : #48A8DA;
          font-size: 16px;
          cursor: pointer;
        }
      }
      .down {
        height: 40%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: left;
        p:first-of-type {
          margin-bottom: 8px;
        }
      }
    }
    .audit-con {
      width : 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin: 20px 0;
      align-items: center;
      .person {
        width : 48%;
        height : 98px;
        border : 1px solid #DEDEDE;
        border-radius : 12px;
        display: flex;
        flex-direction: row;
        justify-content: left;
        align-items: center;
        padding-left : 20px;
        cursor: pointer;
        .icon {
          width : 60px;
          height : 60px;
          background-size: 100% 100%;
          background-position: center;
          background-image: url('./../../assets/images/myOrg/person.png');
          @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
              background-image: url('./../../assets/images/myOrg/person@2x.png');
          }
          position: relative;
          .num {
            position: absolute;
            right: -8px;
            top : -10px;
            width : 16px;
            height: 16px;
            color : #fff;
            background-color: red;
            border-radius : 50%;
            font-size : 14px;
            overflow: hidden;
            line-height: 16px;
            text-align: center;
          }
        }
        .word {
          // width:160px;
          max-width : 300px;
          height:28px;
          font-size:16px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color: #505050;
          line-height:28px;
          margin-left : 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          .number {
            color : #48A8DA;
          }
        }
      }
      .merchant {
        width : 48%;
        height : 98px;
        border : 1px solid #DEDEDE;
        border-radius : 12px;
        display: flex;
        flex-direction: row;
        justify-content: left;
        align-items: center;
        .icon {
          width : 60px;
          height : 60px;
          background-size: 100% 100%;
          background-position: center;
          background-image: url('./../../assets/images/myOrg/merchants.png');
          @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
              background-image: url('./../../assets/images/myOrg/merchants@2x.png');
          }
        }
      }
    }
  }
}
</style>


