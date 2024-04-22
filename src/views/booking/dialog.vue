<template>
  <div class="system-menu-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="menuDialogFormRef" :model="state.ruleForm" size="default" label-width="80px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="校区选择">
              <el-radio-group v-model="state.data.campus">
                <el-radio label="xueyuan">学院路校区</el-radio>
                <el-radio label="shahe">沙河校区</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="预约方式">
              <el-radio-group v-model="state.data.bookingWay">
                <el-radio label="group">团队预约&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
                <el-radio label="single">个人预约</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="预约场次">
              <el-select v-model="state.selectedEvent" placeholder="请选择预约场次" clearable class="w100">
                <el-option
                    v-for="(event, index) in state.events"
                    :key="index"
                    :label="event"
                    :value="event"
                    :disabled="!state.accessibleEvents.includes(index)"
                >
                  <span :style="{ color: !state.accessibleEvents.includes(index) ? 'gray' : 'inherit' }">{{ event }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col v-if="state.data.bookingWay === 'group'" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="团队信息">
              <template v-for="(member, index) in state.teamMembers">
                <el-row>
                <el-form-item>
                  <el-col>
                    <span>成员{{ index === 0 ? index + 1 + '（负责人）' : index + 1 }}</span>
                  </el-col>
                </el-form-item>
                <el-form-item v-if="index != 0" type="flex" justify="end">
                  <el-col style="float: right;">
                    <el-button @click="removeTeamMember(index)" type="danger" size="mini">删除该成员</el-button>
                  </el-col>
                </el-form-item>
                </el-row>
                <el-row class="mb10">
                  <el-form-item :span="8">
                    <el-input v-model="member.name" placeholder="姓名" clearable></el-input>
                  </el-form-item>

                  <el-col :span="8">
                    <el-input v-model="member.studentId" placeholder="学号" clearable></el-input>
                  </el-col>

                  <el-col :span="8">
                    <el-input v-model="member.phone" placeholder="电话" clearable></el-input>
                  </el-col>
                </el-row>
                <el-button v-if="index === state.teamMembers.length - 1" @click="addTeamMember">增加成员</el-button>
              </template>
            </el-form-item>
          </el-col>
          <el-col v-else-if="state.data.bookingWay === 'single'" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="个人信息">
              <el-row>
                <el-form-item :span="8">
                  <el-input v-model="state.personalInfo.name" placeholder="姓名" clearable></el-input>
                </el-form-item>

                <el-col :span="8">
                  <el-input v-model="state.personalInfo.studentId" placeholder="学号" clearable></el-input>
                </el-col>

                <el-col :span="8">
                  <el-input v-model="state.personalInfo.phone" placeholder="电话" clearable></el-input>
                </el-col>
              </el-row>

            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">确定预约</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="systemMenuDialog">
import {defineAsyncComponent, reactive, onMounted, ref} from 'vue';
import { storeToRefs } from 'pinia';
import { useRoutesList } from '/@/stores/routesList';
import { i18n } from '/@/i18n/index';
// import { setBackEndControlRefreshRoutes } from "/@/router/backEnd";

const props = defineProps({
  campus: {
    type: String,
    default: '',
  },
  bookingWay: {
    type: String,
    default: '',
  },
  row: {
    type: Number,
    default: 0,
  },
  column: {
    type: Number,
    default: 0,
  },
});

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 引入组件
const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));

// 定义变量内容
const menuDialogFormRef = ref();
const stores = useRoutesList();
const { routesList } = storeToRefs(stores);
const state = reactive({
  data : {
    campus: '',
    bookingWay: '',
    row: 0,
    column: 0,
  },
  selectedEvent: '',
  events : ['8:00-9:30', '10:00-11:30', '14:00-15:30', '16:00-17:30'],
  accessibleEvents: [1, 2, 3],
  teamMembers: [
    { name: '', studentId: '', phone: '' }
  ],
  personalInfo: { name: '', studentId: '', phone: '' }, // 初始个人信息
  ruleForm: {
    menuSuperior: [],
    menuType: 'menu',
    name: '',
    component: '',
    componentAlias: '',
    isLink: false,
    menuSort: 0,
    path: '',
    redirect: '',
    meta: {
      title: '',
      icon: '',
      isHide: false,
      isKeepAlive: true,
      isAffix: false,
      isLink: '',
      isIframe: false,
      roles: '',
    },
    btnPower: '',
  },
  menuData: [] as RouteItems,
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
});

const addTeamMember = () => {
  state.teamMembers.push({ name: '', studentId: '', phone: '' });
};

const removeTeamMember = (index: number) => {
  state.teamMembers.splice(index, 1);
}


// 获取 pinia 中的路由
const getMenuData = (routes: RouteItems) => {
  const arr: RouteItems = [];
  routes.map((val: RouteItem) => {
    val['title'] = i18n.global.t(val.meta?.title as string);
    arr.push({ ...val });
    if (val.children) getMenuData(val.children);
  });
  return arr;
};
// 打开弹窗
const openDialog = (type: string, row?: any) => {
  state.data.campus = props.campus;
  state.data.bookingWay = props.bookingWay;
  state.data.row = props.row;
  state.selectedEvent = state.events[state.data.row];
  state.events.forEach((event, index) => {
    if (!state.accessibleEvents.includes(index)) {
      state.events[index] += "（该场次不可预约）";
    }
  });
  console.log('000000000000');

  if (type === 'edit') {
    // 模拟数据，实际请走接口
    row.menuType = 'menu';
    row.menuSort = Math.floor(Math.random() * 100);
    state.ruleForm = JSON.parse(JSON.stringify(row));
    state.dialog.title = '修改菜单';
    state.dialog.submitTxt = '修 改';
  } else {
    state.dialog.title = '新增菜单';
    state.dialog.submitTxt = '新 增';
    // 清空表单，此项需加表单验证才能使用
    // nextTick(() => {
    // 	menuDialogFormRef.value.resetFields();
    // });
  }
  state.dialog.type = type;
  state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false;
};
// 是否内嵌下拉改变
// 取消
const onCancel = () => {
  closeDialog();
};

// 提交
const onSubmit = () => {
  closeDialog(); // 关闭弹窗
  emit('refresh');
  // if (state.dialog.type === 'add') { }
  // setBackEndControlRefreshRoutes() // 刷新菜单，未进行后端接口测试
};

// 页面加载时
onMounted(() => {
  state.menuData = getMenuData(routesList.value);
});

// 暴露变量
defineExpose({
  openDialog,
});
</script>
