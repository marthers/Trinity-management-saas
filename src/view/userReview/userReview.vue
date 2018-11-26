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
                              <span>{{corpObj.organizationName}}</span>
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
                    <span class = "content corporate_card_up" :style = "{backgroundImage : 'url(' + userObj.ident_up + ')'}"></span>
                  </p>
                  <p>
                    <span class = "title">身份证反面:</span>
                    <span class = "content corporate_card_up" :style = "{backgroundImage : 'url(' + userObj.ident_down + ')'}"></span>
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
              <div class = "right edit">编辑运营商</div>
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
              <div class = "person" @click.stop.prevent = "toCheckList('user')">
                  <div class = "icon">
                    <div class = "num">
                        {{
                          user_list_num | filterCount
                        }}
                    </div>
                  </div>
                  <p class = "word">
                    <span>有</span>
                    <span class = "number">{{user_list_num}}</span>
                    <span>人申请加入组织</span>
                  </p>
              </div>
              <div class = "merchant person" @click.stop.prevent = "toCheckList('merchant')">
                  <div class = "icon">
                    <div class = "num">
                        {{
                          organization_list_num | filterCount
                        }}
                    </div>
                  </div>
                  <p class = "word">
                    <span>有</span>
                    <span class = "number">{{organization_list_num}}</span>
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
      myOrgShow : false,
      joinInshow : false,
      auditShow : true,
      corpName : '',
      organization_list_num : 4,
      user_list_num :5,
      corpObj : {
      },
      userObj : {}
    }
  },
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
          }else {
              return count
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
    toCheckList(who) {
      console.log(who)
    },
    createdReq : async  () => {
        let prefixUrl = ''
        if(process.env.NODE_ENV == 'development') {
            prefixUrl = 'http://trinity-local.oss-cn-huhehaote.aliyuncs.com'
        }else {
            prefixUrl = 'http://trinity-product.oss-cn-huhehaote.aliyuncs.com'
        }
        let getUserDetailRes = await getUserDetail(baseConfig.baseUrl.devHost + '/trinity-backstage/user/detail',
            {
                'priority': 5,
                'id_organization'   : 0,
                'data' : {
                'user_id' : localStorage.getItem('id_user')
                }
            }
        );
        if(getUserDetailRes.status && getUserDetailRes.status == 200 && getUserDetailRes.data.code == 0 && getUserDetailRes.data.data) {
                let data = getUserDetailRes.data.data;
                data.ident_down = prefixUrl + data.ident_down
                data.ident_up = prefixUrl + data.ident_up
                this.userObj = data;
                localStorage.setItem('user_verified',data.verified);
                localStorage.setItem('fid_organization',data.fid_organization);
                let getOrgDetailRes = await  getOrgDetail(baseConfig.baseUrl.devHost + '/trinity-backstage/organization/detail',
                    {
                        'priority': 5,
                        'id_organization'   : 0,
                        'data' : {
                        'organization_id' : localStorage.getItem('fid_organization')
                        }
                    }
                );
                if(getOrgDetailRes.status && getOrgDetailRes.status == 200 && getOrgDetailRes.data.code == 0 && getOrgDetailRes.data.data.organization_mini) {
                    let data = getOrgDetailRes.data.data.organization_mini;
                    // console.log(data);
                    // console.log(getUserDetailRes.data)
                    data.corporate_card_up = prefixUrl + data.corporate_card_up;
                    // this.corpObj = data;
                    let self = this
                    // self.$set(this.corpObj,'logo',prefixUrl + self.corpObj)
                    this.logo = prefixUrl + this.corpObj.logo;
                    this.corpObj = Object.assign({},this.corpObj);
                    console.log(this.corpObj)
                    // debugger
                    localStorage.setItem('org_verified',data.verified);
                    let ov = getOrgDetailRes.data.data.organization_mini.verified,
                    uv = getUserDetailRes.data.data.verified;
                    if(ov == 1 && uv == 1) {
                        this.underReviewShow = false;
                        this.myOrgShow = true;
                        this.organization_list_num = getOrgDetailRes.data.data.organization_list_num
                        this.user_list_num = getOrgDetailRes.data.data.user_list_num
                        // this.organization_list_num = 2
                        // this.user_list_num = 20
                        this.auditShow = false;
                        this.auditShow = true
                        console.log("getOrgDetailRes.data:")
                        console.log(getOrgDetailRes.data)
                        console.log(`this.user_list_num=${this.user_list_num}`)
                        console.log(`this.organization_list_num=${this.organization_list_num}`)
                    }
                    else{
                        this.underReviewShow = true;
                        this.myOrgShow = false;
                        this.auditShow = false
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
                else {
                        this.$Message.error({
                            content : '网络错误',
                            duration: 5,
                            closable: true
                        });
                }
        }
        else {
                this.$Message.error({
                    content : '网络错误',
                    duration: 5,
                    closable: true
                });
        }
    }
  },
  created() {
        try {
            this.createdReq();
            console.log(`this.underReviewShow=${this.underReviewShow}`)
        }
        catch(err) {
            console.log(err);
            this.$Message.error({
                content : err && err.msg ? err.msg: '网络错误',
                duration: 5,
                closable: true
            });
        }
  },
  mounted() {
    console.log('this.$route.params:')
    console.log(this.$route.params)
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
  user-select: none;
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
    padding : 10% 5%;
    max-height: 94vh;
    margin: 0 auto;
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
          // cursor: pointer;
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


