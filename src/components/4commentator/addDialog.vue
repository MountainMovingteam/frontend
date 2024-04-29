<template>
    <div>
        <el-tooltip class="box-item" effect="dark" content="添加讲解员" placement="left">
            <div class="add-icon" @click="openDialog">
                <el-icon>
                    <Plus />
                </el-icon>
            </div>
        </el-tooltip>
    </div>

    <el-dialog v-model="addDialogVisible" @close="closeDialog">
        <!-- 添加标题 -->
        <template #title>
            <div style="text-align: center;">
                <span class="custom-title">添加讲解员</span>
            </div>
        </template>
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
            <el-form-item label="工作日" prop="tag" :rules="[{ required: true, message: '请选择工作日', trigger: 'change' }]">
                <el-select v-model="form.weekday">
                    <el-option label="周一" value="周一" />
                    <el-option label="周二" value="周二" />
                    <el-option label="周三" value="周三" />
                    <el-option label="周四" value="周四" />
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
        <div class="dialog-footer">
            <el-button type="success" @click="onSubmit" :disabled="!isFormValid">添加</el-button>
            <el-button type="info" @click="closeDialog">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { Plus } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { info2TimeIndex } from '../../utils/timeIndex'
import axios from "axios";

export default {
    data ()
    {
        return {
            addDialogVisible: false,
            form: reactive( {
                name: '',
                num: '',
                tag: '',
                campus: '',
                weekday: '',
                session: ''
            } )
        }
    },
    computed: {
        isFormValid ()
        {
            return this.form.name && this.form.num && this.form.tag
                && this.form.weekday && this.form.session && this.from.campus;
        }
    },
    components: {
        Plus
    },
    methods: {
        openDialog ()
        {
            this.addDialogVisible = true;
        },
        closeDialog ()
        {
            this.addDialogVisible = false;
        },
        onSubmit ()
        {
            if ( !this.isFormValid )
            {
                ElMessage.error( '请填写完整的表单信息！' );
                return;
            }
            axios.post( 'api/manage/lecturer/add', {
                "name": this.form.name,
                "num": this.form.num,
                "tag": this.form.tag == "入门" ? 1 : 2,
                "time_index": info2TimeIndex( this.form )
            } )
                .then( ( responsw ) =>
                {
                    if ( responsw.data.success )
                    {
                        ElMessage.success( '添加成功！' );
                        this.closeDialog();
                        this.form = reactive( {
                            name: '',
                            num: '',
                            tag: '',
                            weekday: '',
                            session: ''
                        } );
                        this.$emit( 'getCommentotars' )

                    } else
                    {
                        ElMessage.error( '添加失败' );
                        return;
                    }

                } )
                .catch( () =>
                {
                    ElMessage.error( '添加失败，请重试！' );
                } );
            // 提交表单的逻辑
            this.addDialogVisible = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.box-item {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
}

.add-icon {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background-color: #2b85ec;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 999;
}

.custom-title {
    text-align: center;
    font-size: 24px;
    color: #333;
}

.dialog-footer {
    justify-content: flex-end;
    padding: 40px 0 0 0;
    display: flex;
}
</style>
