<template>
    <el-dialog :visible.sync="deleteDialogVisible" title="提示">
        <div class="dialog-content">
            {{ message }}
        </div>
        <div class="dialog-footer">
            <el-button type="info" @click="cancel">{{ cancelButtonText }}</el-button>
            <el-button type="danger" @click="deleteAll">{{ deleteButtonText }}</el-button>
            <el-button type="success" @click="exportAndDelete">{{ exportAndDeleteButtonText }}</el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            default: ''
        },
        exportAndDeleteButtonText: {
            type: String,
            default: '导出并清空讲解员'
        },
        cancelButtonText: {
            type: String,
            default: '取消'
        },
        deleteButtonText: {
            type: String,
            default: '直接清空'
        }
    },
    computed: {
        deleteDialogVisible: {
            get() {
                return this.value;
            },
            set(val: any) {
                this.$emit('update:value', val);
            }
        }
    },
    methods: {
        cancel() {
            this.$emit('cancel');
        },
        deleteAll() {
            this.$emit('deleteAll');
        },
        exportAndDelete() {
            const exportPromise = new Promise((resolve) => {
                this.$emit('exportAll');
                resolve('1');
            });

            exportPromise.then(async () => {
                await this.deleteAll();
            }).catch(error => {
                console.error('Export failed:', error);
            });

        },
    }
};
</script>

<style scoped>
.dialog-content {
    padding: 20px;
    /* 加粗*/
    font-weight: bold;
    font-size: 18px;
}

.dialog-footer {
    justify-content: flex-end;
    padding: 10px;
    display: flex;
}
</style>
