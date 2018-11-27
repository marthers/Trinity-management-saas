<template>
    <div class = "list-con">
        <header class= "title">
            <div class = "verticle-line"></div>
            <div class = "title-word">{{title}}</div>
        </header>
        <div class = "search-con">
            <div class = "input-con">
                <input type="text" :placeholder="namePlaceholder" maxlength="10" v-model.trim = "nameVal" class = "input">
                <input type="text" :placeholder="groupPlaceholder" maxlength="10" v-model.trim = "groupVal" class = "input" v-if = "userOrMerchant == '用户'">
                <DatePicker
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="开始时间"
                    style="width: 14vw"
                    v-model = "startTime"
                    @on-change = "timeOk"
                    :options = "startOptions"
                    :clearable = "false"
                    class = "time-con"></DatePicker>
                <DatePicker
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="结束时间"
                    style="width: 14vw"
                    v-model = "endTime"
                    @on-change = "timeOk"
                    :clearable = "false"
                    :options = "endOptions"
                    class = "time-con"></DatePicker>
                <!-- <TimePicker type="timerange" placement="bottom" placeholder="开始时间" style="width: 168px" :value = "startTime" @on-ok = "timeOk"></TimePicker>
                <TimePicker type="timerange" placement="bottom" placeholder="结束时间" style="width: 168px" :value = "endTime" @on-ok = "timeOk"></TimePicker> -->
            </div>
            <button class = "button" @click.stop.prevent = "submitSearch">查询</button>
        </div>
        <Table
          :columns="tableColumn"
          ref = "tableSelection"
          class = "table"
          :data="tableData"></Table>
        <footer>
            <div class = "left">
                <div @click.stop.prevent="handleSelectAll" class = "select-all-container">
                  <div class = "radio-list">
                      <div class = "checked-radio" v-if = "selectAll"></div>
                  </div>
                  <div class = "select-all-word">全选</div>
                </div>
                <div class = "batch-through" @click.stop.prevent = "batchThrough">批量通过</div>
            </div>
            <!-- <div class = "right"></div> -->
            <Page :total="pager.total_count" class = "right"/>
        </footer>
        <reject-modal :rejectModalShow = "rejectModalShow" @closeModal = "closeModal"></reject-modal>
        <Modal v-model="batchThroughSetRoleModal">
            <p>Content of dialog</p>
            <p>Content of dialog</p>
            <p>Content of dialog</p>
            <div slot="footer">
                <Button type="error" size="large" long >Delete</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import RejectModal from './../../components/rejectModal';
import baseConfig from '@/config/index';
const jiweiDevHost = baseConfig.baseUrl.jiweiDevHost;
const baseUrl = baseConfig.baseUrl.localOrgHost;
import {getOrgList} from '@/api/org/org.js';
import {
  getUserList,
} from '@/api/user.js';
export default {
  name : 'CheckList',
  data() {
    return {
      pager : {
        page_index : 1,
        page_size : 13,
        total_count : 13
      },
      batchThroughSetRoleModal : false,
      selectAll : false,
      // selectAllRadio : false,
      // selectAllTrue : false,
      // selectAllFalse : true,
      title : '员工审核',
      namePlaceholder : '用户名',
      nameVal : '',
      groupPlaceholder : '用户组',
      groupVal : '',
      startTime : '',
      endTime : '',
      rejectModalShow : false,
      startOptions: {
          disabledDate (date) {
              return date && date.valueOf() < Date.now() - 86400000;
          }
      },
      endOptions: {
          disabledDate (date) {
              const disabledDay = date.getDate();
              return disabledDay === 15;
          }
      },
      tableColumn : [
          {
              // type: 'html',
              align: 'center',
              width : 100,
              render: (h, params) => {
                  return h('div', {
                    style : {
                      position : 'relative',
                      left : '50%',
                      width : '30px'
                    }
                  },[
                      h('div', {
                          'class': {
                              'radio-list' : true,
                              // 'radio-con' : params.row.option.selected,
                          },
                          on: {
                              click: () => {
                                params.row.option.selected = !params.row.option.selected
                              }
                              // click: vm.handleSelect(params)
                          },
                          // 'attrs' : {
                          // }
                      },[
                        h('div',{
                          style : {
                            width: '10px',
                            height : '10px',
                            'visibility' : params.row.option.selected ? 'visible' : 'hidden'
                          },
                          'class' : {
                            'checked-radio' : params.row.option.selected
                          }
                        })
                      ])
                  ]);
              },
              title: '选项',
              key: 'option'
          },
          // {
          //     title: '选项',
          //     key: 'option'
          // },
          {
              title: '序号',
              key: 'order',
              type : 'index',
              align: 'center',
              render : (h,params) => {
                return h('span',{
                  on : {
                    'click' : ev => {
                      ev = e || event;
                      ev.preventDefault()
                    }
                  }
                })
              }
          },
          {
              title: '用户账号',
              key: 'phone'
          },
        //   {
        //       title: '商户身份',
        //       key: 'identity'
        //   },
          {
              title: '商户编号',
              key: 'id_user'
          },
          {
              title: '认证状态',
              key: 'certificationStatus'
          },
          {
              title: '账户状态',
              key: 'accountStatus'
          },
          {
              title: '注册时间',
              key: 'createDate',
              align: 'center',
          },
          {
              title: '操作',
              key: 'operation',
              width : 300,
              align: 'center',
              render: (h, params) => {
                  return h('div', {
                    'class' : {
                      'operation-con' : true
                    }
                  },[
                      h('div', {
                          on : {
                            click: () => {
                                this.getVerify(params)
                            }
                          },
                          style : {
                            width : '19px',
                            height : '20px'
                          },
                          'class' : {
                            'operation-left-two' : true,
                            'verify' : true
                          }
                      }),
                      h('div',{
                        on : {
                          click: () => {
                              this.getVerify(params)
                          }
                        },
                        'class' : {
                          'operation-left-two-word' : true
                        }
                      }, '验证'),
                      h('div', {
                          style : {
                            width : '19px',
                            height : '20px'
                          },
                          'class' : {
                            'operation-left-two' : true,
                            'verify' : true
                          },
                          on: {
                              click: () => {
                                  this.getDetail(params)
                              }
                          }
                      }),
                      h('div', {
                        on : {
                          click: () => {
                              this.getDetail(params)
                          }
                        },
                        'class' : {
                          'operation-left-two-word' : true
                        }
                      },'详情'),
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'small'
                          },
                          style: {
                              marginRight: '5px'
                          },
                          on: {
                              click: () => {
                                  this.approve(params,h)
                              }
                          }
                      }, '通过'),
                      h('Button', {
                          props: {
                              type: 'error',
                              size: 'small'
                          },
                          on: {
                              click: () => {
                                  this.reject(params)
                              }
                          }
                      }, '拒绝')
                  ]);
              }
          },
          // {
          //     title: '/\s/',
          //     key: 'check',
          //     render: (h, params) => {
          //         return h('div', [
          //             h('Button', {
          //                 props: {
          //                     type: 'primary',
          //                     size: 'small'
          //                 },
          //                 style: {
          //                     marginRight: '5px'
          //                 },
          //                 on: {
          //                     click: () => {
          //                         this.approve(params,h)
          //                     }
          //                 }
          //             }, '通过'),
          //             h('Button', {
          //                 props: {
          //                     type: 'error',
          //                     size: 'small'
          //                 },
          //                 on: {
          //                     click: () => {
          //                         this.reject(params)
          //                     }
          //                 }
          //             }, '拒绝')
          //         ]);
          //     }
          // }
      ],
      tableData : [
        {
          order : 1,
          option : {
              selected : false
          },
          phone : '18301437032',
          identity : '运营商',
          id_user : '228998',
          certificationStatus : '待审核',
          accountStatus : '正常',
          createDate : '2017-6-5 12:22:04',
          operation : {
            validate : true,
            beenChecked : true,
            pass : false
          }
        },
        {
          order : 2,
          option : {
              selected : false
          },
          phone : '18301437032',
          identity : '运营商',
          id_user : '228998',
          certificationStatus : '待审核',
          accountStatus : '正常',
          createDate : '2017-6-5 12:22:04',
          operation : {
            validate : true,
            beenChecked : false,
            pass : false
          }
        },
        {
          order : 3,
          option : {
              selected : false
          },
          phone : '18301437032',
          identity : '运营商',
          id_user : '228998',
          certificationStatus : '待审核',
          accountStatus : '正常',
          createDate : '2017-6-5 12:22:04',
          operation : {
            validate : false,
            beenChecked : true,
            pass : true
          }
        },
        {
          order : 4,
          option : {
              selected : false
          },
          phone : '18301437032',
          identity : '运营商',
          id_user : '228998',
          certificationStatus : '待审核',
          accountStatus : '正常',
          createDate : '2017-6-5 12:22:04',
          operation : {
            validate : true,
            beenChecked : false,
            pass : false
          }
        },
        {
          order : 5,
          option : {
              selected : false
          },
          phone : '18301437032',
          identity : '运营商',
          id_user : '228998',
          certificationStatus : '待审核',
          accountStatus : '正常',
          createDate : '2017-6-5 12:22:04',
          operation : {
            validate : false,
            beenChecked : true,
            pass : true
          }
        },
        {
          order : 6,
          option : {
              selected : false
          },
          phone : '18301437032',
          identity : '运营商',
          id_user : '228998',
          certificationStatus : '待审核',
          accountStatus : '正常',
          createDate : '2017-6-5 12:22:04',
          operation : {
            validate : true,
            beenChecked : true,
            pass : true
          }
        }
      ],
      userOrMerchant : '用户'
    }
  },
  methods : {
    closeModal() {
      this.rejectModalShow = false
    },
    getVerify(params) {
      console.log(params)
    },
    getDetail(params) {
      console.log(params)
    },
    approve(index,h) {
      console.log(index);
      console.log(h)
    },
    reject(index) {
      console.log(index);
      this.rejectModalShow = true
    },
    timeOk() {
      console.log(`this.startTime=${this.startTime}`);
      console.log(`this.endTime=${this.endTime}`);
    },
    //查询
    submitSearch() {

    },
    //全选
    handleSelectAll() {
      this.selectAll = !this.selectAll
      this.tableData.forEach((item,index) => {
        item.option.selected = this.selectAll
      })
    },
    //批量通过
    batchThrough() {
      let selectedArr = this.tableData.filter(item => {
         if(item.option.selected) {
           return true
         }
         else {
           return 'haha'
         }
      });
      console.log(selectedArr);
      this.tableData.forEach((item,index) => {
        console.log(item.option.selected)
      });
      this.batchThroughSetRoleModal = true;
    },
    handleSelect(params){
      console.log(params)
    }
  },
  components : {
    RejectModal
  },
  created() {
      console.log(this.$route.params);
      this.userOrMerchant = this.$route.params.who;
      if(this.userOrMerchant == 'user') {
            this.pager.filters = [
                {"key":"verified","operator":"=","value":-1,"join":"and"},
                {"key":"recordStatus","operator":"=","value":1,"join":"and"},
                {"key":"rightfulStatus","operator":"=","value":1,"join":"and"},
                {"key":"phone","operator":"=","value":'',"join":"and"},
                {"key":"name","operator":"=","value":'',"join":"and"},
                {"key":"createTime","operator":">=","value":'',"join":"and"},
                {"key":"createTime","operator":"<","value":'',"join":"and"}
            ]
            getUserList(jiweiDevHost + '/trinity-backstage/user/list',{
                'priority': 5,
                'id_organization'   : 0,
                "data" : {
                "list_type" : 1,
                "pager" : this.pager,
                }
            })
            .then(
                res =>
                {
                    console.log('getUserList_res:')
                    console.log(res);
                    if(res.status && res.status == 200 && res.data.code == 0) {
                        let getUserListResData = res.data.data;
                        //当前页码
                        this.pager.page_index = getUserListResData.page.oage_index;
                        //总页数
                        this.pager.total_count = getUserListResData.page.total_count;
                        getUserListResData.list.forEach(
                            (item,key) => {
                                item.option = {
                                    'selected' : false
                                };
                                item.createDate = item.createDate.split(' ')[0];
                                switch (item.verified)
                                {
                                    case -1:
                                        item.certificationStatus = '待审核';
                                        break;
                                    case 0:
                                        item.certificationStatus = '未通过';
                                        break;
                                    default:
                                        item.certificationStatus = '通过';

                                };

                                if(item.rightful_status == 1) {
                                    item.accountStatus = '启用'
                                }
                                else{
                                    item.accountStatus = '禁用'
                                }
                            }
                        )
                        this.tableData = getUserListResData.list;
                    }
                    else {
                        this.$Message.error({
                            content : '网络异常，请联系管理员及时处理',
                            duration: 5,
                            closable: true
                        })
                    }
                }
            )
            .catch(
                err =>
                {
                    console.log(err);
                    this.$Message.error({
                        content : err && err.msg ? err.msg: '网络错误',
                        duration: 5,
                        closable: true
                    });
                }
            )
      }
      else {    //大商户 - 待审核【小】商户列表
                if(localStorage.getItem('organization_level') == 1){
                    this.pager.filters = [
                        {"key":"parentIdOrganization","operator":"=","value":localStorage.getItem('fid_organization'),"join":"and"},
                        {"key":"verified","operator":"=","value":-1,"join":"and"},
                        {"key":"recordStatus","operator":"=","value":1,"join":"and"},
                        {"key":"rightfulStatus","operator":"=","value":1,"join":"and"},
                        {"key":"createDate","operator":">=","value":"","join":"and"},
                        {"key":"createDate","operator":"<","value":"","join":"and"},
                        {"key":"organizationName","operator":":","value":"","join":"and"}
                    ]
                }
                else{
                    this.$Message.error({
                        content : '异常',
                        duration: 5,
                        closable: true
                    })
                }
                getOrgList(baseUrl + '/trinity-backstage/organization/list',
                  {
                      'priority': 5,
                      'id_organization'   : 0,
                      'data'    : {
                          "list_type" : 0,
                          "pager" : this.pager
                        //   "pager" : {
                        //     'page_index': 1,
                        //     'page_size' : 20
                        //   },
                        //   "filters":this.pager.filters
                      }
                  }
                )
                .then(res => {
                    console.log(res)
                    if(res.status && res.status == 200 && res.data.code == 0) {
                        console.log("res.data:");
                        console.log(res.data)
                        let data             = res.data.data;

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
      }
  }
}
</script>
<style>
.ivu-modal-wrap{
  overflow: hidden !important;
}
</style>

<style>
.time-con .ivu-date-picker-rel .ivu-input-wrapper .ivu-input{
  width:14vw !important;
  height:36px !important;
  background:rgba(255,255,255,0.2);
  border-radius:6px;
  border:1px solid #1CA1C6;
  font-size: 13px;
  color : #999 !important;
  text-align : left;
  text-indent : 1em;
  outline : none;
}
.time-con{
  width:14vw !important;
  height:36px !important;
  margin-right : 1vw;
}
.time-con .ivu-icon-ios-calendar-outline:before {
  content : ''
}
.time-con .ivu-date-picker-cells-cell-selected em, .time-con .ivu-date-picker-cells-cell-selected:hover em {
  background:linear-gradient(180deg,rgba(59,165,178,1) 0%,rgba(72,168,218,1) 100%);
}
.time-con .ivu-time-picker-cells-cell-selected,.time-con .ivu-time-picker-cells-cell-selected:hover {
  color : #fff;
  background:linear-gradient(180deg,rgba(59,165,178,1) 0%,rgba(72,168,218,1) 100%);
}
.time-con .ivu-btn-primary {
    background:linear-gradient(180deg,rgba(59,165,178,1) 0%,rgba(72,168,218,1) 100%);
    border-color : #1CA1C6;
}
.time-con .ivu-btn-primary .ivu-btn:hover {
  color : #1CA1C6 !important;
}
.time-con .ivu-date-picker-rel .ivu-input-wrapper .ivu-icon{
  /* display : none !important; */
            position: absolute;
            right: 4px;
            bottom: 13px;
            content: '';
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid #4A4A4A;
}
.table .operation-left-two {
  background-size: cover;
  background-position: center;
}
.table .operation-left-two-word {
  margin-left:-18px;
  margin-right : 5px;
}
.table .verify {
  background-image: url('./../../assets/images/checklist/verify.png');
  @media only screen and (-moz-min-device-pixel-ratio: 2),
  only screen and (-o-min-device-pixel-ratio: 2/1),
  only screen and (-webkit-min-device-pixel-ratio: 2),
  only screen and (min-device-pixel-ratio: 2) {
    background-image: url('./../../assets/images/checklist/verify@2x.png');
  }
}
.table .ivu-table-header .ivu-table-cell {
  font-size : 14px;
  font-weight : bold;
  color: #4A4A4A;
}
.table .radio-list {
  width : 16px;
  height : 16px;
  border-radius : 50%;
  border : 1px solid #979797;
  display : flex;
  justify-content : center;
  align-items : center;
}
.table .radio-list .checked-radio {
  border-radius : 50%;
  background:linear-gradient(180deg,rgba(59,165,178,1) 0%,rgba(72,168,218,1) 100%);
}
.table .operation-con {
  width : 250px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}
.table .operation-con button{
  /* margin : 0 10px; */
}
/* .table .radio-con {
  position : relative;
} */
.table .radio-selected-list {
  position: relative;
  top: -14px;
  left: 2px;
  width : 12px;
  height : 12px;
  border-radius : 50%;
  background:linear-gradient(180deg,rgba(59,165,178,1) 0%,rgba(72,168,218,1) 100%);
}
.list-con footer .right li {
  width: 32px;
  height : 32px;
  border-radius : 50%;
}
.list-con footer .right .ivu-page-prev {
  content : '';
  background-size: cover;
  background-position : center;
  background-image : url('./../../assets/icons/pager/prev.png')
}
.list-con footer .right .ivu-page-prev a {
 visibility: hidden;
}
</style>

<style lang="scss" scoped>
.list-con {
  width : 100%;
  height: 100%;
  user-select: none;
  padding : 2.5%;
  .title {
    width : 100%;
    height : 25px;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    .verticle-line {
      width:4px;
      height:24px;
      background:linear-gradient(180deg,rgba(67,170,246,1) 0%,rgba(63,128,247,1) 100%);
      margin-right: 12px;
    }
    .title-word {
      width:72px;
      height:25px;
      font-size:18px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(74,74,74,1);
      line-height:25px;
    }
  }
  .search-con {
    margin : 12px 0;
    width : 100%;
    height : 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    // background-color: blue;
    .input-con {
      .input{
        width:14vw !important;
        height:36px !important;
        background:rgba(255,255,255,0.2);
        border-radius:6px;
        border:1px solid #1CA1C6;
        font-size: 13px;
        color : #999;
        text-align : left;
        text-indent : 1em;
        outline : none;
        margin-right : 1vw;
      }
    }
    // 查询
    .button {
      width:160px;
      @media screen and (max-width: 800px) {
        width : 14vw;
      }
      height:36px;
      background:linear-gradient(180deg,rgba(59,165,178,1) 0%,rgba(72,168,218,1) 100%);
      border-radius:4px;
      border:1px solid #1CA1C6;
      font-size:18px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(255,255,255,1);
      line-height:36px;
      letter-spacing : 3px;
      cursor : pointer;
    }
  }
  footer {
    margin : 2vh 0;
    // position: fixed;
    // bottom : 10px;
    display : flex;
    flex-direction : row;
    justify-content : space-between;
    align-items: center;
    width : 100%;
    height : 32px;
    .left {
        display : flex;
        flex-direction : row;
        justify-content : left;
        align-items: center;
        font-size : 16px;
        .batch-through {
          color : #2CA7C9;
          cursor: pointer;
          user-select: none;
        }
        .select-all-container {
            cursor: pointer;
            margin-right: 10px;
            color : #4A4A4A;
            .radio-list {
              width : 16px;
              height : 16px;
              border-radius : 50%;
              border : 1px solid #979797;
              display : flex;
              justify-content : center;
              align-items : center;
              .checked-radio {
                width : 10px;
                height : 10px;
                border-radius : 50%;
                background:linear-gradient(180deg,rgba(59,165,178,1) 0%,rgba(72,168,218,1) 100%);
              }
            }
            display: flex;
            flex-direction: row;
            height: 16px;
            align-items: center;
            // .select-all-icon {
            //   width:16px;
            //   height : 16px;
            //   border: 1px solid #979797;
            //   border-radius : 50%;
            // }
            // .selected {
            //   background:linear-gradient(180deg,rgba(59,165,178,1) 0%,rgba(72,168,218,1) 100%);
            // }
            // 全选
            .select-all-word {
              margin-left: 3px;
              user-select: none;
            }
        }
    }
    .right {
    }
  }
}
</style>


