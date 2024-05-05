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
            <el-button type="danger" @click="uploadAll">直接上传</el-button>
            <el-button type="success" @click="exportAndUploadAll">导出并上传</el-button>
        </div>
        <div v-if="loading" class="loading-container" v-loading="loading" element-loading-text="正在上传..."
            element-loading-background="rgba(122, 122, 122, 0.8)">
            <el-loading text="上传中..." fullscreen></el-loading>
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
        const loading = ref(false);
        const uploadRef = ref<UploadInstance>()
        // 定义响应式变量 uploadFile
        const uploadFile = ref<any[]>()

        const submitUploadAll = () => {
            if (uploadFile != undefined && uploadFile.value != undefined) {
                // console.log(uploadFile.value[0])
                // console.log("is click upload")
                const formData = new FormData();
                formData.append('file', uploadFile.value[0].raw);
                return myFormDataPOST('/api/manage/lecturer/upload', formData)
                //uploadRef.value!.submit()
            }
            return null
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
            uploadFile,
            loading
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
            //loading: ref(false)
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
            let status: any = this.submitUploadAll();
            if (status != null) {
                this.loading = true;
                status.then((response: Response) => {
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
                }).catch((error: Error) => {
                    ElMessage({
                        message: '上传失败',
                        type: 'error'
                    });
                }).finally(() => {
                    this.loading = false;
                    this.$emit("closeDialog")
                    this.$emit("getCommentators")
                })
            } else {
                ElMessage({
                    message: '请选择文件',
                    type: 'warning'
                });
            }
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

.loading-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.7);
    /* 背景色，半透明 */
}
</style>