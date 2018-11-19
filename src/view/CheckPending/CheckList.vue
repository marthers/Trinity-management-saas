<template>
    <div class = "list-con">
        <header class= "title">
            <div class = "verticle-line"></div>
            <div class = "title-word">{{title}}</div>
        </header>
        <div class = "search-con">
            <div class = "input-con">
                <input type="text" :placeholder="namePlaceholder" maxlength="10" v-model.trim = "nameVal" class = "input">
                <input type="text" :placeholder="groupPlaceholder" maxlength="10" v-model.trim = "groupVal" class = "input">
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
            <button class = "button" @click.syop.prevent = "submitSearch">查询</button>
        </div>
        <Table
          :columns="tableColumn"
          ref = "tableSelection"
          class = "table"
          :data="tableData"></Table>
        <footer>
            <div class = "left">
                <div @click.stop.prevent="handleSelectAll" class = "select-all-container">
                    <!-- <div :class = "{tableSelect%2 > 0 ? 'selected' : '','select-all-icon'}"></div> -->
                    <!-- <div class = "select-all-icon"></div> -->
                    <Radio
                      :value="selectAllRadio"
                      :true-value = "selectAllTrue"
                      :false-value = "selectAllFalse"
                      @on-change = "selectAllRadioChange">全选</Radio>
                    <!-- <div class = "select-all">全选</div> -->
                </div>
                <div class = "batch-through" @click.stop.prevent = "batchThrough">批量通过</div>
            </div>
            <!-- <div class = "right"></div> -->
            <Page :total="100" class = "right"/>
        </footer>
    </div>
</template>
<script>
export default {
  name : 'CheckList',
  data() {
    return {
      // tableSelect : 0,
      selectAllRadio : false,
      selectAllTrue : false,
      selectAllFalse : true,
      title : '员工审核',
      namePlaceholder : '用户名',
      nameVal : '',
      groupPlaceholder : '用户组',
      groupVal : '',
      startTime : '',
      endTime : '',
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
              render: (h, params) => {
                  return h('div', [
                      // h('Icon', {
                      //     props: {
                      //         type: 'md-checkmark-circle'
                      //     }
                      // }),
                      // h('strong', params.row.name)
                      // 'class' : {
                      //    'radio-con' : true
                      // },
                      // on: {
                      //     click: () => {
                      //       params.row.option.selected = !params.row.option.selected
                      //     }
                      // }
                      h('div', {
                          'class': {
                              'radio-list' : true,
                              'radio-con' : params.row.option.selected,
                          },
                          on: {
                              click: () => {
                                params.row.option.selected = !params.row.option.selected
                              }
                          },
                          'attrs' : {
                            'visibility' : !params.row.option.selected ? 'visible' : 'hidden'
                            // 'checked' : params.row.option.selected
                          }
                      }),
                      // h('radio', {
                      //     'class': {
                      //         // 'radio-list' : true,
                      //         // 'radio-selected-list' : params.row.option.selected,
                      //     },
                      //     'attrs' : {
                      //       'visibility' : params.row.option.selected ? 'visible' : 'hidden',
                      //       'checked' : params.row.option.selected
                      //     },
                      //     on: {
                      //         click: () => {
                      //           params.row.option.selected = !params.row.option.selected
                      //         }
                      //     },
                      // })
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
              type : 'index'
          },
          {
              title: '用户账号',
              key: 'account'
          },
          {
              title: '商户身份',
              key: 'identity'
          },
          {
              title: '商户编号',
              key: 'serialNumber'
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
              key: 'registerTime'
          },
          {
              title: '操作',
              key: 'operation',
              render: (h, params) => {
                  return h('div', [
                      h('Icon', {
                          props: {
                              type: params.row.operation.validate ? 'md-checkmark-circle' : 'md-close-circle',
                              content : '验证'
                          }
                      }),
                      h('span', {
                          props: {
                            slot : 'content'
                          },
                          // [
                          //   {
                          //   }
                          // ]
                      },'验证'),
                      h('Button', {
                          props: {
                              type: 'error',
                              size: 'small'
                          },
                          on: {
                              click: () => {
                                  this.getDetail(params)
                              }
                          }
                      }, '详情')
                  ]);
              }
          },
          {
              title: '/\s/',
              key: 'check',
              render: (h, params) => {
                  return h('div', [
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
          }
      ],
      tableData : [
        {
          order : 1,
          option : {
              selected : false
          },
          account : '18301437032',
          identity : '运营商',
          serialNumber : '228998',
          certificationStatus : '待审核',
          accountStatus : '正常',
          registerTime : '2017-6-5 12:22:04',
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
          account : '18301437032',
          identity : '运营商',
          serialNumber : '228998',
          certificationStatus : '待审核',
          accountStatus : '正常',
          registerTime : '2017-6-5 12:22:04',
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
          account : '18301437032',
          identity : '运营商',
          serialNumber : '228998',
          certificationStatus : '待审核',
          accountStatus : '正常',
          registerTime : '2017-6-5 12:22:04',
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
          account : '18301437032',
          identity : '运营商',
          serialNumber : '228998',
          certificationStatus : '待审核',
          accountStatus : '正常',
          registerTime : '2017-6-5 12:22:04',
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
          account : '18301437032',
          identity : '运营商',
          serialNumber : '228998',
          certificationStatus : '待审核',
          accountStatus : '正常',
          registerTime : '2017-6-5 12:22:04',
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
          account : '18301437032',
          identity : '运营商',
          serialNumber : '228998',
          certificationStatus : '待审核',
          accountStatus : '正常',
          registerTime : '2017-6-5 12:22:04',
          operation : {
            validate : true,
            beenChecked : true,
            pass : true
          }
        }
      ]
    }
  },
  methods : {
    getDetail(params) {
      console.log(params)
    },
    approve(index,h) {
      console.log(index);
      console.log(h)
    },
    reject(index) {
      console.log(index)
    },
    selectAllRadioChange() {
      console.log(`this.selectAllRadio=${this.selectAllRadio}`)
      // this.selectAllRadio = !this.selectAllRadio
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
      this.tableSelect ++;
      // if(this.tableSelection%2 > 0) {
        this.$refs.tableSelection.selectAll(this.tableSelect%2 > 0)
      // }
    },
    //批量通过
    batchThrough() {

    }
  }
}
</script>
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
  /* display : flex;
  justify-content : center;
  align-items : center; */
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
</style>
<style lang="scss" scoped>
.list-con {
  width : 100%;
  height: 100%;
  // background-color: pink;
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
      width:14vw;
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
        }
        .select-all-container {
          color : #4A4A4A;
          .select-all-icon {
            width:16px;
            height : 16px;
            border: 1px solid #979797;
            border-radius : 50%;
          }
          .selected {
            background:linear-gradient(180deg,rgba(59,165,178,1) 0%,rgba(72,168,218,1) 100%);
          }
        }
    }
  }
}
</style>


