<template>
    <div class="system-menu-dialog-container">
      <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :before-close="handleClose " draggable>
        <el-checkbox-group v-model="checkList">
          <el-row>
            <el-col :span="12">
              <el-checkbox label="存在重复人员" value="存在重复人员" />
            </el-col>
            <el-col :span="12">
              <el-checkbox label="当前时间体验馆关闭，给您带来的麻烦烦请谅解" value="当前时间体验馆关闭，给您带来的麻烦烦请谅解" />
            </el-col>
            <el-col :span="12">
              <el-checkbox label="提供的信息不完整" value="提供的信息不完整" />
            </el-col>
          </el-row>
        </el-checkbox-group>
        <el-checkbox v-model='hasOtherReason' label="其它" />
        <el-input v-if="hasOtherReason" v-model="state.otherReason" placeholder="请输入其他选项" class="input-field" />
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="confirm">
              确认驳回
            </el-button>
      </div>
    </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts" name="systemMenuDialog">
  import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
  import {storeToRefs} from 'pinia';
  import {useRoutesList} from '/@/stores/routesList';
  import {i18n} from '/@/i18n/index';
  import {ElMessage} from "element-plus";
  import {getSearchDetails,rejectOppointment} from "/@/api/session";
  // import { setBackEndControlRefreshRoutes } from "/@/router/backEnd";

  
  // 定义子组件向父组件传值/事件
  const emit = defineEmits(['confirmReject']);
  
  // 引入组件
  const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));
  const activeName = ref('first')
  
  // 定义变量内容
  const SessionTable = defineAsyncComponent(() => import('/@/components/table/sessionDialogTable.vue'));
  const menuDialogFormRef = ref();
  const stores = useRoutesList();
  const checkList = ref([])
  const hasOtherReason = ref(false)
  const state = reactive({
    dialog: {
      isShowDialog: false,
      type: '',
      title: '',
      submitTxt: '',
    },
    otherReason:''
  });
  

  const handleClose = () => {
    state.dialog.isShowDialog = false;
    hasOtherReason.value = false;
    checkList.value = [];
    state.otherReason = '';
  }
  // 获取 pinia 
  // 打开弹窗
  const openDialog = (type: string, assist:any) => {
    state.dialog.title='驳回理由'
    state.dialog.isShowDialog = true;
  };

  const confirm = () => {
    //console..log(checkList.value);
    if (hasOtherReason.value) {
      if (state.otherReason == '') {
        ElMessage.warning('请输入理由');
        return;
      }
    }
    if (!hasOtherReason.value && checkList.value.length == 0) {
      ElMessage.warning('请选择理由');
        return;
    }
    var reason = checkList.value.join(', ');
    if (hasOtherReason.value) {
      if (checkList.value.length != 0) {
        reason = `${reason}, ${state.otherReason}`
      } else {
        reason = state.otherReason;
      }
    }
    
    try {
      emit('confirmReject',reason);
    } catch (error) {

    }
  }
  
  // 暴露变量
  defineExpose({
    openDialog,
    handleClose
  });
  </script>
  
  <style>
  hr {
    border-top: 1px solid #ccc;
    margin: 3px 0;
    width: 95%;
  }

  .checkbox-with-input {
    display: flex;
    align-items: center;
}
  </style>
  