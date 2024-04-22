<template>
    <div class="border">
        <div class="header">
            <div class="topic">{{ localName }}</div>
            <el-tag type="danger" effect="light">{{ localTag }}</el-tag>
        </div>

        <div class="text">学号：{{ localNum }}</div>
        <div class="buttonContainer">
            <el-button type="blue" @click="dialogVisible = true" class="hover-lighten">修改信息 </el-button>
            <el-button type="danger" @click="myDelete()">
                <el-icon>
                    <Delete />
                </el-icon>
            </el-button>
        </div>
    </div>
    <el-dialog v-model="dialogVisible" title="修改信息" width="500" draggable>
        <el-form :model="form" label-width="auto" style="max-width: 600px">
            <el-form-item label="姓名">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="学号">
                <el-input v-model="form.num" />
            </el-form-item>
            <el-form-item label="熟练度">
                <el-select v-model="form.tag">
                    <el-option label="入门" value="入门" />
                    <el-option label="熟练" value="熟练" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="info" @click="dialogVisible = false">取消</el-button>
                <el-button type="success" @click="fixData()">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import axios from 'axios'
import { Delete, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { reactive } from 'vue'
export default {
    data() {
        return {
            dialogVisible: false,
            localName: this.name,
            localNum: this.num,
            localTag: this.tag,
            form: reactive({
                //将初始值设置为props中的数值
                name: this.name,
                num: this.num,
                tag: this.tag
            })
        }
    },
    components: {
        Delete
    },
    methods: {
        myDelete() {
            axios.post('/api/delete', {
                name: this.localName,
                num: this.localNum,
                tag: this.localTag
            })
                .then(res => {
                    if (res.data == "success") {
                        ElMessage.success("删除成功");
                    } else {
                        ElMessage.error("删除失败");
                    }
                })
                .catch(err => {
                    ElMessage.error("服务器错误");
                })
        },
        fixData() {
            this.dialogVisible = false
            this.localName = this.form.name
            this.localNum = this.form.num
            this.localTag = this.form.tag
        },
    },
    props: ["name", "num", "tag"]
}
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.border {
    border: 4px solid #4c82ff63;
    border-radius: 8px;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 15px;
    padding-right: 15px;
    /* 增加card和其它模块的上下间距 */
    margin-top: 15px;
    /* 背景色渐变色 */
    background-image: linear-gradient(135deg, #ffffff 0%, #d1e5f8 100%);
}

.topic {
    font-size: 20px;
}

W .text {
    font-size: 16px;
    margin-top: 10px;
}

.buttonContainer {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

.el-button {
    width: 40%;
    /* 设置按钮宽度为父元素宽度的百分比 */
}

.el-button--blue {
    /*添加鼠标放上去时的颜色变浅*/
    color: #ffffff;
    background-color: #409EFF;
    border-color: #0066cc;
}

.hover-lighten:hover {
    filter: brightness(115%);
    /* 控制按钮亮度，取值范围为 0 到 100 */
}

/* @media screen and (max-width: 768px) {
    .el-button {
        width: 60%;
    }
}

@media screen and (max-width: 576px) {
    .el-button {
        width: 80%;
    }
} */
</style>