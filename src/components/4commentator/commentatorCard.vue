<template>
    <div class="border">
        <div class="header">
            <div style="display: flex; align-items: center;">
                <el-icon style="margin-right: 6px; font-size: 18px;">
                    <Avatar />
                </el-icon>
                <div class="topic">
                    {{ localName }}
                </div>
            </div>
            <el-tag type="danger" effect="light">{{ localTag }}</el-tag>
        </div>

        <div class="text">学号：{{ localNum }}</div>
        <div class="text">校区：{{ localCampus }}</div>
        <div class="text">工作日：{{ localWeekday }}</div>
        <div class="text">场次：{{ localSession }}</div>
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
        <el-form :model="form" label-width="auto" style="max-width: 90%">
            <el-form-item label="姓名" prop="name" :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="学号" prop="num" :rules="[{ required: true, message: '请输入学号', trigger: 'blur' }]">
                <el-input v-model="form.num" />
            </el-form-item>
            <el-form-item label="熟练度" prop="tag" :rules="[{ required: true, message: '请选择熟练度', trigger: 'change' }]">
                <el-radio-group v-model="form.tag">
                    <el-radio value="入门">入门</el-radio>
                    <el-radio value="熟练">熟练</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="校区" prop="campus" :rules="[{ required: true, message: '请选择校区', trigger: 'change' }]">
                <el-radio-group v-model="form.campus">
                    <el-radio value="学院路">学院路</el-radio>
                    <el-radio value="沙河">沙河</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="工作日" prop="weekday" :rules="[{ required: true, message: '请选择工作日', trigger: 'change' }]">
                <el-select v-model="form.weekday">
                    <el-option label="周一" value="周一" />
                    <el-option label="周二" value="周二" />
                    <el-option label="周三" value="周三" />
                    <el-option label="周四" value="周四" />
                    <el-option label="周五" value="周五" />
                </el-select>
            </el-form-item>
            <el-form-item label="场次" prop="session" :rules="[{ required: true, message: '请选择场次', trigger: 'change' }]">
                <el-select v-model="form.session">
                    <el-option label="8:00 ~ 9:30" value="8:00 ~ 9:30" />
                    <el-option label="10:00 ~ 11:30" value="10:00 ~ 11:30" />
                    <el-option label="14:00 ~ 15:30" value="14:00 ~ 15:30" />
                    <el-option label="16:00 ~ 17:30" value="16:00 ~ 17:30" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="info" @click="dialogVisible = false">取消</el-button>
                <el-button type="success" @click="fixData()" :disabled="!isFormValid">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { Delete, Avatar } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { reactive } from 'vue'
import { info2TimeIndex } from '/@/utils/timeIndex'
import { myPOST } from '/@/api/commentator/index'

export default {
    data() {
        return {
            dialogVisible: false,
            localName: this.name,
            localNum: this.num,
            localTag: this.tag,
            localWeekday: this.weekday,
            localSession: this.session,
            localCampus: this.campus,
            form: reactive({
                //将初始值设置为props中的数值
                name: this.name,
                num: this.num,
                tag: this.tag,
                weekday: this.weekday,
                session: this.session,
                campus: this.campus,
            })
        }
    },
    computed: {
        isFormValid() {
            return this.form.name && this.form.num && this.form.tag
                && this.form.weekday && this.form.session && this.form.campus;
        }
    },
    components: {
        Delete,
        Avatar
    },
    methods: {
        myDelete() {
            myPOST('/api/manage/lecturer/delete', {
                num: this.localNum,
            })
                .then(res => {
                    if (res.status == 200) {
                        ElMessage.success("删除成功");
                        this.$emit("getCommentators")
                    } else {
                        ElMessage.error("删除失败");
                    }
                })
                .catch(err => {
                    ElMessage.error("服务器错误");
                })
        },
        fixData() {
            myPOST('/api/manage/lecturer/edit', {
                "old_num": this.localNum,
                "name": this.form.name,
                "num": this.form.num,
                "tag": this.form.tag == "入门" ? 1 : 2,
                "time_index": info2TimeIndex(this.form)
            })
                .then(res => {
                    if (res.status == 200) {
                        ElMessage.success("更新成功");
                        this.localName = this.form.name
                        this.localNum = this.form.num
                        this.localTag = this.form.tag
                        this.localWeekday = this.form.weekday
                        this.localSession = this.form.session
                        this.localCampus = this.form.campus
                    } else {
                        ElMessage.error("更新失败");
                    }
                })
                .catch(err => {
                    ElMessage.error("服务器错误");
                })
            this.dialogVisible = false
        },
    },
    props: ["name", "num", "tag", "weekday", "session", "campus"]
}
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.border {
    border: 3px solid #4c82ff63;
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
    /* 字体加粗加斜 */
    font-weight: bolder;
}

.text {
    font-size: 16px;
    margin-top: 16px;
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