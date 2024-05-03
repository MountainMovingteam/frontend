<template>
    <el-dialog v-model="uploadDialogVisible" title="上传文件" :width="'50%'">
        <el-upload v-model:file-list="uploadFile" ref="uploadRef" class="uploadAll-demo" drag :limit="1"
            :on-exceed="handleExceed" action="#" :auto-upload="false">
            <el-icon class="el-icon--uploadAll"><upload-filled /></el-icon>
            <div class="el-uploadAll__text">
                拖动文件到此处上传或 <em>点击上传</em>
            </div>
            <template #tip>
                <div class="el-uploadAll__tip">
                    此操作将覆盖讲解员信息, 是否导出当前讲解员?
                </div>
            </template>
        </el-upload>
        <div class="buttonContainer">
            <el-button type="info" @click="cancel">取消</el-button>
            <el-button type="danger" @click="submitUploadAll">直接上传</el-button>
            <el-button type="success" @click="exportAndUploadAll">导出并上传</el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { myFormDataPOST } from '/@/api/commentator/index'

export default {
    setup() {
        const uploadRef = ref<UploadInstance>()
        // 定义响应式变量 uploadFile
        const uploadFile = ref<any[]>()

        const submitUploadAll = () => {
            if (uploadFile != undefined && uploadFile.value != undefined) {
                // console.log(uploadFile.value[0])
                // console.log("is click upload")
                const formData = new FormData();
                formData.append('file', uploadFile.value[0].raw);
                myFormDataPOST('/api/manage/lecturer/upload', formData).then(response => {
                    if (response.status === 200) {
                        ElMessage({
                            message: '上传成功',
                            type: 'success'
                        });
                    } else {
                        ElMessage({
                            message: '上传失败',
                            type: 'error'
                        });
                    }
                }).catch(error => {
                    ElMessage({
                        message: '上传失败',
                        type: 'error'
                    });
                })
                //uploadRef.value!.submit()
            }
        }
        const handleExceed: UploadProps['onExceed'] = (files) => {
            uploadRef.value!.clearFiles()
            const file = files[0] as UploadRawFile
            file.uid = genFileId()
            uploadRef.value!.handleStart(file)
        }

        return {
            uploadRef,
            submitUploadAll,
            handleExceed,
            uploadFile
        }
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {

        }
    },
    computed: {
        uploadDialogVisible: {
            get() {
                return this.value;
            },
            set(val: any) {
                this.$emit('update:value', val);
            }
        }
    },
    components: {
        UploadFilled
    },
    methods: {
        cancel() {
            this.$emit('cancel')
        },
        uploadAll() {
            this.submitUploadAll()
        },
        exportAndUploadAll() {
            const exportPromise = new Promise((resolve) => {
                this.$emit('exportAll');
                resolve('1');
            });

            exportPromise.then(async () => {
                await this.uploadAll();
            }).catch(error => {
                console.error('Export failed:', error);
            });
        }

    }
}
</script>

<style>
.myButton {
    margin: 10px;
    /* 靠右摆放 */
    float: right;
}

.buttonContainer {
    justify-content: flex-end;
    padding: 10px;
    display: flex;
}
</style>