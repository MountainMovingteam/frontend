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
              <el-select v-model="state.selectedDay" placeholder="请选择预约日期" class="w100" @change="updateDate">
                <el-option
                    v-for="(day, index) in state.days"
                    :key="index"
                    :label="day"
                    :value="day"
                >
                  {{ day }}
                  <!--                  //asd-->
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="预约场次">
              <el-select v-model="state.selectedEvent" placeholder="请选择预约场次" class="w100" @change="updateSession">
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
            <el-form :model="state" :rules="rules" ref="form">
              <el-form-item label="团队信息" :span="24"></el-form-item>
                <el-upload
                    class="upload-demo"
                    drag
                    :limit="1"
                    :before-upload="beforeUpload"
                    v-model:file-list="uploadFile"
                    ref="uploadRef"
                    action="#"
                    :auto-upload="false"
                    style="margin-bottom: 30px;"
                    :on-exceed="handleExceed"
                >
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text">
                    点击此处上传文件批量导入团队信息
                  </div>

                  <template #tip>
                    <div class="el-upload__tip">
                      请上传excel文件，格式要求为两列（学号，姓名），无需提供负责人的信息，
                      <a href="javascript:void(0);" @click="downloadModel()">点击这里下载模板文件</a>
                    </div>
                  </template>
                </el-upload>
              <el-button type="success" style="margin-bottom: 10px" class="success-button" @click="UploadAll">提交文件</el-button>


              <template v-for="(member, index) in state.teamMembers" >
                <el-row class="mb10" type="flex" justify="space-between">
                  <span style="margin-left: 5px; font-weight: bold;">成员{{ index === 0 ? index + 1 + '（负责人）' : index + 1 }}</span>
                  <el-form-item style="margin-right: 18px;" v-if="index != 0" >
                    <el-col>
                      <el-button @click="removeTeamMember(index)" type="danger" size="small">删除该成员</el-button>
                    </el-col>
                  </el-form-item>
                </el-row>

                <el-form-item :span="24" class="mb20" label="姓名" :prop="'teamMembers[' + index + '].name'" :rules="rules.teamMembers[index].name">
                  <el-col>
                    <el-input v-model="member.name" placeholder="姓名" v-bind:disabled="isDisabled(index)"></el-input>
                  </el-col>
                </el-form-item>
                <div style="margin-top: 20px;"></div>
                <el-form-item :span="24" class="mb20" label="学号" :prop="'teamMembers[' + index + '].studentId'" :rules="rules.teamMembers[index].studentId">
                  <el-col>
                    <el-input v-model="member.studentId" placeholder="学号" v-bind:disabled="isDisabled(index)"></el-input>
                  </el-col>
                </el-form-item>
                <div style="margin-top: 20px;"></div>
                <el-form-item :span="24" v-if="index === 0" class="mb20" label="电话" :prop="'teamMembers[' + index + '].phone'" :rules="rules.teamMembers[index].phone">
                  <el-col>
                    <el-input v-model="member.phone" placeholder="电话号码" clearable></el-input>
                  </el-col>
                </el-form-item>
                <div style="margin-top: 20px;"></div>
                <el-form-item :span="24" v-if="index === 0" class="mb20" label="学院" :prop="'teamMembers[' + index + '].college'" :rules="rules.teamMembers[index].college">
                  <el-col>
                    <el-input v-model="member.college" placeholder="系号+学院名称，例如“6系 计算机学院”" clearable></el-input>
                  </el-col>
                </el-form-item>
                <div style="margin-top: 20px;"></div>
                <el-button style="margin-top: 20px;" v-if="index === state.teamMembers.length - 1 && state.teamMembers.length < state.selectedCapacity[state.events.indexOf(state.selectedEvent)]"
                           @click="addTeamMember">增加成员</el-button>
              </template>
            </el-form>
          </el-col>

          <el-col v-else-if="state.data.bookingWay === 'single'" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb10">
            <el-form :model="state" :rules="rules" ref="form">
              <el-form-item label="个人信息"></el-form-item>

              <el-form-item :span="24" class="mb20" label="姓名" prop="personalInfo.name" :rules="rules.personalInfo.name">
                <el-col>
                  <el-input v-model="state.personalInfo.name" placeholder="姓名" :disabled="true"></el-input>
                </el-col>
              </el-form-item>
              <div style="margin-top: 20px;"></div>
              <el-form-item :span="24" class="mb20" label="学号" prop="personalInfo.studentId" :rules="rules.personalInfo.studentId" >
                <el-col>
                  <el-input v-model="state.personalInfo.studentId" placeholder="学号" :disabled="true"></el-input>
                </el-col>
              </el-form-item>
              <div style="margin-top: 20px;"></div>
              <el-form-item :span="24" class="mb20" label="电话" prop="personalInfo.phone" :rules="rules.personalInfo.phone">
                <el-col>
                  <el-input v-model="state.personalInfo.phone" placeholder="电话号码" clearable></el-input>
                </el-col>
              </el-form-item>
              <div style="margin-top: 20px;"></div>
              <el-form-item :span="24" class="mb20" label="学院" prop="personalInfo.college" :rules="rules.personalInfo.college">
                <el-col>
                  <el-input v-model="state.personalInfo.college" placeholder="系号+学院名称，例如“6系 计算机学院”" clearable></el-input>
                </el-col>
              </el-form-item>
            </el-form>
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
import { i18n } from '/@/i18n';
import {ElMessage, genFileId, type UploadInstance, UploadProps, UploadRawFile} from "element-plus";
import {groupBooking, singleBooking, upload} from "/@/api/booking";
import {PropType} from "vue-demi";
import {reqInfo} from "/@/api/user";
import {UploadFilled} from "@element-plus/icons-vue";
import download from "/@/utils/exportXLSX";
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
  groupColors: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  singleColors: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  capacity: {
    type: Array as PropType<number[]>,
    default: () => [],
  }
});

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh', 'updateCampus', 'updateBookingWay']);

// 引入组件
defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));
// 定义变量内容
const menuDialogFormRef = ref();
const stores = useRoutesList();
const { routesList } = storeToRefs(stores);
const regex = /^\d+/;
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
  accessibleEvents: [] as number[],
  groupColors: [] as string[],
  singleColors: [] as string[],
  capacity: [] as number[],
  selectedCapacity: [] as number[],
  teamMembers: [
    { name: '', studentId: '', phone: '', college: ''}
  ],
  personalInfo: { name: '', studentId: '', phone: '', college: ''},
  resolvedList: [
      { name: '', id: ''}
  ],
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

const rules = reactive({
  teamMembers: (() => {
    const members = [];
    members.push({
      name: [
        { required: true, message: '请输入负责人的姓名', trigger: 'blur' }
      ],
      studentId: [
        { required: true, message: '请输入负责人的学号', trigger: 'blur' }
      ],
      phone: [
        { required: true, message: '请输入负责人的电话号码', trigger: 'blur' }
      ],
      college: [
        { required: true, message: '请输入系号+学院名称，例如“6系 计算机学院”', trigger: 'blur' }
      ]
    });
    for (let i = 1; i < 20; i++) {
      members.push({
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        studentId: [
          { required: true, message: '请输入学号', trigger: 'blur' }
        ],
        phone: [],
        college: []
      });
    }
    return members;
  })(),
  personalInfo: {
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    studentId: [
      { required: true, message: '请输入学号', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入电话号码', trigger: 'blur' }
    ],
    college: [
      { required: true, message: '请输入系号+学院名称，例如“6系 计算机学院”', trigger: 'blur' }
    ]
  }
});

const isDisabled = (index: number) => {
  return index === 0;
}

const refreshData = () => {
  state.teamMembers.splice(state.selectedCapacity[state.events.indexOf(state.selectedEvent)]);
  // console.log(state.selectedCapacity[state.events.indexOf(state.selectedEvent)]);
  // const firstMember = state.teamMembers[0];
  // firstMember.name = '';
  // firstMember.studentId = '';
  // firstMember.phone = '';
  // firstMember.college = '';

  // state.personalInfo.name = '';
  // state.personalInfo.studentId = '';
  // state.personalInfo.phone = '';
  // state.personalInfo.college = '';
}

const addTeamMember = () => {
  state.teamMembers.push({ name: '', studentId: '', phone: '', college: ''});
};

const removeTeamMember = (index: number) => {
  state.teamMembers.splice(index, 1);
}

const labelText = (index: number, event: string) => {
  if (!state.accessibleEvents.includes(index)) {
    return event + "（该时间段不可预约）";
  } else {
    return event + `（剩余可预约人数${state.selectedCapacity[index]}人）`;
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

const downloadModel = () => {
  const json = [{
    "学号": "",
    "姓名": ""
  }]
  download(json, '团队预约导入模板.xlsx');
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
  state.groupColors = props.groupColors;
  state.singleColors = props.singleColors;
  state.capacity = props.capacity;
  let start = 4 * (state.data.column - 1) + 1;
  if (state.data.campus === 'shahe') {
    start += 28;
  }
  // console.log("start" + start);
  state.selectedCapacity = [];
  for (let i = start;i < start + 4;i++) {
    state.selectedCapacity.push(state.capacity[i]);
  }
  // console.log(state.selectedCapacity);
  state.accessibleEvents = [];
  for(let i = start; i < start + 4;i++) {
    if (state.data.bookingWay === 'group') {
      if (state.groupColors[i] == "#99FF99") {
        state.accessibleEvents.push(i - start);
      }
    } else {
      if (state.singleColors[i] == "#99FF99") {
        state.accessibleEvents.push(i - start);
      }
    }
  }
  if (type === 'edit') {
    // 模拟数据，实际请走接口
    row.menuType = 'menu';
    row.menuSort = Math.floor(Math.random() * 100);
    state.ruleForm = JSON.parse(JSON.stringify(row));
    state.dialog.title = '预约信息';
    state.dialog.submitTxt = '修 改';
  } else {
    state.dialog.title = '预约信息';
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

const changeState = (campus: string, selectedDay: string, way: string) => {
  let start = 4 * (state.data.column - 1) + 1;
  if (selectedDay != null) {
    start = 4 * state.days.indexOf(selectedDay) + 1;
  }
  if (campus != null && campus =='shahe') {
    start += 28;
  }
  state.selectedCapacity = [];
  for (let i = start;i < start + 4;i++) {
    state.selectedCapacity.push(state.capacity[i]);
  }
  state.accessibleEvents = [];
  for(let i = start; i < start + 4;i++) {
    if (way == 'group') {
      if (state.groupColors[i] == "#99FF99") {
        state.accessibleEvents.push(i - start);
      }
    } else {
      if (state.singleColors[i] == "#99FF99") {
        state.accessibleEvents.push(i - start);
      }
    }
  }
}

const updateCampus = (campus: string) => {
  changeState(campus, state.selectedDay, state.data.bookingWay);
  emit('updateCampus', campus)
}

const updateDate = (selectedDay: string) => {
  refreshData();
  changeState(state.data.campus, selectedDay, state.data.bookingWay);
}

const updateBookingWay = (way: string) => {
  refreshData();
  changeState(state.data.campus, state.selectedDay, way)
  emit('updateBookingWay', way)
}

const updateSession = () => {
  refreshData();
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
  if (state.accessibleEvents.indexOf(state.events.indexOf(state.selectedEvent)) == -1) {
    ElMessage({
      type: 'error',
      message: '请选择有效时间段！'
    });
    return false;
  }
  if (state.teamMembers.length < 10) {
    ElMessage({
      type: 'error',
      message: '团队预约至少超过10人！'
    });
    return false;
  }
  const leader = state.teamMembers[0];
  const otherMembers = state.teamMembers.slice(1);
  if (leader.name.trim() === '' || leader.studentId.trim() === ''
      || leader.phone.trim() === '' || leader.college.trim() === '') {
    ElMessage({
      type: 'error',
      message: '请完整填写负责人的个人信息！'
    });
    return false;
  }
  if (!regex.test(leader.college.trim())) {
    ElMessage({
      type: 'error',
      message: '请保证在开头输入系号！'
    });
    return false;
  }
  for (const member of otherMembers) {
    if (member.name.trim() === '' || member.studentId.trim() === '') {
      ElMessage({
        type: 'error',
        message: '请完整填写其他成员个人信息！'
      });
      return false;
    }
  }
  return true;
}

const onGroupBooking = () => {
  const [leader, ...persons] = state.teamMembers;
  const leaderObj = {
    name: leader.name,
    id: leader.studentId,
    phone: leader.phone
  };
  const personsArr = persons.map(({name, studentId }) => ({id: studentId, name: name}));
  const matchResult = state.teamMembers[0].college.trim().match(regex);
  let collegeNumber = parseInt(<string>matchResult?.[0], 10);
  let time_index = (state.data.column - 1) * 4 + state.data.row + 1;
  if (state.data.campus == 'shahe') {
    time_index += 28;
  }
  const response = groupBooking(leaderObj, personsArr, collegeNumber, time_index);
  response
      .then(() => {
        ElMessage({
          type: 'success',
          message: '预约成功'
        });
        closeDialog();
      })
      .catch(() => {
        ElMessage({
          type: 'error',
          message: '预约失败，请重试!',
        });
        closeDialog();
      });
}

const validateSingleBooking = () => {
  if (state.accessibleEvents.indexOf(state.events.indexOf(state.selectedEvent)) == -1) {
    ElMessage({
      type: 'error',
      message: '请选择有效时间段！'
    });
    return false;
  }
  const person = state.personalInfo;
  if (person.name.trim() === '' || person.studentId.trim() === '' || person.phone.trim() === '' || person.college.trim() === '') {
    ElMessage({
      type: 'error',
      message: '请完整填写个人信息！'
    });
    return false;
  }
  if (!regex.test(person.college.trim())) {
    ElMessage({
      type: 'error',
      message: '请保证在开头输入系号！'
    });
    return false;
  }
  return true;
}

const onSingleBooking = () => {
  let time_index = (state.data.column - 1) * 4 + state.data.row + 1;
  if (state.data.campus == 'shahe') {
    time_index += 28;
  }
  const matchResult = state.personalInfo.college.trim().match(regex);
  let collegeNumber = parseInt(<string>matchResult?.[0], 10);
  const response = singleBooking(
      time_index,
      state.personalInfo.name,
      state.personalInfo.studentId,
      state.personalInfo.phone,
      collegeNumber
  );
  response
      .then(() => {
        ElMessage({
          type: 'success',
          message: '预约成功'
        });
        closeDialog();
      })
      .catch(() => {
        ElMessage({
          type: 'error',
          message: '预约失败，请重试!',
        });
        closeDialog();
      });
}

// 提交
const onSubmit = () => {
  if (!validateSeletion()) {
    return;
  }
  if (state.data.bookingWay === 'group') {
    if (validateGroupBooking()) {
      onGroupBooking();
      refreshData();
      emit('refresh');
    } else {
      return;
    }
  } else {
    if (validateSingleBooking()) {
      onSingleBooking();
      refreshData();
      emit('refresh');
    } else {
      return;
    }
  }
};

const uploadRef = ref<UploadInstance>();
const uploadFile = ref<any[]>();

const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles();
  uploadFile.value = [];
  const file = files[0] as UploadRawFile
  file.uid = genFileId();
  uploadFile.value?.push(file);
  uploadRef.value!.handleStart(file);
}

const beforeUpload = (file: File) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
  if (!isExcel) {
    ElMessage.error('请上传excel文件');
    return false;
  }
  return true;
};

const UploadAll = () => {
  if (uploadFile.value != undefined) {
    const formData = new FormData();
    formData.append('file', uploadFile.value[0].raw);

    const response = upload(formData);
    response.then(response => {
      state.resolvedList =  Object.values(response.data).find(Array.isArray);
      console.log(state.resolvedList)
      if (state.resolvedList.length > 19) {
        ElMessage({
          type: 'error',
          message: '团队预约不得超过20人，文件中无需填写负责人的信息！',
        });
        return false;
      }
      state.teamMembers.splice(1);
      state.resolvedList.forEach(item => {
        console.log(item.name)
        let name = item.name === 'None' ? '' : item.name;
        let id = item.id === 'None' ? '' : item.id;
        state.teamMembers.push({ name: name, studentId: id, phone: '', college: ''});
      })
      ElMessage({
        type: 'success',
        message: '解析成功!',
      });
    }).catch(() => {
      ElMessage({
        type: 'error',
        message: '解析文件失败，请重试!',
      });
    });
  }
}

// 页面加载时
onMounted(() => {
  state.menuData = getMenuData(routesList.value);
  const response = reqInfo();
  response.then(response => {
    const data = response.data.student_info;

    state.personalInfo.name = data.name;
    state.personalInfo.studentId = data.id;

    const firstMember = state.teamMembers[0];
    firstMember.name = data.name;
    firstMember.studentId = data.id;

  })
});

// 暴露变量
defineExpose({
  openDialog,
});
</script>

<style>
.required-label .el-form-item__label::after {
  content: '*';
  color: red;
  margin-left: 4px;
}
.upload-demo {
  width: 100%;
}
.el-upload__text {
  color: #409EFF;
}
.el-upload__tip {
  color: #909399;
}
/* For small screens (max-width: 600px) */
@media (max-width: 600px) {
  .success-button {
    margin-left: 35%;
  }
}

/* For medium screens (min-width: 601px and max-width: 1024px) */
@media (min-width: 601px) and (max-width: 1024px) {
  .success-button {
    margin-left: 43%;
  }
}

/* For large screens (min-width: 1025px) */
@media (min-width: 1025px) {
  .success-button {
    margin-left: 43%;
  }
}
</style>
