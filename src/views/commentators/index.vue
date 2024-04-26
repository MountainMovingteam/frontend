<template>
    <div class="common-layout">
        <el-container class="centered-content">
            <el-header class="header">
                <div class="input-container">
                    <!-- 搜索框 -->
                    <el-cascader v-model="select" :options="options" :props="props" collapse-tags collapse-tags-tooltip
                        clearable style="width: 40%;" />
                    <el-input v-model="input" style="max-width: 600px" placeholder="Please input" class="input-with-select">
                        <template #append>
                            <el-button @click="mySearch()">
                                <el-icon>
                                    <Search />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-input>
                </div>
                <!-- 功能按钮 -->
                <div style="width: 10%;"></div>
                <div>
                    <el-button type="red" class="hover-lighten" @click="this.deleteDialogVisible = true">清空讲解员</el-button>
                    <el-button type="success" class="hover-lighten" @click="exportAll()">导出讲解员 </el-button>
                    <el-button type="info" class="hover-lighten" @click="this.uploadDialogVisible = true">导入讲解员 </el-button>
                </div>
            </el-header>
            <el-main>
                <!-- 讲解员列表 -->
                <div>
                    <el-row v-for="(commentators, index) in filteredCommentators" :gutter="20" :key="index">
                        <el-col v-for="(commentator, index) in commentators" :key="index" :span="8">
                            <CommentatorCard :name="commentator.name" :num="commentator.num" :tag="commentator.tag"
                                :weekday="commentator.weekday" :session="commentator.session" />
                        </el-col>
                    </el-row>
                </div>

            </el-main>
            <div class="'dialogContainer'">
                <!-- 清空按钮dioloag -->
                <DeleteDialog v-model="deleteDialogVisible" :message="'此操作将永久删除所有讲解员, 是否导出当前讲解员?'" @exportAll="exportAll"
                    @cancel="cancelDelete" @deleteAll="deleteAll" @getCommentators="getCommentators"></DeleteDialog>
                <!-- 上传按钮dialog -->

                <Upload v-model="uploadDialogVisible" @exportAll="exportAll" @cancel="cancelUpload"></Upload>
                <!-- 添加按钮dialog -->
                <AddDialog @getCommentators="getCommentators"></AddDialog>
            </div>
        </el-container>
    </div>
</template>

<script>
import CommentatorCard from "./commentatorCard.vue";
import DeleteDialog from "./deleteDialog.vue";
import AddDialog from "./addDialog.vue";
import Upload from "./upload.vue";
import download from "./exportXLSX.js";
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
export default {
    data ()
    {
        return {
            commentators: [
                {
                    "name": '李四',
                    "num": 114514,
                    "tag": "熟练",
                    "weekday": "周一",
                    "session": "8:00 ~ 9:30"
                },
            ],
            select: [],
            input: ref( '' ),
            deleteDialogVisible: false,
            uploadDialogVisible: false,
            options: [
                {
                    value: 1,
                    label: "熟练度",
                    children: [
                        {
                            value: 11,
                            label: "入门"
                        },
                        {
                            value: 12,
                            label: "熟练"
                        },
                    ]
                },
                {
                    value: 2,
                    label: "工作日",
                    children: [
                        {
                            value: 21,
                            label: "周一"
                        },
                        {
                            value: 22,
                            label: "周二"
                        },
                        {
                            value: 23,
                            label: "周三"
                        },
                        {
                            value: 24,
                            label: "周四"
                        },
                        {
                            value: 25,
                            label: "周五"
                        },
                    ]

                },
                {
                    value: 3,
                    label: "场次",
                    children: [
                        {
                            value: 31,
                            label: "8:00 ~ 9:30"
                        },
                        {
                            value: 32,
                            label: "10:00 ~ 11:30"
                        },
                        {
                            value: 33,
                            label: "14:00 ~ 15:30"
                        },
                        {
                            value: 34,
                            label: "16:00 ~ 17:30"
                        },
                    ]
                }
            ],
            props: { multiple: true }
        }
    },
    mounted ()
    {
        //this.getCommentators();
    },
    components: {
        CommentatorCard,
        DeleteDialog,
        AddDialog,
        Upload,
        Search,
    },
    computed: {
        filteredCommentators ()
        {
            let bufCommentators = [];
            for ( let i = 0; i < this.commentators.length; i += 3 )
            {
                bufCommentators.push( this.commentators.slice( i, i + 3 ) )
            }
            return bufCommentators;
        },
    },
    methods: {
        getCommentators ()
        {
            axios.get( '/api/manager/lecturer' ).then( response =>
            {
                if ( response.status === 200 )
                {
                    this.commentators = response.data.list;
                } else
                {
                    // 处理未获取到数据的情况
                    ElMessage.error( '获取数据失败' );
                }
            } ).catch( error =>
            {
                // 处理请求失败的情况
                ElMessage.error( '获取数据失败' );
            } );
        },


        mySearch ()
        {
            const data = JSON.parse( JSON.stringify( this.select ) )
            let postData = []
            for ( let i = 0; i < data.length; i++ )
            {
                postData.push( data[ i ][ 1 ] )
            }
            //console.log( postData )
            axios.post( '/api/manager/lecturer/find', {
                "tags": postData,
                "content": this.input
            } ).then( response =>
            {
                if ( response.status === 200 )
                {
                    this.commentators = response.data.list;
                    this.select = []
                    this.input = ref( '' )
                } else
                {
                    // 处理未获取到数据的情况
                    ElMessage.error( '获取数据失败' );
                }
            } ).catch( error =>
            {
                // 处理请求失败的情况
                ElMessage.error( '获取数据失败' );
            } );
        },

        // 清空按钮所需函数
        deleteAll ()
        {
            axios.post( 'api/manage/lecturerAll' ).then( response =>
            {
                if ( response.status === 200 )
                {
                    this.commentators = [];
                    ElMessage( {
                        type: 'success',
                        message: '删除成功'
                    } );
                } else
                {
                    // 处理未获取到数据的情况
                    ElMessage.error( '删除失败' );
                }
            } ).catch( error =>
            {
                // 处理请求失败的情况
                ElMessage.error( '删除失败' );
            } );
            this.deleteDialogVisible = false;
            //this.filteredCommentators;
            //console.log( this.deleteDialogVisible )
        },
        cancelDelete ()
        {
            // 用户点击直接清空按钮后的操作
            this.deleteDialogVisible = false;
            ElMessage( {
                type: 'info',
                message: '已取消操作'
            } );

        },

        //上传按钮所需函数
        cancelUpload ()
        {
            this.uploadDialogVisible = false;
            ElMessage( {
                type: 'info',
                message: '已取消操作'
            } );
        },


        async exportAll ()
        {
            //console.log( this.commentators )
            const buf = JSON.parse( JSON.stringify( this.commentators ) );
            let json = buf.map( item =>
            { //将json数据的键名更换成导出时需要的键名
                return {
                    '姓名': item.name,
                    '学号': item.num,
                    '熟练度': item.tag,
                    '工作日': item.weekday,
                    '场次': item.session,
                }
            } )

            try
            {
                // 模拟异步下载操作
                const downloadPromise = new Promise( ( resolve, reject ) =>
                {
                    download( json, '讲解员.xlsx', () =>
                    {
                        resolve();
                    } );
                } );

                await downloadPromise; // 等待下载完成

                return Promise.resolve();
            } catch ( error )
            {
                console.error( 'Export failed:', error );
                return Promise.reject( error );
            }
        }

    }
}
</script>

<style scoped lang="scss">
.centered-content {
    padding: 0 100px;
    /* 左右空间 */

}

.header {
    margin-top: 35px;
    //横向排列所有模块
    display: flex;
    justify-content: space-between;
}

.input-container {
    height: 66%;
    display: flex;
    justify-content: space-between;
}

.input-with-select .el-input-group__prepend {
    background-color: var(--el-fill-color-blank);
    width: 400px;
}

.el-button--red {
    /*添加鼠标放上去时的颜色变浅*/
    color: #ffffff;
    background-color: #d61a29;
    border-color: #d61a29;
}

.el-button {
    width: 30%;
    /* 设置按钮宽度为父元素宽度的百分比 */
}


.hover-lighten:hover {
    filter: brightness(90%);
    /* 控制按钮亮度，取值范围为 0 到 100 */
}
</style>