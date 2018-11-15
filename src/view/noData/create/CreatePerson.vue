
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
            <!-- <div class = "first" v-if= "!createShow">
                <span v-show = "selectedMerchant.organizationName && selectedMerchant.organizationName.length > 0" class = "chosen-org">
                    您已经选择{{selectedMerchant.organizationName}}。
                </span>
                <span v-show = "!selectedMerchant.organizationName">请选择您要加入的上级商户。</span>
                <span class = "choose" @click = "chooseUpper">点此选择您的上级商户</span>
            </div> -->
            <footer>
                <div class = "back" @click.stop.prevent = "backToIndex">返回</div>
                <div class = "next" @click.stop.prevent = "toMerchant" v-if = "createShow">下一步：商户信息</div>
                <div class = "next"   @click.stop.prevent = "joinOrgNext" v-else>下一步</div>
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
                :title = "joinInOrgTitle"
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
import {joinOrg} from '@/api/org/org.js';
import ImgUpload from '@/components/ImgUpload';
import JoinInOrg from '@/components/JoinInOrg';
import {
    filterStr
} from '@/libs/filter.js';
import {getOrgList} from '@/api/org/org.js';
import baseConfig from '@/config/index';
const baseUrl = baseConfig.baseUrl.localOrgHost;
import {
  getOrgDetail,
  getUserDetail
  } from '@/api/login.js';
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
            joinInOrgTitle : '选择加入商户（平台、大商户、商户所有)'
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
                                      let user_info = {
                                          'ident_name': this.userName,
                                          'ident_num' : this.IDNumber,
                                      }
                                      if(this.frontBase64Data.indexOf('base64') > 0) {
                                        user_info.ident_up = this.frontBase64Data
                                      }
                                      else {
                                          delete user_info.ident_up
                                          console.log(this.frontBase64Data)
                                      }
                                      if(this.versoData.indexOf('base64') > 0) {
                                        user_info.ident_down = this.versoData
                                      }
                                      else {
                                          delete user_info.ident_down
                                      }
                                        UserInfoEdit(baseUrl + '/trinity-backstage/user/edit_info',
                                            {
                                                'priority': 5,
                                                'id_organization'   : 0,
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
                                      if(this.frontBase64Data.indexOf('base64') > 0) {
                                        user_info.ident_up = this.frontBase64Data
                                      }
                                      else {
                                          delete user_info.ident_up
                                      }
                        // user_info.ident_up = this.frontBase64Data.indexOf('base64') > 0 ? this.frontBase64Data : ''
                    }
                    if(this.versoData.length != 0) {
                        // user_info.ident_down = this.versoData.indexOf('base64') > 0 ? this.versoData : ''
                        if(this.versoData.indexOf('base64') > 0) {
                          user_info.ident_down = this.versoData
                        }
                        else {
                            delete user_info.ident_down
                        }
                    };
                    console.log("user_info:");
                    console.log(user_info);


                if(this.frontBase64Data.length > 0 && this.versoData.length > 0) {
                    UserInfoEdit(baseUrl + '/trinity-backstage/user/edit_info',
                        {
                            'priority': 5,
                            'id_organization'   : 0,
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
                                    // for(let item in res.data.user_info) {
                                    //     localStorage.setItem(item,res.data.user_info[item])
                                    // }
                                    if(res.data.user_info.verified) {
                                        localStorage.setItem('user_verified',resData.user_info.verified)
                                    }
                                    if(res.data.user_info.name) {
                                        localStorage.setItem('userPhone',resData.user_info.phone)
                                    }
                                    if(res.data.user_info.phone) {
                                        localStorage.setItem('name',resData.user_info.name)
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
                else {
                    this.$Notice.error({
                        title: '身份证照片缺失',
                        desc : '身份证照片缺失'
                    });
                    return false
                }


                }
            }



            console.log(identifyID(this.IDNumber))
        },
        frontBase64(base64) {
            console.log('frontBase64:')
            console.log(base64);
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
            console.log(base64);
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
                      'id_organization'   : 0,
                      'data'    : {
                          'page_index': 1,
                          'page_size' : 20,
                          // "filters"   : [
                          //     {"key":"idOrganization","operator":"=","value":1,"join":"or"},
                          //     {"key":"parentIdOrganization","operator":"=","value":1,"join":"and"}
                          // ]
                      }
                  }
                )
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
        joinOrgNext() {
          // if(this.selectedMerchant.organizationName && this.selectedMerchant.organizationName.length > 0) {
          // }
          // else {
          //     this.$Message.warning({
          //         content : '请选择上级！',
          //         duration: 5,
          //         closable: true
          //     })
          // }
              if(this.frontBase64Data.length > 0 && this.versoData.length > 0 && this.userName.length > 0 && this.IDNumber > 0) {
                                      let user_info = {
                                          'ident_name': this.userName,
                                          'ident_num' : this.IDNumber,
                                      }
                                      if(this.frontBase64Data.indexOf('base64') > 0) {
                                        user_info.ident_up = this.frontBase64Data
                                      }
                                      else {
                                          delete user_info.ident_up
                                      }
                                      if(this.versoData.indexOf('base64') > 0) {
                                        user_info.ident_down = this.versoData
                                      }
                                      else {
                                          delete user_info.ident_down
                                      }
                  UserInfoEdit(baseUrl + '/trinity-backstage/user/edit_info',
                      {
                          'priority': 5,
                          'id_organization'   : 0,
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
                              }
                              else if(code == 0) {
                                  // this.$emit('createPersonSuccess',res.data.user_info);
                                  this.chooseUpper()
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
                      this.$Message.error({
                          content : '网络异常，请联系管理员及时处理',
                          duration: 5,
                          closable: true
                      })
                  })
                  console.log("this.$emit('person-forward')");

              }
              else {
                  this.$Notice.error({
                      title: '个人数据缺失',
                      desc : '个人数据缺失'
                  });
                  return false
              }
        },
        superiorSelected(selectedSuperior){
            console.log("selectedSuperior:");
            console.log(selectedSuperior);
            if(selectedSuperior.ifPerson && selectedSuperior.ifPerson == 1) {
                joinOrg(
                  baseUrl + '/trinity-backstage/user/join_organization',
                  {
                    'priority': 5,
                    'id_organization'   : 0,
                    'data' : {
                      'user_info' : {
                        'fid_organization' : selectedSuperior.id_organization
                      }
                    }
                  })
                .then(res => {
                  if(res.status == 200 && res.data.code == 0) {



                    Promise.all(
                      [
                        getOrgDetail(baseConfig.baseUrl.localOrgHost + '/trinity-backstage/organization/detail'),
                        getUserDetail(baseConfig.baseUrl.localOrgHost + '/trinity-backstage/user/detail')
                      ]
                    )
                    // getOrgDetail(baseConfig.baseUrl.localOrgHost + '/trinity-backstage/organization/detail')
                    .then((result) => {
                      console.log(result);
                      if(result && result.length == 2) {
                        localStorage.setItem('fid_organization',result[1].data.data.fid_organization);
                        localStorage.setItem('user_verified',result[1].data.data.verified)
                        localStorage.setItem('org_verified',result[0].data.data.verified)
                        // // if(result.status && result.status == 200 && result.data.success) {
                        // //   localStorage.setItem('org_verified',result.data.data.verified);
                        // this.NoDataIndexShow = false
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
                        this.$router.push({
                          name : 'userReview'
                        })
                        // }
                        // let detailResArr = ['org','user']
                        // result.forEach((item,index) => {
                        //     if(item.status && item.status == 200 && item.data.success && item.data.code == 0) {
                        //       // detailResArr.push(item.data.data)
                        //       debugger
                        //       // console.log(item.data.data.verified)
                        //       debugger
                        //       // localStorage.setItem(detailResArr[index] + '_detail_obj' , JSON.stringify(item))
                        //     }
                        //     else {
                        //       this.$Message.error({
                        //           content : '网络错误',
                        //           duration: 5,
                        //           closable: true
                        //       });
                        //     }
                        // });
                        // console.log("detailResArr:")
                        // console.log(detailResArr);
                        // localStorage.setItem('org_detail_obj' , JSON.stringify(detailResArr[0]))
                      }
                    }).catch((err) => {
                      console.log(err)
                      this.$Message.error({
                          content : err.msg ? err.msg: '网络错误',
                          duration: 5,
                          closable: true
                      });
                    })


                  }
                  else{
                    this.$Message.error({
                        content : '网络异常，请联系管理员及时处理',
                        duration: 5,
                        closable: true
                    })
                  }
                    // debugger
                    // console.log(res);
                    // this.$router.push({
                    //   name : 'userReview'
                    // })
                    // debugger
                })
                .catch(err => {
                    console.log(err)
                    this.$Message.error({
                        content : '网络异常，请联系管理员及时处理',
                        duration: 5,
                        closable: true
                    })
                })
            }
            this.selectedMerchant = selectedSuperior;
            this.$emit('selectedSuperior',selectedSuperior)
        },
    },
    created() {
              this.$LoadingBar.start();

                    //getUserDetail
                    getUserDetail(baseConfig.baseUrl.localOrgHost + '/trinity-backstage/user/detail')
                    .then (res => {
                        console.log('getUserDetail_res:')
                        console.log(res);
                        if(res.status && res.status == 200) {
                          if(res.data.success && res.data.code == 0) {
                              if(res.data.data) {
                                let data = res.data.data;
                                console.log(data)
                                //姓名
                                if(data.ident_name && data.ident_name.length > 0) {
                                  this.userNamePlaceholder = data.ident_name;
                                  this.userName = data.ident_name
                                }
                                else {
                                  this.userNamePlaceholder = '请输入真实姓名'
                                  this.userName            = ''
                                }
                                let peffixUrl = ''
                                if(process.env.NODE_ENV == 'development') {
                                    peffixUrl = 'http://trinity-local.oss-cn-huhehaote.aliyuncs.com'
                                }else {
                                    peffixUrl = 'http://trinity-product.oss-cn-huhehaote.aliyuncs.com'
                                }
                                // 身份证号
                                if(data.ident_num && data.ident_num.length > 0) {
                                  this.IDPlaceholder = data.ident_num;
                                  this.IDNumber = data.ident_num
                                }
                                else {
                                  this.IDPlaceholder = '请输入身份证号码'
                                  this.IDNumber            = ''
                                }
                                // 身份证正面
                                if(data.ident_up && data.ident_up.length > 0) {
                                  this.indentImgUp =peffixUrl + data.ident_up;
                                  this.frontBase64Data = data.ident_up
                                  this.beforeHasDataUp = true
                                }
                                else {
                                  this.indentImgUp = '';
                                  this.beforeHasDataUp = false;
                                  this.frontBase64Data = ''
                                }
                                // 身份证反面
                                if(data.ident_down && data.ident_down.length > 0) {
                                  this.indentImg = peffixUrl + data.ident_down;
                                  this.beforeHasData = true
                                  this.versoData = data.ident_down
                                }
                                else {
                                  this.beforeHasData = false
                                  this.indentImg            = '';
                                  this.versoData = ''
                                }
                                // for(let item in data) {
                                // localStorage.setItem('user_detail_obj' , JSON.stringify(data))
                                // }
                                if(data.verified) {
                                  localStorage.setItem('user_verified',data.verified)
                                }
                              }
                          }else {
                              this.$Message.error({
                                  content : err && err.msg ? err.msg: '网络错误',
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
                          this.$LoadingBar.error()
                        }
                        this.$LoadingBar.finish()
                    })
                    .catch(err => {
                      console.log(err)
                      this.$Message.error({
                          content : err.msg ? err.msg: '网络错误',
                          duration: 5,
                          closable: true
                      });
                      this.$LoadingBar.error()
                    });
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
                margin-right: 20px /* 10/16 */;
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
