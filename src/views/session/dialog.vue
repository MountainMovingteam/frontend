<template>
  <div class="system-menu-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :before-close="handleClose">
      <el-descriptions
        title="场次信息"
        direction="vertical"
        :column="6"
        border
      >
        <el-descriptions-item label="预约校区">
          <div v-if="state.data.campus=='xueyuan'" :span='3'>
                学院路校区
              </div>
              <div v-else>
                沙河校区
              </div>
            </el-descriptions-item>
        <el-descriptions-item label="预约日期" :span='3'>{{showDate(state.data.column, state.data.week_num)}}</el-descriptions-item>
        <el-descriptions-item label="预约场次" :span='3'>{{state.selectedEvent}}</el-descriptions-item>
        <el-descriptions-item label="讲解员" :span='6' label-align='center' align='center'>{{state.assistant}}</el-descriptions-item>
        <el-descriptions-item label="团队预约数量" :span='3'>
          <div v-if="state.hasTeam">1 </div>
          <div v-else>0</div>
        </el-descriptions-item>
        <el-descriptions-item label="个人预约数量" :span='3'>{{state.individual}}</el-descriptions-item>
  </el-descriptions>
  <el-tabs v-model="activeName"  type='border-card'>
    <el-tab-pane label="团队预约" name="first">
        <SessionTable
          ref="tableRef"
          v-bind="teamData.tableData"
          @rejectRow='onRejectRow'
        />
    </el-tab-pane>
    <el-tab-pane label="个人预约" name="second">
      <SessionTable
          ref="tableRef"
          v-bind="singleData.tableData"
          @rejectRow='onRejectRow'
        />
    </el-tab-pane>
  </el-tabs>
<!--      <template #footer>-->
<!--				<span class="dialog-footer">-->
<!--					<el-button @click="onCancel" size="default">取 消</el-button>-->
<!--					<el-button type="success" @click="onSubmit" size="default">-->
<!--            <el-icon>-->
<!--              <ele-Check/>-->
<!--            </el-icon>-->
<!--            确定预约-->
<!--          </el-button>-->
<!--				</span>-->
<!--      </template>-->
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
  week_num: {
    type: Number,
    default: 0,
  },
  time_index: {
    type: Number,
    default: 0,
  }
});

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh', 'updateCampus', 'updateBookingWay']);

// 引入组件
const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));
const activeName = ref('first')

// 定义变量内容
const SessionTable = defineAsyncComponent(() => import('/@/components/table/sessionDialogTable.vue'));
const menuDialogFormRef = ref();
const stores = useRoutesList();
const { routesList } = storeToRefs(stores);
const tableRef = ref<any>();
const teamData = reactive<any>({
  tableData:{
    data: [],
    // 表头内容（必传，注意格式）
    header: [
      {key: 'name', colWidth: '', title: '负责人姓名', type: 'text', isCheck: true},
      {key: 'student_id', colWidth: '', title: '负责人学号', type: 'text', isCheck: true},
      {key: 'phone', colWidth: '', title: '负责人电话', type: 'text', isCheck: true},
      {key: 'op', colWidth: '', title: '操作', type: 'button',btType:'danger', isCheck: true},
    ],    // 配置项
    config: {
      total: 0,
      loading: false, // loading 加载
      isBorder: true, // 是否显示表格边框
      isSerialNo: false, // 是否显示表格序号
      isSelection: false, // 是否显示表格多选
      isOperate: false, // 是否显示表格操作栏
    },
  }
}) 
const singleData = reactive<any>({
  tableData:{
    data: [],
    // 表头内容（必传，注意格式）
    header: [
      {key: 'name', colWidth: '', title: '姓名', type: 'text', isCheck: true},
      {key: 'student_id', colWidth: '', title: '学号', type: 'text', isCheck: true},
      {key: 'phone', colWidth: '', title: '电话', type: 'text', isCheck: true},
      {key: 'op', colWidth: '', title: '操作', type: 'button',btType:'danger', isCheck: true},
    ],    // 配置项
    config: {
      total: 0,
      loading: false, // loading 加载
      isBorder: true, // 是否显示表格边框
      isSerialNo: true, // 是否显示表格序号
      isSelection: false, // 是否显示表格多选
      isOperate: false, // 是否显示表格操作栏
    },
  }
}) 
const state = reactive({
  data : {
    campus: '',
    bookingWay: '',
    row: 0,
    column: 0,
    week_num: 0,
    time_index: 0,
  },
  list: [],
  selectedDay: '',
  days: initializeDays(),
  selectedEvent: '',
  events : ['第1场 8:00-9:30', '第2场 10:00-11:30', '第3场 14:00-15:30', '第4场 16:00-17:30'],
  accessibleEvents: [1, 2, 3],
  teamMembers: [
    { name: '', studentId: '', phone: '' }
  ],
  personalInfo: { name: '', studentId: '', phone: '' }, // 初始个人信息
  hasTeam:false,
  assistant:'abc',
  individual:0,
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
  state.assistant = '';
  teamData.tableData.data = [];
  singleData.tableData.data = [];
  state.hasTeam = false;
  state.individual = 0;
}


const showDate = (column: number, index: number) => {
  const offset = index == 0 ? 0 : 7;
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay(); // 获取当前星期几，0代表周日
  const dayDifference = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // 如果是周日，减去6天；否则，减去对应的天数
  const mondayDate = new Date(currentDate);
  mondayDate.setDate(currentDate.getDate() - dayDifference);
  const expectDate = new Date(currentDate);
  expectDate.setDate(mondayDate.getDate() +column - 1 + offset);
  const formattedDate = expectDate.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
  const formattedDay = expectDate.toLocaleDateString('zh-CN', { weekday: 'long' });

  return `${formattedDate} ${formattedDay}`;
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

const getTableData = () => {
  refreshData();
  const response = getSearchDetails(state.data.week_num, state.data.time_index);
  //const response = getSearchDetails(1, 1);
  response.then(response => {
    const data = response.data;
    state.list = data.list;
    state.list.forEach(function(item: any){
      if (item.order_type === 'team') {
        teamData.tableData.data.push({
          'name':item.name,
          'student_id':item.id,
          'phone':item.phone,
          'status':'未生效',
          'op':"驳回",
          'order_id':item.order_id
        })
        state.hasTeam=true
      } else {
        singleData.tableData.data.push({
          'name':item.name,
          'student_id':item.id,
          'phone':item.phone,
          'status':'未生效',
          'op':"驳回",
          'order_id':item.order_id
        })
        state.individual = state.individual + 1;
      }
    });
  })
}
const handleClose = () => {
  state.dialog.isShowDialog = false;
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
const openDialog = (type: string, assist:any) => {
  state.data.campus = props.campus;
  state.data.bookingWay = props.bookingWay;
  state.data.row = props.row;
  state.selectedEvent = state.events[state.data.row];
  state.data.column = props.column;
  state.selectedDay = state.days[state.data.column - 1];
  state.data.week_num = props.week_num;
  state.data.time_index = props.time_index;
  getTableData();
  state.dialog.title = '预约信息';
  state.dialog.isShowDialog = true;
  teamData.tableData.data = [];
  singleData.tableData.data = [];
  state.hasTeam = false;
  state.individual = 0;
  if (assist) {
    state.assistant = assist.trim().split('\n').join(', ');
  } else {
    state.assistant = '暂无讲解员'
  }
};
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false;
};

onMounted(() => {
  state.menuData = getMenuData(routesList.value);
  activeName.value = 'first';
  state.hasTeam=false;
  state.individual = 0;
});

const onRejectRow = async (row:EmptyObjectType,reason:any) => {
  //console..log(row.order_id);
  //console..log(state.data.time_index);
  //console..log(state.data.week_num);
  const data = {
    option:reason,
    week_num:state.data.week_num,
    time_index:state.data.time_index,
    order_id:row.order_id
  } 
  try {
    const response = await rejectOppointment(data);
    ElMessage.success('驳回成功');
    tableRef.value.dealChoice();
  } catch (error) {
      ElMessage.error('驳回失败')
  }
  getTableData();

}

// 暴露变量
defineExpose({
  openDialog,
});
</script>

<style>
hr {
  border-top: 1px solid #ccc;
  margin: 3px 0;
  width: 95%;
}
</style>
