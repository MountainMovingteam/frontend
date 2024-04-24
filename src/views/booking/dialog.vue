<template>
  <div class="system-menu-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="menuDialogFormRef" :model="state.ruleForm" size="default" label-width="80px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="校区选择">
              <el-radio-group v-model="state.data.campus" @change="updateCampus">
                <el-radio label="xueyuan">学院路校区</el-radio>
                <el-radio label="shahe">沙河校区</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="预约方式">
              <el-radio-group v-model="state.data.bookingWay" @change="updateBookingWay">
                <el-radio label="group">团队预约&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
                <el-radio label="single">个人预约</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="预约日期">
              <el-select v-model="state.selectedDay" placeholder="请选择预约日期" class="w100">
                <el-option
                    v-for="(day, index) in state.days"
                    :key="index"
                    :label="day"
                    :value="day"
                >
                  {{ day }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="预约场次">
              <el-select v-model="state.selectedEvent" placeholder="请选择预约场次" class="w100">
                <el-option
                    v-for="(event, index) in state.events"
                    :key="index"
                    :label="labelText(index, event)"
                    :value="event"
                    :disabled="!state.accessibleEvents.includes(index)"
                >
                  <span :style="{ color: !state.accessibleEvents.includes(index) ? 'gray' : 'inherit' }">{{ labelText(index, event)}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col v-if="state.data.bookingWay === 'group'" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="团队信息" :span="24"></el-form-item>
              <template v-for="(member, index) in state.teamMembers" >
                <el-row class="mb10" type="flex" justify="space-between">
                  <span style="margin-left: 12px; font-weight: bold;">成员{{ index === 0 ? index + 1 + '（负责人）' : index + 1 }}</span>
                  <el-form-item v-if="index != 0" >
                    <el-col>
                      <el-button @click="removeTeamMember(index)" type="danger" size="small">删除该成员</el-button>
                    </el-col>
                  </el-form-item>
                </el-row>

                <el-form-item :span="24">
                  <el-col class="mb10">
                    <el-input v-model="member.name" placeholder="姓名" clearable></el-input>
                  </el-col>
                </el-form-item>

                <el-form-item :span="24">
                  <el-col class="mb10">
                    <el-input v-model="member.studentId" placeholder="学号" clearable></el-input>
                  </el-col>
                </el-form-item>

                <el-form-item :span="24">
                  <el-col class="mb10">
                    <el-input v-model="member.phone" placeholder="电话号码" clearable></el-input>
                  </el-col>
                </el-form-item>

                <el-button v-if="index === state.teamMembers.length - 1 && state.teamMembers.length < 20"
                           @click="addTeamMember">增加成员</el-button>
              </template>
          </el-col>

          <el-col v-else-if="state.data.bookingWay === 'single'" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="个人信息"></el-form-item>
            <el-form-item :span="24">
              <el-col class="mb10">
              <el-input v-model="state.personalInfo.name" placeholder="姓名" clearable></el-input>
              </el-col>
            </el-form-item>

            <el-form-item :span="24">
              <el-col class="mb10">
                <el-input v-model="state.personalInfo.studentId" placeholder="学号" clearable></el-input>
              </el-col>
            </el-form-item>

            <el-form-item :span="24">
              <el-col class="mb10">
                <el-input v-model="state.personalInfo.phone" placeholder="电话号码" clearable></el-input>
              </el-col>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="success" @click="onSubmit" size="default">
            <el-icon>
              <ele-Check/>
            </el-icon>
            确定预约
          </el-button>
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
import {ElMessage} from "element-plus";
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
const emit = defineEmits(['refresh', 'updateCampus', 'updateBookingWay']);

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
  selectedDay: '',
  days: initializeDays(),
  selectedEvent: '',
  events : ['第1场 8:00-9:30', '第2场 10:00-11:30', '第3场 14:00-15:30', '第4场 16:00-17:30'],
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

const refreshData = () => {
  state.teamMembers.splice(1);
  const firstMember = state.teamMembers[0];
  firstMember.name = '';
  firstMember.studentId = '';
  firstMember.phone = '';

  state.personalInfo.name = '';
  state.personalInfo.studentId = '';
  state.personalInfo.phone = '';
}

const addTeamMember = () => {
  state.teamMembers.push({ name: '', studentId: '', phone: '' });
};

const removeTeamMember = (index: number) => {
  state.teamMembers.splice(index, 1);
}

const labelText = (index: number, event: string) => {
  if (!state.accessibleEvents.includes(index)) {
    return event + "（该时间段不可预约）";
  } else {
    return event;
  }
}

function initializeDays(): string[] {
  const days = [];
  const today = new Date(); // 获取今天的日期
  const dayOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today); // 创建一个新日期对象以避免修改原始日期
    date.setDate(today.getDate() + i); // 将日期设置为今天的日期加上 i 天

    const month = date.getMonth() + 1; // 月份从 0 开始，所以需要加 1
    const day = date.getDate(); // 获取日期
    const dayIndex = date.getDay(); // 获取星期几的索引

    const dayString = `${month}月${day}日 ${dayOfWeek[dayIndex]}`;
    days.push(dayString);
  }
  return days;
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
  state.data.column = props.column;
  state.selectedDay = state.days[state.data.column - 1];

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
// 取消
const onCancel = () => {
  closeDialog();
};

const updateCampus = (campus: string) => {
  emit('updateCampus', campus)
}

const updateBookingWay = (way: string) => {
  emit('updateBookingWay', way)
}

const validateSeletion = () => {
  if (state.selectedDay.trim() === '' || state.selectedEvent.trim() === '') {
    ElMessage({
      type: 'error',
      message: '请选择具体时间！'
    });
    return false;
  }
  return true;
}

const validateGroupBooking = () => {
  const leader = state.teamMembers[0];
  const otherMembers = state.teamMembers.slice(1);
  if (leader.name.trim() === '' || leader.studentId.trim() === '' || leader.phone.trim() === '') {
    ElMessage({
      type: 'error',
      message: '请完整填写负责人的个人信息！'
    });
    return false;
  }
  for (const member of otherMembers) {
    if (member.name.trim() === '' || member.studentId.trim() === '') {
      ElMessage({
        type: 'error',
        message: '请至少完整填写其他成员的姓名和学号！'
      });
      return false;
    }
  }
  return true;
}

const validateSingleBooking = () => {
  const person = state.personalInfo;
  if (person.name.trim() === '' || person.studentId.trim() === '' || person.phone.trim() === '') {
    ElMessage({
      type: 'error',
      message: '请完整填写个人信息！'
    });
    return false;
  }
  return true;
}

// 提交
const onSubmit = () => {
  if (!validateSeletion()) {
    return;
  }
  if (state.data.bookingWay === 'group') {
    if (validateGroupBooking()) {
      closeDialog();
      refreshData();
      ElMessage({
        type: 'success',
        message: '预约成功'
      });
      emit('refresh');
    } else {
      return;
    }
  } else {
    if (validateSingleBooking()) {
      closeDialog();
      refreshData();
      ElMessage({
        type: 'success',
        message: '预约成功'
      });
      emit('refresh');
    } else {
      return;
    }
  }
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
