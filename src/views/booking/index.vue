<template>
  <div class="table-demo-container layout-padding">
    <div class="table-demo-padding layout-padding-view layout-padding-auto">
      <div class="layout-pd">
        <el-alert
            :title="'预约须知：学院路周三下午体验馆不开放对外预约，个人预约仅可预约周二晚时段，如个人预约时段人数少于10人则自动取消，请同学们关注邮箱或本平台通知'"
            type="warning"
            :closable="false"
        ></el-alert>
      </div>
      <div>
        <el-form-item class="mb1">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;校区选择：
        </el-form-item>
      </div>
      <div class="system-menu-search mb15">
        &nbsp;
        <el-button size="default" :type="selectedLocation === 'xueyuan' ? 'info' : 'white'" class="ml10" @click="selectLocation('xueyuan')">
          <el-icon>
            <ele-Monitor />
          </el-icon>
          学院路校区
        </el-button>
        &nbsp; &nbsp;
        <el-button size="default" :type="selectedLocation === 'shahe' ? 'info' : 'white'" class="ml10" @click="selectLocation('shahe')">
          <el-icon>
            <ele-Promotion />
          </el-icon>
          &nbsp;&nbsp;沙河校区&nbsp;&nbsp;
        </el-button>
      </div>
      <div>
        <el-form-item class="mb1">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;预约方式选择：
        </el-form-item>
      </div>
      <div class="system-menu-search mb15">
        &nbsp;
        <el-button size="default" :type="selectedWay === 'group' ? 'info' : 'white'" class="ml10" @click="selectWay('group')">
          <el-icon>
            <ele-Ship />
          </el-icon>
          &nbsp;&nbsp;团队预约&nbsp;
        </el-button>
        &nbsp;&nbsp;&nbsp;
        <el-button size="default" :type="selectedWay === 'single' ? 'info' : 'white'" class="ml10" @click="selectWay('single')">
          <el-icon>
            <ele-User />
          </el-icon>
          &nbsp;&nbsp;个人预约&nbsp;&nbsp;
        </el-button>
      </div>
      <div v-if="selectedLocation === 'xueyuan' && selectedWay === 'group'">
        <Table
            ref="tableRef"
            v-bind="stateXyGroup.tableData"
            class="booking-table-demo"
            @cellClick = "onCellClick"
        />
      </div>
      <div v-else-if="selectedLocation === 'shahe'&& selectedWay === 'group'">
        <Table
            ref="tableRef"
            v-bind="stateShGroup.tableData"
            class="booking-table-demo"
            @cellClick = "onCellClick"
        />
      </div>
      <div v-else-if="selectedLocation === 'xueyuan'&& selectedWay === 'single'">
        <Table
            ref="tableRef"
            v-bind="stateXySingle.tableData"
            class="booking-table-demo"
            @cellClick = "onCellClick"
        />
      </div>
      <div v-else-if="selectedLocation === 'shahe'&& selectedWay === 'single'">
        <Table
            ref="tableRef"
            v-bind="stateShSingle.tableData"
            class="booking-table-demo"
            @cellClick = "onCellClick"
        />
      </div>
    </div>
    <div class="flex-warp-item-box" style="display: flex; justify-content: center; margin-top: 20px;">
      <el-button type="success" size="large" @click="onOpenSubmit">
        <el-icon>
          <ele-Check />
        </el-icon>
        提交预约
      </el-button>
    </div>
    <SubmitDialog :campus="selectedLocation"
                  :bookingWay="selectedWay"
                  :row="selectedRow"
                  :column="selectedColumn"
                  ref="submitDialogRef"
                  @refresh="getTableData()"
                  @updateCampus="updateCampus"
                  @updateBookingWay="updateBookingWay"
    />
  </div>
</template>

<script setup lang="ts">
import {defineAsyncComponent, onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";

const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight)

const selectedLocation = ref('xueyuan');
const selectedWay = ref('group');
const events = ['8:00-9:30', '10:00-11:30', '14:00-15:30', '16:00-17:30'];

const selectedRow = ref(0);
const selectedColumn = ref(0);

const updateCampus = (campus: string) => {
  console.log('hiiiiiiiiiiiiiiiiiiiiiiiiii')
  selectLocation(campus);
}

const updateBookingWay = (bookingway: string) => {
  console.log('he')
  selectWay(bookingway);
}

function selectLocation(location: string) {
  selectedLocation.value = location;
  selectedRow.value = 0;
  selectedColumn.value = 0;
}

function selectWay(way: string) {
  selectedWay.value = way;
  selectedRow.value = 0;
  selectedColumn.value = 0;
}
const SubmitDialog = defineAsyncComponent(() => import('/@/views/booking/dialog.vue'));
const Table = defineAsyncComponent(() => import('/@/components/table/bookingTable.vue'));
// 定义变量内容
const submitDialogRef = ref();
const tableRef = ref<RefType>();
const stateXyGroup = reactive<TableState>({
  tableData: {
    // 列表数据（必传）
    data: [],
    // 表头内容（必传，注意格式）
    header: [
      { key: 'event', colWidth: '150px', title: '场次', type: 'text', isCheck: true },
      { key: 'day1', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(new Date()), type: 'text', isCheck: true },
      { key: 'day2', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 1)), type: 'text', isCheck: true },
      { key: 'day3', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 2)), type: 'text', isCheck: true },
      { key: 'day4', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 3)), type: 'text', isCheck: true },
      { key: 'day5', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 4)), type: 'text', isCheck: true },
      { key: 'day6', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 5)), type: 'text', isCheck: true },
      { key: 'day7', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 6)), type: 'text', isCheck: true },
    ],    // 配置项
    config: {
      total: 0,
      loading: true, // loading 加载
      isBorder: false, // 是否显示表格边框
      isSerialNo: false, // 是否显示表格序号
      isSelection: false, // 是否显示表格多选
      isOperate: false, // 是否显示表格操作栏
    },
  },
});

const stateShGroup = reactive<TableState>({
  tableData: {
    // 列表数据（必传）
    data: [],
    // 表头内容（必传，注意格式）
    header: [
      { key: 'event', colWidth: '150px', title: '场次', type: 'text', isCheck: true },
      { key: 'day1', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(new Date()), type: 'text', isCheck: true },
      { key: 'day2', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 1)), type: 'text', isCheck: true },
      { key: 'day3', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 2)), type: 'text', isCheck: true },
      { key: 'day4', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 3)), type: 'text', isCheck: true },
      { key: 'day5', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 4)), type: 'text', isCheck: true },
      { key: 'day6', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 5)), type: 'text', isCheck: true },
      { key: 'day7', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 6)), type: 'text', isCheck: true },
    ],
    // 配置项
    config: {
      total: 0,
      loading: true, // loading 加载
      isBorder: false, // 是否显示表格边框
      isSerialNo: false, // 是否显示表格序号
      isSelection: false, // 是否显示表格多选
      isOperate: false, // 是否显示表格操作栏
    },
  },
});

const stateXySingle = reactive<TableState>({
  tableData: {
    // 列表数据（必传）
    data: [],
    // 表头内容（必传，注意格式）
    header: [
      { key: 'event', colWidth: '150px', title: '场次', type: 'text', isCheck: true },
      { key: 'day1', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(new Date()), type: 'text', isCheck: true },
      { key: 'day2', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 1)), type: 'text', isCheck: true },
      { key: 'day3', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 2)), type: 'text', isCheck: true },
      { key: 'day4', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 3)), type: 'text', isCheck: true },
      { key: 'day5', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 4)), type: 'text', isCheck: true },
      { key: 'day6', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 5)), type: 'text', isCheck: true },
      { key: 'day7', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 6)), type: 'text', isCheck: true },
    ],
    // 配置项
    config: {
      total: 0,
      loading: true, // loading 加载
      isBorder: false, // 是否显示表格边框
      isSerialNo: false, // 是否显示表格序号
      isSelection: false, // 是否显示表格多选
      isOperate: false, // 是否显示表格操作栏
    },
  },
});

const stateShSingle = reactive<TableState>({
  tableData: {
    // 列表数据（必传）
    data: [],
    // 表头内容（必传，注意格式）
    header: [
      { key: 'event', colWidth: '150px', title: '场次', type: 'text', isCheck: true },
      { key: 'day1', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(new Date()), type: 'text', isCheck: true },
      { key: 'day2', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 1)), type: 'text', isCheck: true },
      { key: 'day3', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 2)), type: 'text', isCheck: true },
      { key: 'day4', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 3)), type: 'text', isCheck: true },
      { key: 'day5', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 4)), type: 'text', isCheck: true },
      { key: 'day6', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 5)), type: 'text', isCheck: true },
      { key: 'day7', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: formatDate(addDays(new Date(), 6)), type: 'text', isCheck: true },
    ],
    // 配置项
    config: {
      total: 0,
      loading: true, // loading 加载
      isBorder: false, // 是否显示表格边框
      isSerialNo: false, // 是否显示表格序号
      isSelection: false, // 是否显示表格多选
      isOperate: false, // 是否显示表格操作栏
    },
  },
});

function formatDate(date: any) {
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('zh', options);
  return `${formattedDate.replace(/星期/, ' 星期')}`;
}

function addDays(date: any, days: any) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// 初始化列表数据
const getTableData = () => {
  stateXyGroup.tableData.config.loading = true;
  stateShGroup.tableData.config.loading = true;
  stateXySingle.tableData.config.loading = true;
  stateShSingle.tableData.config.loading = true;
  for (let i = 0; i < 4; i++) {
    stateXyGroup.tableData.data.splice(i, 1, {
      event: `第${i + 1}场 ${events[i]}`,
      day1: "#6ef848", // 使用颜色名称
      day2: "#99FF99", // 使用十六进制颜色码
      day3: "#99FF99", // 使用 RGB 颜色值
      day4: "#99FF99",
      day5: "#99FF99",
      day6: "#99FF99",
      day7: "#99FF99",
    });

    stateShGroup.tableData.data.splice(i, 1, {
      event: `第${i + 1}场 ${events[i]}`,
      day1: "#f54545", // 使用颜色名称
      day2: "#99FF99", // 使用十六进制颜色码
      day3: "#99FF99", // 使用 RGB 颜色值
      day4: "#90EE90",
      day5: "#90EE90",
      day6: "#90EE90",
      day7: "#90EE90",
    });

    stateXySingle.tableData.data.splice(i, 1, {
      event: `第${i + 1}场 ${events[i]}`,
      day1: "#f54545", // 使用颜色名称
      day2: "#f54545", // 使用十六进制颜色码
      day3: "#f54545", // 使用 RGB 颜色值
      day4: "#99FF99",
      day5: "#f54545",
      day6: "#f54545",
      day7: "#99FF99",
    });

    stateShSingle.tableData.data.splice(i, 1, {
      event: `第${i + 1}场 \n\n ${events[i]}`,
      day1: "#f54545", // 使用颜色名称
      day2: "#f54545", // 使用十六进制颜色码
      day3: "#f54545", // 使用 RGB 颜色值
      day4: "#99FF99",
      day5: "#f54545",
      day6: "#99FF99",
      day7: "#99FF99",
    });
  }

  stateXyGroup.tableData.config.total = stateXyGroup.tableData.data.length;
  stateShGroup.tableData.config.total = stateShGroup.tableData.data.length;
  stateXySingle.tableData.config.total = stateXySingle.tableData.data.length;
  stateShSingle.tableData.config.total = stateShSingle.tableData.data.length;
  setTimeout(() => {
    stateXyGroup.tableData.config.loading = false;
  }, 500);
  setTimeout(() => {
    stateShGroup.tableData.config.loading = false;
  }, 500);
  setTimeout(() => {
    stateXySingle.tableData.config.loading = false;
  }, 500);
  setTimeout(() => {
    stateShSingle.tableData.config.loading = false;
  }, 500);
};

function getScreenSize() {
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
}


const onCellClick = (info: any) => {
  console.log('点击的行数据:', info.row);
  console.log('点击的列数据:', info.column);
  selectedRow.value = info.row;
  selectedColumn.value = info.column;
}

function areValuesValid(rowValue: number, columnValue: number) {
  const isRowInRange = rowValue >= 0 && rowValue <= 3;
  const isColumnInRange = columnValue >= 1 && columnValue <= 7;
  return isRowInRange && isColumnInRange;
}

const onOpenSubmit = (type: string) => {
  if (areValuesValid(selectedRow.value, selectedColumn.value)) {
    submitDialogRef.value.openDialog(type);
  } else {
    ElMessage({
      type: 'warning',
      message: '请选择预约时间'
    });
  }
};

onMounted(() => {
  getScreenSize();
  getTableData();

});

</script>

<style scoped lang="scss">
.table-demo-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  .table-demo-padding {
    overflow: auto;
    padding: 15px;
    .boooking-table-demo {
      white-space: pre-line;
      flex: 1;
      overflow: auto;
    }
  }
}
</style>