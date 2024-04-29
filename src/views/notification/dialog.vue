<template>
	<div class="system-user-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<div class="message-content">
                <div class="message-content-item">
                    <div class="message-content-value">{{ state.notice.content }}, {{ state.notice.index }}</div>
                </div>
                <div class="message-content-item">
                    <div class="message-content-value" style='text-align: right;'>{{ state.notice.time }}</div>
                </div>
            </div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">关 闭</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemUserDialog">
import { reactive, ref } from 'vue';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const state = reactive({
	notice: {
        content: '',
        time: '',
        index: '',
    },
	deptData: [] as DeptTreeType[], // 部门数据
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = (row: any,data:any) => {
	state.dialog.isShowDialog = true;
    state.dialog.title = data.title;
    state.notice.content = data.content;
    state.notice.time = data.time;
    state.notice.index = row;
};
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
const onSubmit = () => {
	closeDialog();
	emit('refresh');
	// if (state.dialog.type === 'add') { }
};
// 初始化部门数据


// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.message-content {
    margin-bottom: 20px;

    .message-content-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .message-content-label {
        width: 80px;
        font-weight: bold;
      }

      .message-content-value {
        flex: 1;
        padding-left: 10px;
      }
    }
  }
</style>