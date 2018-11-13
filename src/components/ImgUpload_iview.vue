<template>
    <div>
        <div class="demo-upload-list" v-for="(item,index) in uploadList" :key = "index">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload
                                                                            ref              = "upload"
                                                                          :show-upload-list  = "false"
                                                                          :default-file-list = "defaultList"
                                                                          :on-success        = "handleSuccess"
                                                                          :format            = "['jpg','jpeg','png']"
                                                                          :max-size          = "maxSize"
                                                                          :on-format-error   = "handleFormatError"
                                                                          :on-exceeded-size  = "handleMaxSize"
                                                                          :on-error          = "uploadError"
                                                                          :before-upload     = "handleBeforeUpload"
                                                                            multiple         = "multiple"
                                                                            type             = "drag"
                                                                            action           = "uploadAction"
                                                                            style            = "display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
            </div>
                <!-- <div class = "img-not-uploaded-box">
                    <div class = "img-not-uploaded"></div>
                </div> -->
        </Upload>
        <Modal title="View Image" v-model="visible">
            <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                defaultList: [
                    {
                        'name': 'a42bdcc1178e62b4694c830f028db5c0',
                        'url' : 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
                    },
                    {
                        'name': 'bc7521e033abdd1e92222d733590f104',
                        'url' : 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
                    }
                ],
                imgName   : '',
                visible   : false,
                uploadList: []
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
            }
        },
        methods: {
            handleView (name) {
                console.log(`name=${name}`)
                this.imgName = name;
                this.visible = true;
            },
            handleRemove (file) {
                console.log('handleRemove' + 'file:')
                console.log(file);
                console.log('this.$refs.upload:')
                console.log(this.$refs.upload)
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file) {
                file.url  = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
                file.name = '7eb99afb9d5f317c912f08b5212fd69a';
            },
            handleFormatError (file) {
                console.log('handleFormatError' + 'file:')
                console.log(file)
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc : 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleMaxSize (file) {
                console.log('handleMaxSize' + 'file:')
                console.log(file)
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc : 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            },
            handleBeforeUpload () {
                const check = this.uploadList.length  > this.maxNum;
                if (!check) {
                    this.$Notice.warning({
                        title: '本次最多只能上传' + this.maxNum + '张照片'
                    });
                }
                return check;
            },
            //文件上传失败时候的钩子
            uploadError(err,file,fileList) {
                console.log('文件上传失败时候的钩子_err:');
                console.table(err);
                this.$Notice.config({
                    top     : 500,
                    duration: 3
                });
                this.$Notice.error({
                    title: err.status ? err.status  : '上传失败！',
                    desc : err.message ? err.message: '上传失败，请及时联系管理员'
                });
                console.log(file);
                console.log(fileList);
            }
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
        }
    }
</script>
<style lang = "less" scoped>

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
            background-image   : url('./../assets/images/noData/imgNotUploaded.png');
            @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
                background-image: url('./../assets/images/noData/imgNotUploaded@2x.png');
            }
            margin: 46.5px 88px;
        }
    }
    .demo-upload-list{
        display      : inline-block;
        width        : 60px;
        height       : 60px;
        text-align   : center;
        line-height  : 60px;
        border       : 1px solid transparent;
        border-radius: 4px;
        overflow     : hidden;
        background   : #fff;
        position     : relative;
        box-shadow   : 0 1px 1px rgba(0,0,0,.2);
        margin-right : 4px;
    }
    .demo-upload-list img{
        width : 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display   : none;
        position  : absolute;
        top       : 0;
        bottom    : 0;
        left      : 0;
        right     : 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color    : #fff;
        font-size: 20px;
        cursor   : pointer;
        margin   : 0 2px;
    }
</style>
