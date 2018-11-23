<template>
    <div class = "reject-con" v-if = "rejectModalShow">
        <Modal v-model="show" class-name = "reject-modal" :closable = "false">
            <p slot="header" class = "header" @click.stop.prevent = "closeModal">
                关闭
            </p>
            <div class = "modal-body">
                <div class = "select-con" v-if = "noPass">
                    <h4 class = "reject-reason-title">请选择不通过理由</h4>
                    <div class = "reason-con">
                        <div v-for = "(item,index) in reasonsArr" :key = "index" :class = "{  'selected' : item.selected,'select-box':true}" @click.stop.prevent = "item.selected = !item.selected">
                            {{item.name}}
                        </div>
                    </div>
                </div>
                <div class = "edit-con" v-if = "noPass">
                    <div class = "left">其他理由：</div>
                    <Input v-model.trim="reasonsWritten" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入其他理由（选填）"  class = "right" clearable />
                </div>
                <h4 class = "reject-reason-title" v-if = "!noPass">
                    设置角色
                </h4>
                <div class = "role-con" v-for = "(item,index) in roleArr" :key = "index" @click.stop.prevent = "selectedRole = item.roleName"  v-if = "!noPass">
                    <div :class = "{'option-con' : true,'role-selected' : selectedRole == item.roleName}">
                        <div class = "option" v-if = "selectedRole == item.roleName"></div>
                    </div>
                    <div class = "role-name">
                        {{
                            item.roleName
                        }}
                    </div>
                </div>
            </div>
            <div slot="footer" class = "footer">
                <button class = "cancel" @click.stop.prevent = "closeModal">
                    取消
                </button>
                <button class = "confirm" @click.stop.prevent = "closeModal">
                    确认
                </button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
  name : 'RejectModal',
  data() {
    return {
        selectedRole : '',
        roleArr : [
            {
                roleName : '管理员'
            },
            {
                roleName : '管理员2'
            },
            // {
            //     roleName : '管理员3'
            // },
            // {
            //     roleName : '管理员4'
            // },
            // {
            //     roleName : '管理员5'
            // },
            // {
            //     roleName : '管理员7'
            // },
            {
                roleName : '运营商'
            },
            {
                roleName : '代理商'
            }
        ],
      show : true,
      reasonsWritten : '',
      reasonsArr : [
        {
          selected : false,
          name : '信息不全'
        },
        {
          selected : false,
          name : '拒绝'
        },
        {
          selected : false,
          name : '不过'
        },
        {
          selected : false,
          name : '虚假信息'
        },
        {
          selected : false,
          name : '信息不实'
        },
        {
          selected : false,
          name : '营业执照上传模糊'
        },
        {
          selected : false,
          name : '身份信息无法对应'
        },
        {
          selected : false,
          name : '有误'
        },
        {
          selected : false,
          name : '其他'
        },
        {
          selected : false,
          name : '人品问题'
        }
      ]
    }
  },
  props : {
    rejectModalShow : {
      type : Boolean,
      default : false
    },
    noPass : {
        type : Boolean,
        default : false
    }
  },
  methods : {
    closeModal() {
      this.$emit('closeModal');
    }
  }
}
</script>

<style>
.reject-modal {
    width: 50vw;
    height: 50vh;
    position: fixed;
    top: 25%;
    left: 25%;
}
.reject-modal .ivu-modal{
    width: 50vw !important;
    height: 50vh;
}
.reject-modal .ivu-modal .ivu-modal-content {
  width : 100%;
  height : 100%;
}
.right .ivu-input {
  border : 1px solid #1CA1C6;
}
.reject-modal .ivu-modal-body {
    width : 100%;
    border-top : 1px solid #DEDEDE;
    min-height: 20vh;
    max-height: 29vh;
    overflow-y: auto;
}
.reject-modal .ivu-modal-body .select-con {
  width : 100%;
}
.reject-modal .ivu-modal-body .edit-con {
  width : 100%;
  display: flex;
  flex-direction: row;
}
.reject-modal .ivu-modal-body .edit-con .left {
  width : 20%;
  font-size : 14px;
  color: #4A4A4A;
}
.reject-modal .ivu-modal-body .edit-con .right {
  width : 80%;
}
.reject-modal .ivu-modal-body .select-con .reject-reason-title {
  font-size: 18px;
  font-weight: bold;
  color : #4A4A4A;
}
.reject-modal .ivu-modal-body .select-con .reason-con {
  width : 95%;
  margin : 10px 2.5%;
}
.reject-modal .ivu-modal-body .modal-body  .role-con {
  width : 95%;
  margin : 14px 2.5%;
  display: flex;
  flex-direction: row;
  justify-content: left;
  height : 18px;
  align-items: center;
  cursor: pointer;
}
.reject-modal .ivu-modal-body  .role-con .option-con {
    width : 14px;
    height: 14px;
    border-radius: 50%;
    border:1px solid #979797;
    display: flex;
    justify-content: center;
    cursor: pointer;
    align-items: center;
}
.reject-modal .ivu-modal-body  .role-con .role-selected {
    border-color: #48A8DA;
}
.reject-modal .ivu-modal-body  .role-con .option-con .option{
    width : 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #48A8DA;
    /* margin : 2.5px; */
}
.reject-modal .ivu-modal-body  .role-con .role-name {
    margin-left: 8px;
    font-size : 16px;
    color : #4A4A4A;
    cursor: pointer;
}
.reject-modal .ivu-modal-body .select-con .reason-con .select-box {
  height:32px;
  display: inline-block;
  background:rgba(255,255,255,1);
  border-radius:6px;
  border:1px solid #9B9B9B;
  line-height: 14px;
  font-size: 12px;
  color : #4A4A4A;
  padding : 9px;
  margin : 5px;
  text-align: center;
  user-select: none;
  cursor: pointer;
  /* width : 100px; */
}
.reject-modal .ivu-modal-body .select-con .reason-con .selected {
  background:rgba(72,168,218,1);
  color : #fff;
  border:1px solid #1CA1C6;
}
.reject-modal .ivu-modal-body .modal-body {
  width : 95%;
  /* border : 2px solid green; */
  margin : 0 auto;
}
.reject-modal .ivu-modal-footer{
    width : 100%;
}
.reject-modal .ivu-modal-footer .footer{
    width : 100%;
    text-align: center;
    font-size : 18px;
    font-weight: bold;
}
.reject-modal .ivu-modal-footer .footer button {
    outline: none;
    user-select: none;
    cursor: pointer;
    width : 13vw;
    height: 36px;
    text-align: center;
    line-height: 36px;
    margin-right: 1vw;
    border-radius : 4px;
}
.reject-modal .ivu-modal-footer .footer .cancel:hover {
    /* border-color: #1CA1C6; */
    color : #fff;
    background-color: #48A8DA;
    border : 1px solid #48A8DA;
}
.reject-modal .ivu-modal-footer .footer .cancel {
    color : #4A4A4A;
    border : 1px solid #DEDEDE;
    background-color: #fff;
}
.reject-modal .ivu-modal-footer .footer .confirm {
    color : #fff;
    background-color: #48A8DA;
    border : 1px solid #48A8DA;
}
.reject-modal .header{
  width:28px;
  height:20px;
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:#48A8DA;
  line-height:20px;
}
.reject-modal .ivu-modal-header {
  text-align: right;
  border : none;
}
.reject-modal .ivu-modal-footer{
  border : none;
}
</style>

<style lang="scss" scoped>
.reject-con {
  width : 100%;
  height : 100%;
  font-size : 14px;
}
</style>

