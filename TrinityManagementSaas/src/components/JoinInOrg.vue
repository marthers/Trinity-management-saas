<template>
    <div class = "orgs-con" v-if = "JoinInOrgShow">
        <header class = "header">
            <div class = "left"></div>
            <div class="right">
                {{
                    title
                }}
            </div>
        </header>
        <Input 
            search 
            enter-button 
            v-model.trim = "searchContent"
            placeholder="搜索您想选择的商户关键字" 
            @on-enter = "searchEnter"
            @on-search = "searchEnter"
            @on-keyup = "searchContent=searchContent.replace(/(^\s+)|(\s+$)/g,'')"
            class = "search"/>
        <scroller 
            :on-refresh="pulldown"
            height = "80%"
            :on-infinite="pullup"
            class="wrapper" ref="scrollWrapper">
            <div class = "list-con">
                <div :class = "[index%2 == 0 ? 'single' : 'double',selectedIndex == index ? 'selected' : 'not-selected' ,'item-con']" v-for = "(item,index) in orgList" :key = "index" @click.stop.prevent = "selectedIndex = index">
                    {{
                        item.organizationName
                    }}
                </div>
            </div>
        </scroller>
        <!-- <div :pullup = "pullup" :pulldown = "pulldown"> -->
        <footer>
            <div class = "back" @click.stop.prevent = "backToIndex">返回</div>
            <div class = "submit" @click = "submitChoose">确定</div>
        </footer>
    </div>
</template>
<script>
import {getOrgList} from '@/api/org/org.js';
import baseConfig from '@/config/index';
const baseUrl = baseConfig.baseUrl.localOrgHost;
import {
    filterStr
} from '@/libs/filter.js';
  export default {
    data() {
      return {
            title : '',
            onlyChooseOrg : false,
            selectedIndex : -1,
            searchContent : '',
            // orgList : [],
            page_index : 1,
            page_size : 20,
            // total_pages : 100
      }
    },
    props : {
        JoinInOrgShow : {
            type : Boolean,
            default : false
        },
        orgList : {
            type : [Object,Array],
            default : () => {
                return []
            }
        },
        // page_index : {
        //     type : Number,
        //     default : 1
        // },
        total_pages : {
            type : Number,
            default : 10000
        }
    },
    methods: {
        pullup () {
            console.log(`this.total_pages=${this.total_pages}`);
            console.log(`this.page_index =${this.page_index }`)
            console.log(this.$refs.scrollWrapper);
            if(this.page_index < this.total_pages) {
                ++this.page_index
                console.log(`this.page_index=${this.page_index}`)
                console.log(`this.page_index=${this.page_index}`)
                let self = this
                this.$nextTick(() => {
                    getOrgList(baseUrl + '/trinity-backstage/organization/list',
                    {
                        'priority': 5,
                        'group'   : 0,
                        'data'    : {
                            'page_index' :this.page_index,
                            'page_size' : this.page_size
                        }
                    })
                    .then(res => {
                        console.log(res)
                        if(res.status && res.status == 200 && res.data.code == 0) {
                            console.log("res.data:");
                            console.log(res.data)
                            let data = res.data.data;
                            console.log("this.orgList:")
                            console.log(this.orgList)
                            self.orgList = self.orgList.concat(data.organization_list);
                            self.$refs.scrollWrapper.finishInfinite(false);
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
            }
            else {
                // debugger
                this.$refs.scrollWrapper.finishInfinite(true);
            }
        },
        pulldown () {
            console.log(this.$refs.scrollWrapper);
            this.page_index = 1;
            let self = this
            getOrgList(baseUrl + '/trinity-backstage/organization/list',
            {
                'priority': 5,
                'group'   : 0,
                'data'    : {
                    'page_index' :this.page_index,
                    'page_size' : this.page_size
                }
            })
            .then(res => {
                console.log(res)
                if(res.status && res.status == 200 && res.data.code == 0) {
                    // this.$refs.scrollWrapper.triggerPullToRefresh()
                    console.log("res.data:");
                    console.log(res.data)
                    let data = res.data.data;
                    console.log("this.orgList:")
                    console.log(this.orgList)
                    self.orgList = data.organization_list
                    this.$refs.scrollWrapper.finishInfinite(false);
                    setTimeout(() => {
                        this.$refs.scrollWrapper.finishPullToRefresh();
                    },200)
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
        },
        searchEnter() {
            this.searchContent = filterStr(this.searchContent).replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/\s/g,'');
            console.log(`this.searchContent=${this.searchContent}`);
            let filters = [{
                'key' : 'organizationName',
                'operator' : ':',
                'value' : this.searchContent,
                'join'  : 'and'
            }];
            // getOrgList(baseUrl + '/trinity-backstage/organization/list',
            // {
            //     'priority': 5,
            //     'group'   : 0,
            //     'data'    : {
            //         'page_index' :1,
            //         'page_size' : this.page_size,
            //         'filters' : filters
            //     }
            // })
            // .then(res => {
            //     console.log(res)
            //     if(res.status && res.status == 200 && res.data.code == 0) {
            //         // this.$refs.scrollWrapper.triggerPullToRefresh()
            //         console.log("res.data:");
            //         console.log(res.data)
            //         let data = res.data.data;
            //         console.log("this.orgList:")
            //         console.log(this.orgList)
            //         this.orgList = []
            //         this.orgList = data.organization_list
            //         // this.$refs.scrollWrapper.finishInfinite(false);
            //         setTimeout(() => {
            //             this.$refs.scrollWrapper.finishPullToRefresh();
            //         },200)
            //     }
            //     else{
            //         this.$Message.error({
            //             content : '网络异常，请联系管理员及时处理',
            //             duration: 5,
            //             closable: true
            //         })
            //     }
            // })
            // .catch(err => {
            //     console.log(err);
            //     this.$Message.error({
            //         content : '网络异常，请联系管理员及时处理',
            //         duration: 5,
            //         closable: true
            //     })
            // })
        },
        backToIndex() {
            this.$emit('chooseOrgBack')
            this.selectedIndex = -1;
            this.searchContent = ''
        },
        submitChoose() {
            console.log(`this.selectedIndex=${this.selectedIndex}`);
            console.log(this.orgList)
            if(this.selectedIndex != -1) {
                this.$emit('superior-selected',this.orgList[this.selectedIndex]);
            }
            this.selectedIndex = -1;
            this.searchContent = '';
            this.$emit('chooseOrgBack');
        }
    },
    components : {
        // VueScroller
    },
    created() {
        // console.log(`baseUrl=${baseUrl}`)
    },
    mounted() {
        this.onlyChooseOrg = true;
        if(this.onlyChooseOrg) {
            this.title = '选择加盟商户（平台和大商户）'
        }else{
            this.title = '选择加入商户（平台、大商户、商户所有'
        };
    }
  }
</script>

<style lang = "less" scoped>
.orgs-con {
    width : 100%;
    height : 100%;
    padding : 20px;
    .header {
        width          : 100%;
        height         : 36px;
        display        : flex;
        justify-content: left;
        align-items    : center;
        margin : 20px 0;
        .left {
            width       : 4px;
            height      : 36px;
            background  : linear-gradient(180deg,rgba(67,170,246,1) 0%,rgba(63,128,247,1) 100%);
            margin-right: .625rem /* 10/16 */;
        }
        .right {
            max-width  : 80%;
            font-size  : 18px;
            height     : 36px;
            line-height: 36px;
            text-align : center;
        }
    }
    .search {
        margin : 20px 0;
        .ivu-input-search{
            background-color : #48A8DA !important;
        }
    }
    .wrapper {
        width : 100% !important;
        height : 80% !important;
        overflow : hidden;
        position : unset;
        /* overflow-y : auto; */
        .list-con {
            width : 100%;
            height : 100%;
            overflow : hidden;
            overflow-y : auto;
            border : 1px solid #DEDEDE;
            .item-con {
                width : 100%;
                height : 48px;
                line-height : 48px;
                text-align : left;
                text-indent : 60px;
                cursor : pointer;
                color : #4A4A4A;
            }
            /* .item-con:hover {
                background:rgba(72,168,218,1);
                color : #fff;
            } */
            .selected {
                background:rgba(72,168,218,1) !important;
                color : #fff !important;
            }
            .single {
                background : #FFF;
            }
            .double {
                background:rgba(222,222,222,0.2);
            }
        }
        .list-con::-webkit-scrollbar {/*滚动条整体样式*/
            width:6px;
            height:6px;
            background:rgba(222,222,222,1);
            border-radius:6px;
        }
        .list-con::-webkit-scrollbar-thumb {
            width:39px;
            /* height:6px; */
            background:rgba(72,168,218,1);
            border-radius:3px;
        }
        /*滚动条里面轨道*/
        .list-con::-webkit-scrollbar-track {
            width:6px;
            /* height:100%; */
            background:rgba(222,222,222,1);
            border-radius:6px;
        }
    }

    footer{
        margin-top : 40px;
        width : 100%;
        height : 38px;
        justify-content : left;
        align-items : center;
        display : flex;
        flex-direction : row;
        div {
            width:160px;
            height:36px;
            line-height :36px;
            text-align : center;
            background:rgba(255,255,255,1);
            border-radius:4px;
            border:1px solid #DEDEDE;
            font-size : 18px;
            color : #4A4A4A;
            margin-right: 30px;
            cursor : pointer;
        }
        .submit {
            color : #FFF;
            background-color : #48A8DA;
        }
    }
}
</style>