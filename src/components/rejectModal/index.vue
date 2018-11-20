<template>
    <div class = "reject-con" v-if = "rejectModalShow">
        <Modal v-model="show" class-name = "reject-modal" :closable = "false">
            <p slot="header" class = "header" @click.stop.prevent = "closeModal">
                关闭
            </p>
            <div class = "modal-body">
                <div class = "select-con">
                    <h4 class = "reject-reason-title">请选择不通过理由</h4>
                    <div class = "reason-con">
                        <div v-for = "(item,index) in reasonsArr" :key = "index" :class = "{  'selected' : item.selected,'select-box':true}" @click.stop.prevent = "item.selected = !item.selected">
                            {{item.name}}
                        </div>
                    </div>
                </div>
                <div class = "edit-con">
                    <div class = "left">其他理由：</div>
                    <Input v-model.trim="reasonsWritten" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入其他理由（选填）"  class = "right"/>
                </div>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long >Delete</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
  name : 'RejectModal',
  data() {
    return {
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
.reject-modal .ivu-modal-body .select-con .reason-con .select-box {
  height:32px;
  display: inline-block;
  background:rgba(255,255,255,1);
  border-radius:6px;
  border:1px solid #9B9B9B;
  line-height: 14px;
  font-size: 14px;
  color : #4A4A4A;
  padding : 9px;
  margin : 5px;
  text-align: center;
  user-select: none;
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

