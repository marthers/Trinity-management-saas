<template>
  <div class= "user-review">
      <div class = "under-review-con" v-if = "underReviewShow">
          <p class = "under-review-word" v-if = "joinInshow">商户加盟审核中，请耐心等待</p>
          <p class = "under-review-word" v-else>员工加入审核中，请耐心等待</p>
          <button class = "cancel" @click.stop.prevent = "cancel">撤销</button>
      </div>
      <div v-else class = "merchant-info-con">
          <div class = "merchant-con">
            <div class= "up">
              <div class = "left">
                  <div  alt="" class = "logo left" v-bind:style = "{backgroundImage :'url(' + corpObj.logo + ')'}"></div>
                  <div class = "right">
                      <p class = "corp-name">
                          {{
                            corpName
                          }}
                      </p>
                      <p>
                          <span>公司证照号</span>
                          <span>{{corpObj.corporate_ident}}</span>
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
                          userCount
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
                          merchantCount
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
      underReviewShow : false,
      joinInshow : false,
      auditShow : true,
      // legal : '马云',
      // legalId: 0,
      // logo : 'https://u.djicdn.com/uploads/ad_image_file/file/1234/970_250.jpg',
      // corpObj.ident_up : 0,
      corpName : '很多客户等级撒低级',
      merchantCount : 112,
      userCount : 8,
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
              Promise.all(
                [
                  getOrgDetail(baseConfig.baseUrl.localOrgHost + '/trinity-backstage/organization/detail'),
                  getUserDetail(baseConfig.baseUrl.localOrgHost + '/trinity-backstage/user/detail')
                ]
              )
              .then((result) => {
                console.log(result);
                if(result && result.length == 2) {
                  localStorage.setItem('fid_organization',result[1].data.data.fid_organization);
                  localStorage.setItem('user_verified',result[1].data.data.verified)
                  localStorage.setItem('org_verified',result[0].data.data.verified)
                  if(result[0].data.data.verified == 1 && result[1].data.data.verified == 1) {
                    //跳转到商户信息
                      this.$Notice.success({
                          title: '跳转到商户信息',
                          desc: '跳转到商户信息'
                      });
                  }
                  else {
                    if(result[0].data.data.verified == 1) {
                      // 员工加入审核中
                      this.$Notice.info({
                          title: '员工加入审核中',
                          desc: '员工加入审核中'
                      });
                    }
                    else {
                      //商户加盟审核中
                      this.$Notice.info({
                          title: '商户加盟审核中',
                          desc: '商户加盟审核中'
                      });
                    }
                  }
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
          }
          else if(res.data.code == 0) {
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
    if(ov == 1 && uv == 1) {
      this.underReviewShow = false;
              Promise.all(
                [
                  getOrgDetail(baseConfig.baseUrl.localOrgHost + '/trinity-backstage/organization/detail'),
                  getUserDetail(baseConfig.baseUrl.localOrgHost + '/trinity-backstage/user/detail')
                ]
              )
              .then((result) => {
                console.log(result);
                if(result && result.length == 2) {
                  localStorage.setItem('fid_organization',result[1].data.data.fid_organization);
                  localStorage.setItem('user_verified',result[1].data.data.verified)
                  localStorage.setItem('org_verified',result[0].data.data.verified)
                  this.corpObj = result[0].data.data;
                  this.userObj = result[1].data.data;
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

              ApplyJoinOrganization(jiweiDevHost + '/trinity-backstage/organization/apply_join_organization')
              .then(res => {
                console.log(res);
                if(res.status && res.status == 200 && res.data.code == 0) {
                  let data = res.data.data;
                  console.log("ApplyJoinOrganization:");
                  console.log(data);
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
        this.joinInshow = false
      }
      else {
        this.joinInshow = true
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
    color : #fff;
    font-size : 16px;
  }
  .under-review-con {
      height : 30vh;
      background-size : contain;
      background-position : center;
      background-image: url('./../../assets/images/noData/surveyBg.png');
      @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
          background-image: url('./../../assets/images/noData/surveyBg@2x.png');
      }
      display : flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .under-review-word {
        margin : 20px;
      }
    .cancel {
      outline: none;
      width : 100px;
      height : 30px;
      line-height: 30px;
      text-align: center;
      border-radius : 5px;
      // font-size : 14px;
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
            background-size: contain;
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
          background-size: contain;
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
          background-size: contain;
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


