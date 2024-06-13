<template>
    <div class="border">
        <div class="header">
            <div style="display: flex; align-items: center;">
                <el-icon style="margin-right: 6px; font-size: 18px;">
                    <Avatar />
                </el-icon>
                <div class="topic">
                    {{ local.localName }}
                </div>
            </div>
            <el-tag type="primary" effect="dark" class="custom-tag">{{ local.localTag }}</el-tag>
        </div>
        <div class="text"><span>学号：</span><span class="fixed-field">{{ local.localNum }}</span></div>
        <div class="text">校区：<span class="fixed-field">{{ local.localCampus }}</span></div>
        <div class="text">工作日：<span class="fixed-field">{{ local.localWeekday }}</span></div>
        <div class="text">场次：<span class="fixed-field">{{ local.localSession }}</span></div>
        <div class="buttonContainer">
            <!-- 修改信息按钮 -->
            <div class="button primary" @click="closeDialog()">修改信息</div>
            <!-- 删除按钮 -->
            <div class="button danger" @click="myDelete()">删除</div>
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
import { info2TimeIndex } from '/@/utils/transform'
import { myPOST } from '/@/api/commentator/index'

export default {
    data() {
        return {
            dialogVisible: false,
            local: reactive({
                localName: this.name,
                localNum: this.num,
                localTag: this.tag,
                localWeekday: this.weekday,
                localSession: this.session,
                localCampus: this.campus,
            }),
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
    watch: {
        name(newVal) {
            this.local.localName = newVal
            this.form.name = newVal
        },
        num(newVal) {
            this.local.localNum = newVal
            this.form.num = newVal
        },
        tag(newVal) {
            this.local.localTag = newVal
            this.form.tag = newVal
        },
        weekday(newVal) {
            this.local.localWeekday = newVal
            this.form.weekday = newVal
        },
        session(newVal) {
            this.local.localSession = newVal
            this.form.session = newVal
        },
        campus(newVal) {
            this.local.localCampus = newVal
            this.form.campus = newVal
        },
    },
    computed: {
        isFormValid() {
            return this.form.name && this.form.num && this.form.tag
                && this.form.weekday && this.form.session && this.form.campus;
        },
        assignLocal() {
            this.local.localName = this.name
            this.local.localNum = this.num
            this.local.localTag = this.tag
            this.local.localWeekday = this.weekday
            this.local.localSession = this.session
            this.local.localCampus = this.campus
            ////console..log(this.local)
        }
    },
    components: {
        Delete,
        Avatar
    },
    methods: {
        closeDialog() {
            this.dialogVisible = true
            ////console..log(this.name)
        },
        myDelete() {
            myPOST('/api/manage/lecturer/delete', {
                num: this.local.localNum,
            })
                .then(res => {
                    if (res.status == 200) {
                        ElMessage.success("删除成功");
                        this.$emit("deleteCommentator", this.local.localNum)
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
                "old_num": this.local.localNum,
                "name": this.form.name,
                "num": this.form.num,
                "tag": this.form.tag == "入门" ? 0 : 1,
                "time_index": info2TimeIndex(this.form)
            })
                .then(res => {
                    if (res.status == 200) {
                        ElMessage.success("更新成功");
                        const { name, num, tag, weekday, session, campus } = this.form;
                        this.local = {
                            localName: name,
                            localNum: num,
                            localTag: tag,
                            localWeekday: weekday,
                            localSession: session,
                            localCampus: campus
                        };
                    } else {
                        this.updateFrom()
                        ElMessage.error("更新失败");
                    }
                })
                .catch(err => {
                    this.updateFrom()
                    ElMessage.error("更新失败");
                })
            this.dialogVisible = false
        },
        updateFrom() {
            this.form.name = this.local.localName
            this.form.num = this.local.localNum
            this.form.tag = this.local.localTag
            this.form.weekday = this.local.localWeekday
            this.form.session = this.local.localSession
            this.form.campus = this.local.localCampus
        },
    },
    props: ["name", "num", "tag", "weekday", "session", "campus"]
}
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    /* 增加标题和内容之间的间距 */
}

.custom-tag {
    background-color: #667eea;
    color: #fff;
    /* 边框颜色 */
    border-color: #667eea;
    /* 设置标签颜色 */
}


.border {
    border: 1px solid #d9d9d9;
    /* 更加简洁的边框颜色 */
    border-radius: 4px;
    /* 更小的圆角 */
    padding: 20px;
    /* 调整内边距 */
    margin-top: 20px;
    /* 调整上下间距 */
    background-color: #f5f5f5;
    /* 使用更平静的背景色 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* 添加轻微阴影增加立体感 */
    transition: box-shadow 0.3s ease;
    /* 添加过渡效果 */
}

.border:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    /* 悬停时增加阴影 */
}

.topic {
    font-size: 18px;
    font-weight: bold;
    color: #0a59b3;
    /* 设置标题颜色 */
}


.text {
    font-size: 14px;
    margin-bottom: 8px;
    /* 调整文本行之间的间距 */
    color: #333;
    /* 设置文本颜色 */
}

.fixed-field {
    font-size: 14px;
    margin-bottom: 8px;
    color: #540694;
}


.buttonContainer {
    display: flex;
    justify-content: space-between;
    /* 按钮间距平均分布 */
    margin-top: 20px;
    padding: 0 0 0 0;
    gap: 1vh;
    /* 上边距 */
    transition: background-color 0.3s ease;
    /* 过渡效果 */
    text-align: center;
    /* 文字居中 */
    font-weight: bold;
    /* 加粗文字 */
}

/* 按钮样式 */
.button {
    flex: 1;
    /* 平分宽度 */
    padding: 10px 20px;
    /* 按钮内边距 */
    cursor: pointer;
    /* 光标样式 */
    transition: background-color 0.3s ease;
    /* 过渡效果 */
    text-align: center;
    /* 文字居中 */
    font-weight: bold;
    /* 加粗文字 */
}

/* 修改信息按钮样式 */
.primary {
    background-color: #e0e0e0;
    /* 背景色 */
    color: #333;
    /* 文字颜色 */
}

/* 删除按钮样式 */
.danger {
    background-color: #e0e0e0;
    /* 背景色 */
    color: #e73939;
    /* 文字颜色 */
}


/* 按钮悬停样式 */
.button:hover {
    filter: brightness(0.9);
    /* 悬停时颜色亮度减弱 */
}

.dialog-footer {
    justify-content: flex-end;
    padding: 10px 0 0 0;
    display: flex;
}

.dialog-footer .el-button {
    width: 100px;
    /* 按钮宽度 */
    padding: 10px 0;
    /* 内边距 */
}

.dialog-footer .el-button[type='info'] {
    background-color: #e6a23c;
    /* 背景色 */
    border-color: #e6a23c;
    /* 边框颜色 */
    color: #fff;
    /* 文字颜色 */
}

.dialog-footer .el-button[type='info']:hover {
    background-color: #d49e33;
    /* 悬停背景色 */
    border-color: #d49e33;
    /* 悬停边框颜色 */
}

.dialog-footer .el-button[type='success'] {
    background-color: #67c23a;
    /* 背景色 */
    border-color: #67c23a;
    /* 边框颜色 */
    color: #fff;
    /* 文字颜色 */
}

.dialog-footer .el-button[type='success']:hover {
    background-color: #5aaf35;
    /* 悬停背景色 */
    border-color: #5aaf35;
    /* 悬停边框颜色 */
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