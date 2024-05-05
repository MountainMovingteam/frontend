<template >
    <div class="common-layout">
        <el-container class="centered-content">
            <el-header class="header">
                <div class="input-container">
                    <!-- 搜索框 -->
                    <el-cascader v-model="select" :options="options" :props="props" collapse-tags collapse-tags-tooltip
                        clearable style="width: 40%;" />
                    <el-input v-model="input" style="max-width: 600px" placeholder="请输入" class="input-with-select">
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
                <div class="button-container">
                    <el-button type="red" class="hover-lighten" @click="deleteDialogVisible = true">清空讲解员</el-button>
                    <el-button type="success" class="hover-lighten" @click="exportAll()">导出讲解员 </el-button>
                    <el-button type="info" class="hover-lighten" @click="uploadDialogVisible = true">导入讲解员 </el-button>
                </div>
            </el-header>
            <el-main>
                <!-- 讲解员列表 -->
                <div>
                    <el-row v-for="(rowCommentators, index) in filteredCommentators" :gutter="20" :key="index">
                        <el-col v-for="(commentator, index) in rowCommentators" :key="index" :span="8">
                            <CommentatorCard :name="commentator.name" :num="commentator.num" :tag="commentator.tag"
                                :weekday="commentator.weekday" :session="commentator.session" :campus="commentator.campus"
                                @deleteCommentator="deleteCommentator" />
                        </el-col>
                    </el-row>
                </div>
            </el-main>
            <div class="'dialogContainer'">
                <!-- 清空按钮dioloag -->
                <DeleteDialog v-model="deleteDialogVisible" :message="'此操作将永久删除所有讲解员, 是否导出当前讲解员?'" @exportAll="exportAll"
                    @cancel="cancelDelete" @deleteAll="deleteAll" @getCommentators="getCommentators"></DeleteDialog>
                <!-- 上传按钮dialog -->

                <Upload v-model="uploadDialogVisible" @exportAll="exportAll" @cancel="cancelUpload"
                    @Commentators="getCommentators" @closeDialog="uploadDialogVisible = false"></Upload>
                <!-- 添加按钮dialog -->
                <AddDialog @getCommentators="getCommentators"></AddDialog>
            </div>
            <!-- 让下述div背景透明 -->
            <div style="height: 500px;" v-loading="loading"></div>
        </el-container>
    </div>
</template>

<script lang="ts">
import CommentatorCard from "/@/components/4commentator/commentatorCard.vue";
import DeleteDialog from "/@/components/4commentator/deleteDialog.vue";
import AddDialog from "/@/components/4commentator/addDialog.vue";
import Upload from "/@/components/4commentator/uploadDialog.vue";

import download from "/@/utils/exportXLSX";
import { select2PostData, getData2Show } from "/@/utils/transform";
import { Commentator, ExportData } from '/@/types/commentator';
import { myPOST, myGET } from '/@/api/commentator/index'

import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import { ref } from 'vue';


export default {
    data() {
        return {
            commentators: ref([] as Array<Commentator>),
            exportData: ref([] as Array<ExportData>),
            select: ref([]),
            input: ref(''),
            cardSpan: ref(8),
            deleteDialogVisible: ref(false),
            uploadDialogVisible: ref(false),
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
            props: { multiple: true },
            loading: ref(false)
        }
    },
    mounted() {
        this.getCommentators();
    },
    components: {
        CommentatorCard,
        DeleteDialog,
        AddDialog,
        Upload,
        Search,
    },
    computed: {
        filteredCommentators() {
            let buf: Array<any> = getData2Show(this.commentators);
            let bufCommentators: Array<Array<any>> = [];
            for (let i = 0; i < buf.length; i += 3) {
                bufCommentators.push(buf.slice(i, i + 3))
            }
            return bufCommentators;
        },
        getCardSpan() {
            return window.innerWidth < 768 ? 24 : 8;
        }
    },
    methods: {
        getCommentators() {
            this.loading = true;
            myGET('/api/manage/lecturer', {}).then(response => {
                if (response.status === 200) {
                    this.commentators = response.data.list;
                } else {
                    // 处理未获取到数据的情况
                    ElMessage.error('获取数据失败');
                }
            }).catch(error => {
                // 处理请求失败的情况
                ElMessage.error('获取数据失败');
            }).finally(() => {
                this.loading = false;
            });
        },


        mySearch() {
            let postData: { "tags": Number[], "content"?: string } = {
                "tags": select2PostData(this.select),
            }
            if (this.input !== "") {
                postData["content"] = this.input
            }
            myPOST('/api/manage/lecturer/find', postData).then(response => {
                if (response.status === 200) {
                    this.commentators = [...response.data.list]
                    this.select = []
                    this.input = ''
                } else {
                    // 处理未获取到数据的情况
                    ElMessage.error('获取数据失败');
                }
            }).catch(error => {
                ElMessage.error('获取数据失败');
            });
        },

        // 清空按钮所需函数
        deleteAll() {
            myPOST('/api/manage/lecturerAll', {}).then(response => {
                if (response.status === 200) {
                    this.commentators = [];
                    ElMessage({
                        type: 'success',
                        message: '删除成功'
                    });
                } else {
                    // 处理未获取到数据的情况
                    ElMessage.error('删除失败');
                }
            }).catch(error => {
                // 处理请求失败的情况
                ElMessage.error('删除失败');
            });
            this.deleteDialogVisible = false;
            //this.filteredCommentators;
            //console.log( this.deleteDialogVisible )
        },
        cancelDelete() {
            // 用户点击直接清空按钮后的操作
            this.deleteDialogVisible = false;
            ElMessage({
                type: 'info',
                message: '已取消操作'
            });

        },

        //上传按钮所需函数
        cancelUpload() {
            this.uploadDialogVisible = false;
            ElMessage({
                type: 'info',
                message: '已取消操作'
            });
        },


        async exportAll() {
            this.exportData = getData2Show(this.commentators);
            try {
                let buf = JSON.parse(JSON.stringify(this.exportData));
                let json: Array<ExportData> = buf.map((item: ExportData) => {
                    return {
                        '姓名': item.name,
                        '学号': item.num,
                        '熟练度': item.tag,
                        '校区': item.campus,
                        '工作日': item.weekday,
                        '场次': item.session,
                    }
                });

                // 模拟异步下载操作
                const downloadPromise = new Promise((resolve, reject) => {
                    download(json, '讲解员.xlsx');
                });

                await downloadPromise; // 等待下载完成

                return Promise.resolve();
            } catch (error) {
                ElMessage.error('导出失败');
                return Promise.reject(error);
            }
        },

        // addCommentator(commentator: Commentator) {
        //     this.commentators.unshift(commentator);
        // }
        deleteCommentator(num: any) {
            console.log(num)
            this.commentators = this.commentators.filter(item => item.num != num);
        },


    }
}
</script>

<style scoped lang="scss">
.centered-content {
    padding: 0 8%;
    /* 左右空间 */

}

.header {
    margin-top: 35px;

    @media only screen and (min-width: 1270px) {
        display: flex
    }

    justify-content: space-between;
}

.input-container {
    @media only screen and (min-width: 1270px) {
        width: 50%;
    }

    @media only screen and (max-width: 1270px) {
        width: 80%;
    }

    height: 66%;
    display: flex;
    justify-content: space-between;
}

.button-container {
    display: flex;
    justify-content: space-between;

    @media only screen and (min-width: 1270px) {
        width: 30%;
    }

    @media only screen and (max-width: 1270px) {
        margin-top: 1%;
        width: 80%;
    }
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