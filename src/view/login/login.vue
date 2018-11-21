<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">

     <vue-particles
                        color          = "#3BA5B2"
                      :particleOpacity = ".7"
                      :particlesNumber = "60"
                        shapeType      = "circle"
                      :particleSize    = "4"
                        linesColor     = "#48A8DA"
                      :linesWidth      = "1"
                      :lineLinked      = "true"
                      :lineOpacity     = "1"
                      :linesDistance   = "250"
                      :moveSpeed       = "3"
                      :hoverEffect     = "true"
                        hoverMode      = "grab"
                      :clickEffect     = "true"
                        clickMode      = "push"
     >
     </vue-particles>
    <div class = "login-left">
        <div class = "login-logo-name">
            <div class = "login-logo" src="./../../assets/images/ShunXiangLogo.png" alt="舜翔众邦"></div>
            <div class = "login-name">
                舜翔众邦科技有限公司
            </div>
        </div>
        <p class = "login-slogen">
            自助设备运营管理平台
        </p>
    </div>
    <div class = "login-footer">
      <p>
        <span>© 2009-2018</span> <a href="http://www.trinitytech.com.cn" target = "_blank" class = "trinity-url">www.trinitytech.com.cn</a> <span>版权所有</span><span>ICP证: </span><span>京: B2-20080101</span>
      </p>
    </div>
    <div class="login-con" v-if = "!registerShow">
        <div class = "tabs-con">
            <div :class = "[!selectPassword ? '' : 'login-select' , 'password-login']" @click = "passwordSelected">密码登录</div>
            <div class = "tabs-line"></div>
            <div :class = "[!selectPassword ? 'login-select' : '' , 'verify-login']"  @click = "verifySelected">验证码登录</div>
        </div>
        <!-- <Input v-model.trim="userName" :placeholder="userNamePlaceholder" number autofocus :maxlength="11" class = "login-input"/> -->
        <input type = "number" maxlength = "11" placeholder = "请输入手机号" oninput = "if(value.length>11)value=value.slice(0,11)" v-model.trim="userName" class = "login-input"/>
        <!-- <Input v-model.trim="password" placeholder="请输入密码" autofocus  class = "login-input" v-if = "selectPassword" :maxlength = "16"/> -->
        <!-- <Input v-model="verifyCode" placeholder="请输入验证码" autofocus  class = "verify-input" v-else  search :enter-button="getVerifyCode" on-search="getVerify"/> -->
        <!-- <vue-password v-model="password" v-if = "selectPassword" classes = "login-input" disableStrength/>
            <template slot="password-toggle" scope="props">
                <button class="VuePassword__Toggle" type   = "button" v-on:click  = "props.toggle" v-text = "props.type === 'password' ? 'SHOW' : 'HIDE'" > </button>
            </template>
        </vue-password> -->
        <vue-password v-model="password" v-if = "selectPassword" classes = "login-input" disableStrength >
            <div
                slot       = "password-input"
                slot-scope = "props"
                class      = "control has-icons-left"
            >
                <input class = "login-input" type = "password" placeholder = "请输入密码"  @keyup.enter = "login" v-model = "password" oninput = "if(value.length > 16)value = value.slice(0, 16)"  ref = "loginPassword" oncopy = "return false" oncut = "return false" onpaste = "return false">
                <span class="icon is-small is-left">
                    <i class="fas fa-user"></i>
                </span>
            </div>
        </vue-password>
        <div v-else class = "login-get-verify">
            <!-- <Input v-model="loginVerify" placeholder="请输入验证码" number autofocus :maxlength="11" class = "login-verify"/> -->
            <input type="text" v-model="loginVerify" @input="loginVerify = loginVerify.replace(/[^\d]/g,'')" class = "login-verify" placeholder="请输入验证码"  maxlength = "6"/>
            <a :class = "[ countDown ? 'count-down-button' : '','get-login-verify-button']" @click="getVerify">
              {{
                getVerifyCode
              }}
            </a>
        </div>
        <div v-if = "graphValidateCodeShowForPasswordLogin" class = "login-get-verify graph-validate-code-con">
            <Input v-model="graphCode" placeholder="请输入右侧的图形验证码"  autofocus :maxlength="5" class = "login-verify"/>
            <img :src = "graphCodeSrcPassword" class = "graph-code get-login-verify-button" @click = "getCaptcha"/>
        </div>
        <div v-if = "graphValidateCodeShowForVerificationLogin" class = "login-get-verify graph-validate-code-con">
            <Input v-model="graphCode" placeholder="请输入右侧的图形验证码"  autofocus :maxlength="5" class = "login-verify"/>
            <img :src = "graphCodeSrcVerify" class = "graph-code get-login-verify-button" @click = "getCaptcha"/>
        </div>
        <div :class = "[!selectPassword?'':'password-selected','two-button']">
            <!-- <div class = "remember-login" v-if = "selectPassword"> -->
            <div class = "remember-login">
              <div  :class = "[notRemember ? 'not-remember-login' : 'remembered-login']" @click="notRemember = !notRemember"></div>
              <p class = "remember-password" @click="rememberPassword">
                记住密码
              </p>
            </div>
            <div class = "forgotten-password" @click = "resetPassword">
              忘记密码
            </div>
        </div>
        <a class = "login-button main-button" @click = "login">登录</a>
        <a class = "register-button  main-button" @click = "registerClicked">注册</a>
    </div>

    <!-- 注册&找回密码&设备验证 -->
    <div v-else class = "register-con">
        <div class = "register">
          {{
            registerOrReset
          }}
        </div>
        <!-- <Input v-model.trim="registerUsername" :placeholder="userNamePlaceholder" number autofocus :maxlength="11" class = "login-input"/> -->
        <input type = "number" maxlength = "11" placeholder = "请输入手机号" oninput = "if(value.length>11)value=value.slice(0,11)" v-model.trim="registerUsername" class = "login-input"/>
        <!-- <Input v-model="registerVerifyCode" placeholder="请输入验证码" autofocus  number class = "verify-input" search enter-button="获取验证码"/> -->
        <div class = "login-get-verify">
            <!-- <Input v-model.trim="registerVerifyCode" placeholder="请输入验证码" number autofocus :maxlength="6" class = "login-verify"/> -->
            <input type="text" v-model="registerVerifyCode" @input="num2 = $event.target.value.replace(/[^\d]/g,'');$event.target.value = num2" class = "login-verify" placeholder="请输入验证码"  maxlength = "6"/>
            <div :class = "[ countDown ? 'count-down-button' : '','get-login-verify-button']" @click="getVerify">
              {{
                getVerifyCode
              }}
            </div>
        </div>
        <!-- <div v-if = "graphValidateCodeShow" class = "login-get-verify graph-validate-code-con">
            <Input v-model="graphCode" placeholder="请输入右侧的图形验证码"  autofocus :maxlength="5" class = "login-verify"/>
            <img :src = "graphCodeSrc" class = "graph-code get-login-verify-button" @click = "getCaptcha"/>
        </div> -->
        <!-- <Input v-model.trim="registerPassword" placeholder="请设置密码(8-16位字母数字组合)" autofocus  class = "login-input" v-if = "!changeDevice" @on-change = "passwordChange" @on-focus = "focusPassword" :maxlength="16"/> -->
        <vue-password v-model="registerPassword" v-if = "!changeDevice" classes = "login-input" disableStrength >
            <div
                slot       = "password-input"
                slot-scope = "register"
                class      = "control has-icons-left"
            >
                <input class = "login-input" type = "password" placeholder = "请设置密码(8-16位字母数字组合)" @on-change = "passwordChange" v-model = "registerPassword" oninput = "if(value.length > 11)value = value.slice(0, 16)"  ref = "loginPassword" oncopy = "return false" oncut = "return false" onpaste = "return false">
                <span class="icon is-small is-left">
                    <i class="fas fa-user"></i>
                </span>
            </div>
        </vue-password>
        <!-- <Input v-model.trim="confirmRegisterPassword" placeholder="请再次输入密码" autofocus  class = "login-input" v-if = "!changeDevice" :maxlength="16"/> -->
        <vue-password v-model="confirmRegisterPassword" v-if = "!changeDevice" classes = "register-password" disableStrength>
            <div
                slot       = "password-input"
                slot-scope = "registerConfirm"
                class      = "control has-icons-left"
            >
                <input class = "login-input" type = "password" placeholder = "请设置密码(8-16位字母数字组合)"  @kleyup.enter = "registerOrResetPassword" v-model = "confirmRegisterPassword" oninput = "if(value.length > 11)value = value.slice(0, 16)"  ref = "loginPassword" oncopy = "return false" oncut = "return false" onpaste = "return false">
                <span class="icon is-small is-left">
                    <i class="fas fa-user"></i>
                </span>
            </div>
        </vue-password>
        <div class = "login-button main-button" @click="registerOrResetPassword">
          {{
            registerOrSubmit
          }}
        </div>
        <div class = "register-button  main-button" @click = "backToLogin">返回</div>
    </div>
  </div>
</template>

<script>
import baseConfig from '@/config/index'
// import LoginForm from '_c/login-form'
import md5 from 'js-md5'
import VuePassword from 'vue-password'
import {
  validateMobilephone, // 校验手机号
  validatePassword, // 校验密码是否8至16位数字字母
  validateVerificationCode, // 校验验证码
  validateGraphCode,
  validateCaptcha
} from './../../libs/validate'
import { mapActions } from 'vuex';
const TIME_COUNT = 60;
import {_debounce,_throttle} from './../../libs/debounce';
import {uuid} from './../../libs/uuid';
import {getOrgDetail} from '@/api/login.js';
export default {
  components: {
    // LoginForm,
    VuePassword
  },
  data () {
    return {
        graphCodeSrcPassword                     : '',
        graphCodeSrcVerify                       : '',
        score                                    : 10,
        selectPassword                           : true,
        userName                                 : '',
        password                                 : '',
        verifyCode                               : '',
        userNamePlaceholder                      : '请输入用户名',
        notRemember                              : true,
        registerShow                             : false,
        registerUsername                         : '',
        registerVerifyCode                       : '',
        registerPassword                         : '',
        confirmRegisterPassword                  : '',
        getVerifyCode                            : '获取验证码',
        timer                                    : null,
        count                                    : '',
        countDown                                : false,
        registerOrReset                          : '',
        registerOrSubmit                         : '确定',
        changeDevice                             : false,
        alertType                                : 'error',
        alertMsg                                 : '系统异常，请及时联系管理员',
        graphValidateCodeShowForVerificationLogin: false,
        graphValidateCodeShowForPasswordLogin    : false,
        markVerifyLogin                          : false,
        markPasswordLogin                        : false,
        graphValidateCodeShow                    : false,
        graphCode                                : '',
        //   graphCodeSrc                             : 'http://img2.imgtn.bdimg.com/it/u=1190478869,2154054603&fm=26&gp=0.jpg',
        user_info               : {},
        identifyVerificationCode: 3,
        captchaUrl              : '',   //图形验证码接口path,
        loginVerify             : '',
        rememberedPasswordIsChanged : false
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    rememberPassword() {
        this.notRemember = !this.notRemember;
    },
    passwordChange() {
        this.rememberedPasswordIsChanged  = true;
    },
    updatePassword (inputVal) {
      console.log(`inputVal=${inputVal}`)
    },
    backToLogin () {
      this.getVerifyCode           = '获取验证码';
      this.registerUsername        = ''
      this.registerVerifyCode      = ''
      this.confirmRegisterPassword = '';
      this.registerPassword        = ''
      this.countDown               = false
      if (this.timer) {
        console.log(`this.timer=${this.timer}`)
        clearInterval(this.timer)
        this.timer = null
      } else {
        console.log(`!this.timer=${this.timer}`)
      };
      this.registerShow = false
    },
    // 注册
    registerClicked () {
      this.getVerifyCode            = '获取验证码'
      this.identifyVerificationCode = 0
      this.countDown                = false
      if (this.timer) {
        console.log(`this.timer=${this.timer}`)
        clearInterval(this.timer)
        this.timer = null
      } else {
        console.log(`!this.timer=${this.timer}`)
      }
      this.registerShow     = true
      this.registerOrReset  = '用户注册'
      this.registerOrSubmit = '注册'
      // 及时清空
      this.password    = ''
      this.loginVerify = ''
    },
    ifNotUuid() {
      if(localStorage.getItem('uuid') == null) {
        localStorage.setItem('uuid',uuid(8,16));
      }
    },
    // login
    login : _debounce(function() {
      console.log('validateMobilephone(this.userName):')
      console.log(validateMobilephone(this.userName))
      console.log("validatePassword('this.password'):")
      console.log(validatePassword(this.password))
      console.log('validateVerificationCode(this.loginVerify):')
      console.log(validateVerificationCode(this.loginVerify))
      console.log(this.registerShow)
      //需要图形验证码才能登录
      if((this.graphValidateCodeShowForPasswordLogin || this.graphValidateCodeShowForVerificationLogin) && !validateCaptcha(this.graphCode)){
          this.$Message.error({
            content : '图形验证码格式不正确或暂未填写!',
            duration: 3,
            closable: true
          });
          return;
      }
      // 账号密码登录
      if (this.selectPassword) {
        console.log('账号密码登录')
        //账号密码登录合法
        if (validateMobilephone(this.userName)) {
          console.log(`this.$refs.loginPassword.value=${this.$refs.loginPassword.value}`);

        console.log('baseConfig:')
        console.log(baseConfig);
        this.ifNotUuid();
        console.log(`this.rememberedPasswordIsChanged=${this.rememberedPasswordIsChanged}`)
        this.$axios.request({
          url    : baseConfig.baseUrl.dev + 'user/sign_in_web_mobile_password',
          method : 'post',
          headers: {
              'Content-Type'    : 'application/json; charset=utf-8',
              'Trinity-Token'   : '',
              'Request-Datatime': new Date().getTime()
          },
          data: {
              'priority': '3',
              'id_organization'   : '',
              'data'    : {
                'phone'   : this.userName,
                'password': localStorage.getItem('rememberPassword') && this.password == localStorage.getItem('password') ? this.password : md5(this.password) ,
                'verify_code': '',
                'captcha'    : this.graphValidateCodeShowForPasswordLogin ? this.graphCode        : '',
                'device_id'  : localStorage.getItem('uuid') != null ? localStorage.getItem('uuid'): uuid(8,16),
                'device_name': window.navigator.userAgent
              }
          }
        })
        .then(res => {
        console.log("login——res:");
        console.log(res)
        //请求成功
        if(res.status && res.status == 200) {
            if(res.data.code || res.data.success) {
                // 登录成功
                if(res.data.code == 0 ) {
                //登录成功的数据包
                if(res.data.data) {
                    let resData = res.data.data;
                    localStorage.setItem('Trinity-Token',resData.token)
                    localStorage.setItem('password',resData.password);
                    this.user_info = resData.user_info;
                    console.log(resData.user_info);
                    if(resData.user_info.verified) {
                        localStorage.setItem('user_verified',resData.user_info.verified)
                    }
                    if(resData.user_info.phone) {
                        localStorage.setItem('userPhone',resData.user_info.phone)
                    }
                    if(resData.user_info.name) {
                        localStorage.setItem('name',resData.user_info.name)
                    }
                    localStorage.setItem('fid_organization',resData.fid_organization);
                    localStorage.setItem('organization_level',resData.organization_level);
                    localStorage.setItem('role_level',resData.role_level);
                    localStorage.setItem('permission',resData.permission);
                    if(!this.notRemember) {
                        localStorage.setItem('rememberPassword',true)
                        localStorage.setItem('password',resData.password);
                    }else{
                        localStorage.setItem('rememberPassword',false);
                        if(localStorage.getItem('password') != null) {
                            localStorage.removeItem('password');
                        }
                    }
                    console.log("this.user_info:");
                    console.log(this.user_info);

                    this.$router.push({
                      name  : 'home',
                      params: resData
                    });
                }
                else {
                    this.$Message.error({
                        content : '登录失败',
                        duration: 5,
                        closable: true
                    });
                }
                }
                //登录失败
                else{
                    if(res.data.code == 105) {
                        this.changeDevice             = true;
                        this.registerOrReset          = '设备验证';
                        this.registerOrSubmit         = '验证'
                        this.registerShow             = true;
                        this.identifyVerificationCode = 1
                    //携带过去
                    console.log(`this.userName = ${this.userName}`)
                        this.registerUsername = this.userName
                    }
                    else if (res.data.code == 413) {
                        this.captchaUrl = 'captcha/device';
                        this.getCaptcha();
                    }
                    else if(res.data.code == 101 || res.data.code == 102) {
                        this.graphValidateCodeShowForPasswordLogin = true;
                        this.captchaUrl                            = res.data.code == 101 ? 'captcha/phone' : 'captcha/device';
                        this.getCaptcha();
                    }
                }
            }else {
                this.$Message.error({
                    content : res.data.msg ? res.data.msg: '登录失败',
                    duration: 5,
                    closable: true
                });
            }
            console.log("res.data:");
            console.log(res.data);
            console.log("res.data.data:")
            console.log(res.data.data)
        }
        //请求失败
        else{
            this.$Message.error({
                content : '网络异常，请及时联系管理员',
                duration: 5,
                closable: true
            });
        }
        console.log(res);
        console.log("this.$config:");
        console.log(this.$config);
        console.log("this.$route:");
        console.log(this.$route);
        console.log("this.$router:")
        console.log(this.$router)
        })
        .catch(err => {
            console.log("err:");
            console.log(err);
            this.$Message.error({
                content : '网络异常，请联系管理员处理',
                duration: 5,
                closable: true
            });
        })
        }
        //账号密码登录不合法
        else {
          console.log('username is invalidate')
          this.$Message.error({
            content : '用户名有误!',
            duration: 3,
            closable: true
          })
        }
      }
      // 手机验证码登录
      else {
        console.log('手机验证码登录')
        //手机验证码登录,手机号合法
        if (validateMobilephone(this.userName)) {
          //
          console.log(`this.loginVerify=${this.loginVerify}`)
          if (validateVerificationCode(this.loginVerify)) {
            this.ifNotUuid();
            // 注册或者重置密码
            this.$axios.request({
              url    : baseConfig.baseUrl.dev + 'user/sign_in_web_mobile_verify_code',
              method : 'post',
              headers: {
                'Content-Type'    : 'application/json; charset=utf-8',
                'Trinity-Token'   : '',
                'Request-Datatime': new Date().getTime()
              },
              data: {
                'priority': '3',
                'id_organization'   : '',
                'data'    : {
                  'phone'      : this.userName,
                  'password'   : '',
                  'verify_code': this.loginVerify,
                  'captcha'    : this.graphValidateCodeShowForVerificationLogin ? this.graphCode    : '',
                  'device_id'  : localStorage.getItem('uuid') != null ? localStorage.getItem('uuid'): uuid(8,16),
                  'device_name': window.navigator.userAgent
                }
              }
            })
            .then(res => {

              //请求成功
              if(res.status && res.status == 200) {
                if(res.data.code || res.data.success) {
                    // 登录成功
                    if(res.data.code == 0 ) {
                      //登录成功的数据包
                      if(res.data.data) {
                        let resData = res.data.data;
                        localStorage.setItem('Trinity-Token',resData.token)
                        localStorage.setItem('password',resData.password);
                        this.user_info = resData.user_info;
                        if(resData.user_info.verified) {
                            localStorage.setItem('user_verified',resData.user_info.verified)
                        }
                        if(resData.user_info.phone) {
                            localStorage.setItem('userPhone',resData.user_info.phone)
                        }
                        if(resData.user_info.name) {
                            localStorage.setItem('name',resData.user_info.name)
                        }
                        localStorage.setItem('fid_organization',resData.fid_organization);
                        localStorage.setItem('organization_level',resData.organization_level);
                        localStorage.setItem('role_level',resData.role_level);
                        localStorage.setItem('organization_level',resData.organization_level);
                        localStorage.setItem('permission',resData.permission);
                        if(!this.notRemember) {
                            localStorage.setItem('rememberPassword',true)
                            localStorage.setItem('password',resData.password);
                        }else{
                            localStorage.setItem('rememberPassword',false);
                            if(localStorage.getItem('password') != null) {
                                localStorage.removeItem('password');
                            }
                        }
                        console.log("this.user_info:");
                        console.log(this.user_info);
                        this.$router.push({
                          name  : 'home',
                          params: resData
                        });
                      }
                      else {
                        this.$Message.error({
                            content : '登录失败',
                            duration: 5,
                            closable: true
                        });
                      }
                    }
                    //登录失败
                    else{
                        if(res.data.code == 105) {
                          this.changeDevice             = true;
                          this.registerOrReset          = '设备验证';
                          this.registerOrSubmit         = '验证'
                          this.registerShow             = true;
                          this.identifyVerificationCode = 1
                          //携带过去
                          console.log(`this.userName = ${this.userName}`)
                          this.registerUsername = this.userName
                        }
                        else if (res.data.code == 405) {
                          this.$Message.warning({
                              content : res.data.msg ? res.data.msg: '验证码错误',
                              duration: 5,
                              closable: true
                          });
                        }
                        else if (res.data.code == 413) {
                          this.captchaUrl = 'captcha/phone';
                          this.getCaptcha();
                        }
                        else if(res.data.code == 101 || res.data.code == 102) {
                          this.graphValidateCodeShowForVerificationLogin = true;
                          this.captchaUrl                                = res.data.code == 101 ? 'captcha/phone' : 'captcha/device';
                          this.getCaptcha();
                        }
                    }
                }else {
                    this.$Message.error({
                        content : res.data.msg ? res.data.msg: '登录失败',
                        duration: 5,
                        closable: true
                    });
                }
                console.log("res.data:");
                console.log(res.data);
                console.log("res.data.data:")
                console.log(res.data.data)
              }
              //请求失败
              else{
                this.$Message.error({
                    content : '网络异常，请及时联系管理员',
                    duration: 5,
                    closable: true
                });
              }
            })
            .catch(err => {
              console.log("err:");
              console.log(err);
              this.$Message.error({
                  content : '网络异常，请联系管理员处理',
                  duration: 5,
                  closable: true
              });
            })
          }
          else {
            console.log('loginVerify is invalidate')
            this.$Message.error({
              content : '验证码格式有误！',
              duration: 3,
              closable: true
            })
          }
        }
        //手机验证码登录,手机号不合法
        else {
          console.log('username is invalidate')
          this.$Message.error({
            content : '手机号格式有误!',
            duration: 3,
            closable: true
          })
        }
      }
    },200),
    //获取图形验证码
    getCaptcha() {
        let reqData = {}
        if(this.captchaUrl.lastIndexOf('phone') > 0) {
            console.log('当前为获取手机图形验证码');
            reqData = {
                phone: this.userName
            }
        }
        else {
            console.log('当前为获取Device图形验证码');
            reqData = {
              'device_id'  : localStorage.getItem('uuid') != null ? localStorage.getItem('uuid'): uuid(8,16),
              'device_name': window.navigator.userAgent
            }
        }
        this.$axios.request({
          url    : baseConfig.baseUrl.dev + this.captchaUrl,
          method : 'post',
          headers: {
            'Content-Type'    : 'application/json; charset=utf-8',
            'Trinity-Token'   : '',
            'Request-Datatime': new Date().getTime()
          },
          data: {
            'priority': '3',
            'id_organization'   : '',
            'data'    : reqData
          }
        })
        .then(res => {
          console.log("res:");
          console.log(res);
          //请求成功
          if(res.status && res.status == 200) {
            // 登录成功
            if(res.data.code == 0) {
                if(this.captchaUrl.lastIndexOf('phone') < 0) {
                    console.log('当前为获取手机图形验证码');
                    this.graphCodeSrcPassword = 'data:image/png;base64,'  + res.data.img
                }else {
                    this.graphCodeSrcVerify = 'data:image/png;base64,'  + res.data.img
                }
            }
            //登录失败
            else{
              this.$Message.error({
                  content : res.data.msg ? res.data.msg: '获取图形验证码异常，请及时联系管理员处理',
                  duration: 5,
                  closable: true
              });
            }
          }
          //请求失败
          else{
            this.$Message.error({
                content : res.status || '获取图形验证码异常，请及时联系管理员处理',
                duration: 5,
                closable: true
            });
          }
        })
        .catch(err => {
          console.log("err:");
          console.log(err);
          this.$Message.error({
              content : '获取图形验证码异常，请及时联系管理员处理',
              duration: 5,
              closable: true
          });
        })
    },
    passwordChange () {
      console.log('passwordChange')
    },
    focusPassword () {
      console.log('focusPassword')
    },
    // 忘记密码
    resetPassword () {
      this.identifyVerificationCode = 2
      this.registerShow             = true
      this.registerOrReset          = '找回密码'
      this.registerOrSubmit         = '确定'
      // 及时清空
      this.password    = ''
      this.loginVerify = ''
      // 及时携带用户已经输入的手机号
      this.registerUsername = this.userName;
      //及时更新获取验证码定时器的状态
      if(this.timer) {
        clearInterval(this.timer);
        this.timer         = null;
        this.countDown     = false;
        this.getVerifyCode = '获取验证码'
      }
    },
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
          })
        })
      })
    },
    passwordSelected () {
        console.log('passwordSelected')
        console.log(`this.graphValidateCodeShowForPasswordLogin=${this.graphValidateCodeShowForPasswordLogin}`)
        console.log(`this.graphValidateCodeShowForVerificationLogin=${this.graphValidateCodeShowForVerificationLogin}`);
        this.markVerifyLogin                           = this.graphValidateCodeShowForVerificationLogin
        this.graphValidateCodeShowForVerificationLogin = false;
        this.graphValidateCodeShowForPasswordLogin     = this.markPasswordLogin;
        // if(this.graphValidateCodeShowForPasswordLogin) {
        //     this.captchaUrl = 'captcha/device';
        //     this.getCaptcha();
        // }
        this.selectPassword      = true
        this.userNamePlaceholder = '请输入用户名'
      // 及时清空
    //   this.password    = ''
    //   this.loginVerify = '';
    //   if(this.graphValidateCodeShow) {
    //       //重新获取正确的，对应的设备或者手机图形验证码
    //     this.captchaUrl = 'captcha/device';
    //     this.getCaptcha();
    //   }
    },
    verifySelected () {
      this.selectPassword      = false
      this.userNamePlaceholder = '请输入手机号'
      // 及时清空
    //   this.password    = ''
    //   this.loginVerify = ''
    //   if(this.graphValidateCodeShow) {
    //       //重新获取正确的，对应的设备或者手机图形验证码
    //     this.captchaUrl = 'captcha/phone';
    //     this.getCaptcha();
    //   }
        this.markPasswordLogin                         = this.graphValidateCodeShowForPasswordLogin
        this.graphValidateCodeShowForVerificationLogin = this.markVerifyLogin
        // if(this.graphValidateCodeShowForVerificationLogin) {
        //     this.captchaUrl = 'captcha/phone';
        //     this.getCaptcha();
        // }
        this.graphValidateCodeShowForPasswordLogin = false;
        console.log('verifySelected')
        console.log(`this.graphValidateCodeShowForPasswordLogin=${this.graphValidateCodeShowForPasswordLogin}`)
        console.log(`this.graphValidateCodeShowForVerificationLogin=${this.graphValidateCodeShowForVerificationLogin}`)
    },
    registerOrResetPassword () {
      if(this.registerOrSubmit != '验证') {
        console.log('非更换新设备校验')
          //如果注册时手机号合法、验证码合法、两次密码合法且相等
          if(validateMobilephone(this.registerUsername) && validateVerificationCode(this.registerVerifyCode) && validatePassword(this.registerPassword) && validatePassword(this.confirmRegisterPassword) && this.registerPassword === this.confirmRegisterPassword ){
              if (this.registerOrReset == '找回密码') {
                  console.log('找回密码')
                  this.$axios.request({
                    url    : baseConfig.baseUrl.dev + 'user/forget_password',
                    method : 'post',
                    headers: {
                      'Content-Type'    : 'application/json; charset=utf-8',
                      'Trinity-Token'   : '',
                      'Request-Datatime': new Date().getTime()
                    },
                    data: {
                      'priority': '3',
                      'id_organization'   : '',
                      'data'    : {
                        'phone'       : this.registerUsername,
                        'new_password': md5(this.confirmRegisterPassword),
                        'verify_code' : this.registerVerifyCode,
                        'password'    : md5(this.registerPassword),
                        // 'device_id'  : localStorage.getItem('uuid') != null ? localStorage.getItem('uuid'): uuid(8,16),
                        // 'device_name': window.navigator.userAgent
                      }
                    }
                  })
                  .then(res => {
                      console.log("res:");
                      console.log(res);
                      //请求成功
                      if(res.status && res.status == 200) {
                        //重置成功
                        if(res.data.code == 0) {
                          this.$Message.success({
                              content : '密码重置成功',
                              duration: 5,
                              closable: true
                          });

                          this.identifyVerificationCode = 3
                          this.registerShow             = false
                          // this.registerOrReset  = '找回密码'
                          // this.registerOrSubmit = '确定'
                          // 将已经修改成功的手机号携带过去给非注册界面
                          // this.password    = this.registerUsername
                          // this.loginVerify = ''
                          // 及时携带用户已经输入的手机号
                          this.userName = this.registerUsername;
                          //及时更新获取验证码定时器的状态
                          if(this.timer) {
                            clearInterval(this.timer);
                            this.timer         = null;
                            this.countDown     = false;
                            this.getVerifyCode = '获取验证码'
                          }
                        }
                        // //登录失败
                        // else{
                        //   this.$Message.error({
                        //       content : res.data.msg ? res.data.msg: '网络异常，请及时联系管理员',
                        //       duration: 5,
                        //       closable: true
                        //   });
                        // }
                      }
                      //请求失败
                      else{
                        this.$Message.error({
                            content : res.status,
                            duration: 5,
                            closable: true
                        });
                      }
                      console.log(res);
                      console.log("this.$config:");
                      console.log(this.$config);
                      console.log("this.$route:");
                      console.log(this.$route);
                      console.log("this.$router:")
                      console.log(this.$router)
                      console.log("res.data:");
                      console.log(res.data);
                      console.log("res.data.data:")
                      console.log(res.data.data)
                  })
                  .catch(err => {
                    console.log(err)
                  })

              } else {
                  console.log('用户注册');
                  this.ifNotUuid();
                  this.$axios.request({
                    url    : baseConfig.baseUrl.dev + 'user/sign_up_web',
                    method : 'post',
                    headers: {
                      'Content-Type'    : 'application/json; charset=utf-8',
                      'Trinity-Token'   : '',
                      'Request-Datatime': new Date().getTime()
                    },
                    data: {
                      'priority': '3',
                      'id_organization'   : '',
                      'data'    : {
                        'phone'      : this.registerUsername,
                        'password'   : md5(this.confirmRegisterPassword),
                        'verify_code': this.registerVerifyCode,
                        'captcha'    : '',
                        'device_id'  : localStorage.getItem('uuid') != null ? localStorage.getItem('uuid'): uuid(8,16),
                        'device_name': window.navigator.userAgent
                      }
                    }
                  })
                  .then(res => {
                      console.log("res:");
                      console.log(res);
                      //请求成功
                      if(res.status && res.status == 200) {
                        // 登录成功
                        if(res.data.code == 0) {
                          //登录成功的数据包
                          if(res.data.data) {
                            let resData = res.data.data;
                            localStorage.setItem('Trinity-Token',resData.token)
                            localStorage.setItem('password',resData.password);
                            this.user_info = resData.user_info;
                            // console.log(resData.user_info);
                            // for(let item in resData.user_info) {
                            //   console.log(item)
                            // }
                            // if(resData.user_info.phone) {
                            //     localStorage.setItem('userPhone',resData.user_info.phone)
                            // }
                            // if(!this.notRemember) {
                            //     localStorage.setItem('rememberPassword',true)
                            //     localStorage.setItem('password',resData.password);
                            // }else{
                            //     localStorage.setItem('rememberPassword',false);
                            //     if(localStorage.getItem('password') != null) {
                            //         localStorage.removeItem('password');
                            //     }
                            // }
                            // for(let item in resData.user_info) {
                            //   console.log(item);
                            //   localStorage.setItem(item,resData.user_info[item])
                            // }
                            if(resData.user_info.verified) {
                                localStorage.setItem('user_verified',resData.user_info.verified)
                            }
                            if(resData.user_info.name) {
                                localStorage.setItem('userPhone',resData.user_info.phone)
                            }
                            if(resData.user_info.name) {
                                localStorage.setItem('name',resData.user_info.name)
                            }
                            if(resData.user_info.phone) {
                                localStorage.setItem('userPhone',resData.user_info.phone)
                            }
                            localStorage.setItem('fid_organization',resData.fid_organization);
                            localStorage.setItem('organization_level',resData.organization_level);
                            localStorage.setItem('role_level',resData.role_level);
                            localStorage.setItem('organization_level',resData.organization_level);
                            localStorage.setItem('permission',resData.permission);
                            if(!this.notRemember) {
                                localStorage.setItem('rememberPassword',true)
                                localStorage.setItem('password',resData.password);
                            }else{
                                localStorage.setItem('rememberPassword',false);
                                if(localStorage.getItem('password') != null) {
                                    localStorage.removeItem('password');
                                }
                            }
                            console.log("this.user_info:");
                            console.log(this.user_info);
                            this.$router.push({
                              name  : 'home',
                              params: resData
                            });
                          }else {
                            this.$Message.error({
                                content : '登录失败',
                                duration: 5,
                                closable: true
                            });
                          }
                        }
                        //登录失败
                        else{
                          this.$Message.error({
                              content : res.data.msg ? res.data.msg: '登录失败',
                              duration: 5,
                              closable: true
                          });
                        }
                      }
                      //请求失败
                      else{
                        this.$Message.error({
                            content : res.status,
                            duration: 5,
                            closable: true
                        });
                      }
                      console.log(res);
                      console.log("this.$config:");
                      console.log(this.$config);
                      console.log("this.$route:");
                      console.log(this.$route);
                      console.log("this.$router:")
                      console.log(this.$router)
                      console.log("res.data:");
                      console.log(res.data);
                      console.log("res.data.data:")
                      console.log(res.data.data)
                  })
                  .catch(err => {
                    console.log(err)
                  })
              }
          }
          else {
            if(!validateMobilephone(this.registerUsername)) {
              this.$Message.warning({
                content : '手机号格式有误',
                duration: 5,
                closable: true
              })
            }else if(!validateVerificationCode(this.registerVerifyCode)){
              console.log(`validateVerificationCode(this.loginVerify)=${validateVerificationCode(this.loginVerify)}`);
              console.log(`this.loginVerify=${this.loginVerify}`)
              this.$Message.warning({
                content : '验证码格式有误',
                duration: 5,
                closable: true
              })
            }else {
              if(!validatePassword(this.registerPassword) || !validatePassword(this.confirmRegisterPassword)) {
                this.$Message.warning({
                  content : '密码格式有误',
                  duration: 5,
                  closable: true
                })
              }else{
                if(this.registerPassword !== this.confirmRegisterPassword) {
                  this.$Message.warning({
                    content : '两次输入的密码不相同',
                    duration: 5,
                    closable: true
                  })
                }else {
                  console.log('')
                }
              }
            }
          }
      }
      //更换新设备校验
      else {
        console.log('更换新设备校验');
        if(validateMobilephone(this.registerUsername) && validateVerificationCode(this.registerVerifyCode)) {
            this.ifNotUuid();
            this.$axios.request({
              url    : baseConfig.baseUrl.dev + 'user/sign_in_web_new_device_check',
              method : 'post',
              headers: {
                'Content-Type'    : 'application/json; charset=utf-8',
                'Trinity-Token'   : '',
                'Request-Datatime': new Date().getTime()
              },
              data: {
                'priority': '3',
                'id_organization'   : '',
                'data'    : {
                  'phone'   : this.userName,
                //   'password': md5(this.password),
                    'password': this.rememberedPasswordIsChanged && this.userName == localStorage.getItem('userPhone') ?  this.password : md5(this.password),
                  // 'new_password': md5(this.password),
                  'verify_code': this.registerVerifyCode,
                  'captcha'    : this.graphValidateCodeShow ? this.graphCode                        : '',
                  'device_id'  : localStorage.getItem('uuid') != null ? localStorage.getItem('uuid'): uuid(8,16),
                  'device_name': window.navigator.userAgent
                }
              }
            })
            .then(res => {
              console.log("login——res:");
              console.log(res)
                // if(res.data.code) {
                    // 登录成功
                    if(res.data.code == 0 ) {
                      //登录成功的数据包
                      if(res.data.data) {
                        let resData = res.data.data;

                        console.log(resData)

                        localStorage.setItem('Trinity-Token',resData.token)
                        this.user_info = resData.user_info;
                        if(resData.user_info.verified) {
                            localStorage.setItem('user_verified',resData.user_info.verified)
                        }
                        if(resData.user_info.name) {
                            localStorage.setItem('name',resData.user_info.name)
                        }
                        if(resData.user_info.phone) {
                            localStorage.setItem('userPhone',resData.user_info.phone)
                        }
                        localStorage.setItem('fid_organization',resData.fid_organization);
                        localStorage.setItem('organization_level',resData.organization_level);
                        localStorage.setItem('role_level',resData.role_level);
                        localStorage.setItem('permission',resData.permission);
                        if(!this.notRemember) {
                            localStorage.setItem('rememberPassword',true)
                            localStorage.setItem('password',resData.password);
                        }else{
                            localStorage.setItem('rememberPassword',false);
                            if(localStorage.getItem('password') != null) {
                                localStorage.removeItem('password');
                            }
                        }

                        console.log(localStorage)

                        console.log("this.user_info:");
                        console.log(this.user_info);
                        this.$router.push({
                          name  : 'home',
                          params: resData
                        });
                      }
                      else {
                        this.$Message.error({
                            content : '登录失败',
                            duration: 5,
                            closable: true
                        });
                      }
                    }
                    //登录失败
                    else{
                        if(res.data.code == 105) {
                          this.changeDevice             = true;
                          this.registerOrReset          = '设备验证';
                          this.registerOrSubmit         = '验证'
                          this.registerShow             = true;
                          this.identifyVerificationCode = 1
                          //携带过去
                          console.log(`this.userName = ${this.userName}`)
                          this.registerUsername = this.userName
                        }
                        else if (res.data.code == 401) {
                          this.$Message.warning({
                              content : res.data.msg ? res.data.msg: '认证信息错误，请仔细检查密码是否正确或账号是否已注册',
                              duration: 5,
                              closable: true
                          });
                        }
                        else if (res.data.code == 405) {
                          this.$Message.warning({
                              content : res.data.msg ? res.data.msg: '验证码错误',
                              duration: 5,
                              closable: true
                          });
                        }
                        else if(res.data.code == 101 || res.data.code == 102) {
                          this.graphValidateCodeShow = true;
                          this.captchaUrl            = res.data.code == 101 ? 'captcha/phone' : 'captcha/device';
                          this.getCaptcha();
                        }
                        else if(res.data.code == 400) {

                        }
                    }
              console.log(res);
              console.log("this.$config:");
              console.log(this.$config);
              console.log("this.$route:");
              console.log(this.$route);
              console.log("this.$router:")
              console.log(this.$router)
            })
            .catch(err => {
              console.log("err:");
              console.log(err);
              this.$Message.error({
                  content : '网络异常，请联系管理员处理',
                  duration: 5,
                  closable: true
              });
            })
        }
        else {
            //
        }
      }
    },
    getVerify : _throttle(function() {
      //当前并非登录获取验验证码，如果输入的手机号不合法
      if(! validateMobilephone(this.userName) && !validateMobilephone(this.registerUsername)) {
        this.$Message.error({
          content : '手机号格式有误!',
          duration: 3,
          closable: true
        })
      }
      else {
        // 当前登录获取验验证码
        if(this.registerShow) {
          if(!validateMobilephone(this.registerUsername)) {
            this.$Message.error({
              content : '手机号格式有误!',
              duration: 3,
              closable: true
            });
            if(!this.timer) {
              clearInterval(this.timer)
              this.timer         = null
              this.getVerifyCode = '获取验证码'
              this.countDown     = false
            }
          }else{
                  this.ifNotUuid();
                  this.$axios.request({
                    url    : baseConfig.baseUrl.dev + 'verify_code/send',
                    method : 'post',
                    headers: {
                      'Content-Type'    : 'application/json; charset=utf-8',
                      'Trinity-Token'   : '',
                      'Request-Datatime': new Date().getTime()
                    },
                    data: {
                      'priority': '3',
                      'id_organization'   : '',
                      'data'    : {
                        'phone': !this.registerShow ? this.userName: this.registerUsername,
                        'type' : this.identifyVerificationCode
                      }
                    }
                  })
                  .then(res => {
                    console.log(res);
                    //请求成功
                    if(res.status && res.status == 200) {
                      //获取验证码
                      if(res.data.success && res.data.msg == 'success') {
                        if (!this.timer) {
                          this.count = TIME_COUNT
                          this.timer = setInterval(() => {
                            if (this.count > 0 && this.count <= TIME_COUNT) {
                              this.count--
                              this.getVerifyCode = '重新发送' + this.count + 'S'
                              this.countDown     = true
                            } else {
                              clearInterval(this.timer)
                              this.timer         = null
                              this.getVerifyCode = '获取验证码'
                              this.countDown     = false
                            }
                          }, 1000);
                        } else {
                          console.log(this.timer)
                        }
                        //获取验证码的数据包
                        this.$Message.success({
                          content : '验证码已发送',
                          duration: 5,
                          closable: true
                        });
                      }
                      //获取验证码失败
                      else{
                        this.$Message.error({
                            content : res.data.msg ? res.data.msg: '获取验证码失败',
                            duration: 5,
                            closable: true
                        });
                      }
                      console.log("res.data:");
                      console.log(res.data);
                      console.log("res.data.data:")
                      console.log(res.data.data)
                    }
                    //请求失败
                    else{
                      this.$Message.error({
                          content : res.status,
                          duration: 5,
                          closable: true
                      });
                    }
                  })
                  .catch(err => {
                    console.log(err);
                    this.$Message.error({
                        content : res.status,
                        duration: 5,
                        closable: true
                    });
                  })

          }
        }
        //当前登录获取验验证码
        else{
          //当前登录获取验验证码，如果输入的手机号不合法
          if(!validateMobilephone(this.userName)) {
            this.$Message.error({
              content : '手机号格式有误!',
              duration: 3,
              closable: true
            });
            if(!this.timer) {
              clearInterval(this.timer)
              this.timer         = null
              this.getVerifyCode = '获取验证码'
              this.countDown     = false
            }
          }
          // /当前登录获取验验证码，如果输入的手机号合法
          else{
                  this.identifyVerificationCode = 3  //当前登录获取手机验证码
                  this.ifNotUuid();
                  this.$axios.request({
                    url    : baseConfig.baseUrl.dev + 'verify_code/send',
                    method : 'post',
                    headers: {
                      'Content-Type'    : 'application/json; charset=utf-8',
                      'Trinity-Token'   : '',
                      'Request-Datatime': new Date().getTime()
                    },
                    data: JSON.stringify({
                      'priority': '3',
                      'id_organization'   : '',
                      'data'    : {
                        'phone': !this.registerShow ? this.userName: this.registerUsername,
                        'type' : this.identifyVerificationCode                               //手机验证码登录接口
                      }
                    })
                  })
                  .then(res => {
                    console.log(res);
                    //请求成功
                    if(res.status && res.status == 200) {
                      //获取验证码
                      if(res.data.success && res.data.msg == 'success') {
                        if (!this.timer) {
                          this.count = TIME_COUNT
                          this.timer = setInterval(() => {
                            if (this.count > 0 && this.count <= TIME_COUNT) {
                              this.count--
                              this.getVerifyCode = '重新发送' + this.count + 'S'
                              this.countDown     = true
                            } else {
                              clearInterval(this.timer)
                              this.timer         = null
                              this.getVerifyCode = '获取验证码'
                              this.countDown     = false
                            }
                          }, 1000);
                        } else {
                          console.log(this.timer)
                        }
                        //获取验证码的数据包
                        this.$Message.success({
                          content : '获取验证码成功',
                          duration: 5,
                          closable: true
                        })
                      }
                      //获取验证码失败
                      else{
                        this.$Message.error({
                            content : res.data.msg ? res.data.msg: '获取验证码失败',
                            duration: 5,
                            closable: true
                        });
                      }
                      console.log("res.data:");
                      console.log(res.data);
                      console.log("res.data.data:")
                      console.log(res.data.data)
                    }
                    //请求失败
                    else{
                      this.$Message.error({
                          content : res.status,
                          duration: 5,
                          closable: true
                      });
                    }
                  })
                  .catch(err => {
                    console.log(err)
                    this.$Message.error({
                        content : '网络异常，请联系管理员',
                        duration: 5,
                        closable: true
                    });
                  })
          }
        }
      }
    },200)
  },
  created() {
    console.log("this.$router.options:")
    console.log(this.$router.options)
  },
  mounted() {
    this.$Message.config({
        top     : 389,
        duration: 3
    });
    if(localStorage.getItem('password') != null ) {
        this.notRemember = !localStorage.getItem('rememberPassword')
    }else {
        this.notRemember = true
    }
    this.rememberedPasswordIsChanged = localStorage.getItem('rememberPassword') != null ? localStorage.getItem('rememberPassword') : false
    console.log(`process.env.NODE_ENV=${process.env.NODE_ENV}`);
  }
}
</script>

<style lang = "less">
.ivu-message{
    top: 380px;
    .ivu-message-notice {
        width   : 380px;
        position: absolute !important;
        right   : 130px !important;
    }
}
</style>
