<template>
    <el-dialog v-model="uploadDialogVisible" title="上传文件" :width="'50%'">
        <el-upload ref="uploadRef" class="uploadAll-demo" drag
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :auto-upload="false">
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
    </el-dialog>
</template>

<script lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'
import type { UploadInstance } from 'element-plus'
export default {
    setup() {
        const uploadRef = ref<UploadInstance>()

        const submitUploadAll = () => {
            uploadRef.value!.submit()
        }

        return {
            uploadRef,
            submitUploadAll
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