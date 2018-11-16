<template>
    <div>
        <label class = "upload-con" :for = "uploadId">
            <div :class = "[ beforeHasData ? 'before-has-data' : imgLen < maxNum ? 'img-not-uploaded' : 'has-uploaded']" ref = "hasUploaded" id= "has-uploaded"
            :style = "{backgroundImage: 'url(' + indentImg + ')'}">
                <input :id= "uploadId" type="file" class="upload-button" @change="addImg" ref="inputer" multiple accept="image/png,image/jpeg,image/jpg"/>
                <div class = "two-button" v-if = "imgLen >= maxNum">
                    <Icon type="ios-eye-outline" class= "i" @click.stop.prevent = "visible = true"></Icon>
                    <Icon type="ios-trash-outline" class= "i" @click.stop.prevent = "delImg"></Icon>
                </div>
            </div>
        </label>
        <Modal :title="modalTitle" v-model="visible">
            <img :src="getObjectURL(fil[0])" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        formData: new FormData(),
        imgs    : {},
        imgLen  : 0,
        visible : false
      }
    },
    props : {
        // 是否支持多选文件
        multiple : {
            type   : Boolean,
            default: false
        },
        //每一次最大上传数量
        maxNum : {
            type   : Number,
            default: 1
        },
        maxSize : {
            type   : Number,
            default: 1024*10
        },
        uploadAction : {
            type   : String,
            default: 'uploadAction'
        },
        modalTitle : {
            type   : String,
            default: 'view image'
        },
        uploadId : {
            type   : String,
            defalut: 'upload'
        },
        beforeHasData : {
            type : Boolean,
            default : false
        },
        indentImg : {
            type : String,
            default :""
        }
    },
    methods: {
      addImg(event){
          this.beforeHasData = false
          try {
                                    this.imgLen = 0;
                                let inputDOM    = this.$refs.inputer;
            // 通过DOM取文件数据
            this.fil = [];
            this.fil = inputDOM.files;
            console.log("this.fil:")
            console.log(this.fil)
            let len = this.fil.length
            if(len>this.maxNum){
                this.$Notice.warning({
                    title: '本次最多只能上传' + this.maxNum + '张照片'
                });
                return false;
            }
            for (let i=0; i < this.fil.length; i++) {
            let size = Math.floor(this.fil[i].size / 1024);
            if (size > this.maxSize) {
                this.$Notice.warning({
                    title: '本次最多只能上传' + this.maxSize/1024 + 'Mb的照片'
                });
                return false
            }
            this.imgLen++;
            this.$set(this.imgs,this.fil[i].name+'?'+new Date().getTime()+i,this.fil[i]);
            this.blobToDataURL(this.fil[i],base64 => {
                this.$emit('base64',base64)
            })
            console.log(this.$refs.hasUploaded)
                this.$refs.hasUploaded.style.backgroundImage = 'url(' + this.getObjectURL(this.fil[i]) + ')';
            }
          }
          catch(err) {
              console.log(err);
              this.$emit('addImgError',err);
          }
      },
      getObjectURL(file) {
        var url = null ;
        if (window.createObjectURL!=undefined) { // basic
          url = window.createObjectURL(file) ;
        } else if (window.URL!=undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file) ;
        } else if (window.webkitURL!=undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file) ;
        }
        return url ;
      },
        blobToDataURL(blob, callback) {
            let a        = new FileReader();
                a.onload = function (e) { callback(e.target.result); }
            a.readAsDataURL(blob);
        },
      delImg(){
        this.imgs   = {}
        this.imgLen = 0;
        this.$emit('deleteBase64')
      },
    },
    mounted() {
    }
  }
</script>
<style  scoped>
</style>
<style lang = "less" scoped>
.upload-imgs{margin: 10px 0 30px 0;overflow: hidden;font-size: 0;}
.upload-imgs li{position: relative;width: 118px;height: 118px;font-size: 14px;display: inline-block;padding: 10px;margin-right: 25px;border: 2px dashed #ccc;text-align: center;vertical-align: middle;}
/* .upload-imgs li:hover{border-color: $them-color;} */
.upload-imgs .add{display: block;background-color: #ccc;color: #ffffff;height: 94px;padding: 8px 0;}
.upload-imgs .add .iconfont{padding: 10px 0;font-size: 40px;}
/* .upload-imgs li: hover .add{background-color: $them-color;} */
.upload-imgs li .upload{position: absolute;top: 0;bottom: 0;left: 0;right: 0;width: 118px;height: 118px;}
.upload-imgs .img{position: relative;width: 94px;height: 94px;line-height: 94px;}
.upload-imgs .img img{vertical-align: middle;}
.upload-imgs .img .close{display: none;}
.upload-imgs li .img {
    width        : 240px;
    height       : 153px;
    background   : rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    border       : 1px solid #DEDEDE;
    cursor       : pointer;
}
.upload-imgs li:hover .img .close{
        display    : block;
        position   : absolute;
        right      : -6px;
        top        : -10px;
        line-height: 1;
        font-size  : 50px;
        color      : #aaa;
    }
.upload-con {
    width          : 240px;
    height         : 153px;
    background     : rgba(255,255,255,0.2);
    border-radius  : 6px;
    border         : 1px solid #DEDEDE;
    cursor         : pointer;
    display        : flex;
    justify-content: center;
    align-items    : center;
    .img-not-uploaded {
        width              : 64px !important;
        height             : 60px !important;
        background-size    : contain;
        background-position: center;
        /* background-image   : url('./../assets/images/noData/imgNotUploaded.png') !important; */
            background-image   : url('./../assets/images/upload.png') !important;
        @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
            background-image: url('./../assets/images/upload@2x.png') !important;
        }
        margin: 46.5px 88px;
        .upload-button {
            visibility: hidden;
        }
        .two-button{
            visibility: hidden;
            margin-top: 30px;
            .i{
                visibility: hidden;
                color     : #111 !important;
                font-size : 50px !important;
                cursor    : pointer !important;
                margin    : 0 2px !important;
            }
        }
    }
    .before-has-data {
        width              : 240px !important;
        height             : 153px !important;
        background-size    : contain;
        background-position: center;
        background-repeat  : no-repeat;
        .upload-button {
            visibility: hidden;
        }
        .two-button{
            visibility: hidden;
            margin-top: 30px;
            .i{
                visibility: hidden;
                color     : yellow !important;
                font-size : 50px !important;
                cursor    : pointer !important;
                margin    : 0 2px !important;
            }
        }
    }
    .has-uploaded{
        width              : 240px !important;
        height             : 153px !important;
        background-size    : contain;
        background-position: center;
        background-repeat  : no-repeat;
        .upload-button {
            visibility: hidden;
        }
        .two-button{
            visibility: hidden;
            margin-top: 30px;
            .i{
                visibility: hidden;
                color     : yellow !important;
                font-size : 50px !important;
                cursor    : pointer !important;
                margin    : 0 2px !important;
            }
        }
    }
}
.upload-con:hover {
    .two-button {
        visibility: visible;
        .i{
            visibility    : visible;
            -webkit-filter: brightness(.5);  //兼容不同浏览器
            -o-filter     : brightness(.5);
            -moz-filter   : brightness(.5);
            filter        : brightness(.5);  //设置亮度值，范围：0-1
        }
    }
}
</style>
