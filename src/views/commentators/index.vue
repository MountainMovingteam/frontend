<template>
    <div class="common-layout">
        <el-container class="centered-content">
            <el-header class="header">
                <div class="input-container">
                    <!-- 搜索框 -->
                    <el-input v-model="input" style="max-width: 600px" placeholder="Please input" class="input-with-select">
                        <template #prepend>
                            <el-select v-model="select" placeholder="熟练度" style="width: 115px">
                                <el-option label="所有" value="1" />
                                <el-option label="入门" value="2" />
                                <el-option label="熟练" value="3" />
                            </el-select>
                        </template>
                        <template #append>
                            <el-button>
                                <el-icon>
                                    <Search />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-input>
                </div>
                <!-- 功能按钮 -->
                <div>
                    <el-button type="red" class="hover-lighten" @click="this.deleteDialogVisible = true">清空讲解员
                    </el-button>
                    <el-button type="success" class="hover-lighten" @click="exportAll()">导出讲解员 </el-button>
                    <el-button type="info" class="hover-lighten" @click="this.uploadDialogVisible = true">导入讲解员 </el-button>
                </div>
            </el-header>
            <el-main>
                <!-- 讲解员列表 -->
                <div>
                    <el-row v-for="(commentators, index) in filteredCommentators" :gutter="20" :key="index">
                        <el-col v-for="(commentator, index) in commentators" :key="index" :span="8">
                            <CommentatorCard :name="commentator.name" :num="commentator.num" :tag="commentator.tag" />
                        </el-col>
                    </el-row>
                </div>

            </el-main>
            <div class="'dialogContainer'">
                <!-- 清空按钮dioloag -->
                <DeleteDialog v-model="deleteDialogVisible" :message="'此操作将永久删除所有讲解员, 是否导出当前讲解员?'" @exportAll="exportAll"
                    @cancel="cancelDelete" @deleteAll="deleteAll"></DeleteDialog>
                <!-- 上传按钮dialog -->

                <Upload v-model="uploadDialogVisible" @exportAll="exportAll" @cancel="cancelUpload"></Upload>
                <!-- 添加按钮dialog -->
                <AddDialog></AddDialog>
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
export default {
    data ()
    {
        return {
            commentators: [
                {
                    "name": '李四',
                    "num": 114514,
                    "tag": "入门"
                },
                {
                    "name": '李四',
                    "num": 114514,
                    "tag": "入门"
                }, {
                    "name": '李四',
                    "num": 114514,
                    "tag": "入门"
                }, {
                    "name": '李四',
                    "num": 114514,
                    "tag": "入门"
                }, {
                    "name": '李四',
                    "num": 114514,
                    "tag": "入门"
                }, {
                    "name": '李四',
                    "num": 114514,
                    "tag": "入门"
                }, {
                    "name": '李四',
                    "num": 114514,
                    "tag": "入门"
                }, {
                    "name": '李四',
                    "num": 114514,
                    "tag": "入门"
                },
                {
                    "name": '李四',
                    "num": 114514,
                    "tag": "入门"
                }, {
                    "name": '李四',
                    "num": 114514,
                    "tag": "入门"
                }, {
                    "name": '李四',
                    "num": 114514,
                    "tag": "入门"
                }, {
                    "name": '李四',
                    "num": 114514,
                    "tag": "入门"
                }, {
                    "name": '李四',
                    "num": 114514,
                    "tag": "入门"
                }, {
                    "name": '李四',
                    "num": 114514,
                    "tag": "入门"
                },

            ],
            select: ref( '' ),
            input: ref( '' ),
            deleteDialogVisible: false,
            uploadDialogVisible: false,
        }
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
        // 清空按钮所需函数
        deleteAll ()
        {
            this.commentators = [];
            this.deleteDialogVisible = false;
            this.filteredCommentators;
            //console.log( this.deleteDialogVisible )
        },
        cancelDelete ()
        {
            // 用户点击直接清空按钮后的操作
            this.deleteDialogVisible = false;
            this.$message( {
                type: 'info',
                message: '已取消操作'
            } );

        },

        //上传按钮所需函数
        cancelUpload ()
        {
            this.uploadDialogVisible = false;
            this.$message( {
                type: 'info',
                message: '已取消操作'
            } );
        },


        async exportAll ()
        {
            try
            {
                // 模拟异步下载操作
                const downloadPromise = new Promise( ( resolve, reject ) =>
                {
                    download( this.commentators, '讲解员.xlsx', () =>
                    {
                        // 下载完成后调用 resolve
                        resolve();
                    } );
                } );

                await downloadPromise; // 等待下载完成

                // 下载完成后继续执行后续操作
                console.log( 'Download completed' );

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
    width: 400px;
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