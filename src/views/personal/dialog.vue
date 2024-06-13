<template>
	<div class="container">
  <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="30%" :beforeClose="onCancel" class="custom-dialog">
    <input ref="fileInput" type="file" style="display:none" :multiple="false" @change="handleFileChange" key="fileInput" />
    <img :src="state.avatar" class="avatar" @click='openFileInput'/>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancel" size="medium">取消</el-button>
        <el-button type="primary" @click="submit" size="medium">确认</el-button>
      </span>
    </template>
  </el-dialog>
</div>

</template>

<script setup lang="ts" name="Dialog">
import { reactive, ref ,Ref} from 'vue';
import { modifyBaseInfo } from "/@/api/user/index";
import { ElMessage } from 'element-plus';


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const fileInput: Ref<HTMLInputElement | null> = ref(null);
const fileList = ref([]);
// 定义变量内容
const judgeDialogFormRef = ref();
const state = reactive({
  avatar:'',
  dialog: {
		isShowDialog: false,
        title: ''
  },
  formData:new FormData()
});

// 打开弹窗
const openDialog = (avatar:any,formData:FormData) => {
	state.dialog.isShowDialog = true;
    state.dialog.title = '上传头像';
    state.avatar = avatar;
    state.formData = formData;
};
// 关闭弹窗
const closeDialog = () => {
  fileList.value = []
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
// 暴露变量
defineExpose({
	openDialog,
});

const openFileInput = () => {
  if (fileInput.value) {
    fileInput.value.value = '';
    // 打开文件选择框
    fileInput.value.click();
  }
}
const submit = () => {
  state.formData.append('avatar', fileList.value[0]);
  const response = modifyBaseInfo(state.formData);
  response.then(response => {
    ElMessage({
        type: 'success',
        message: '提交成功'
      });
      emit('refresh');
     
     closeDialog();
  }).catch(error => {
    ElMessage({
        type: 'error',
        message: '上传失败'
      });
  })
}
const handleFileChange = (event: any) => {
  const selectedFiles = event.target.files; // 获取用户选择的文件列表
  fileList.value = [];
 //console..log(selectedFiles);
 fileList.value = Array.from(selectedFiles);
 state.avatar = URL.createObjectURL(fileList.value[0]);
};

</script>

<style scoped>
.container {
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>