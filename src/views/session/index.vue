<template>
  <div class="table-demo-container layout-padding">
    <div class="table-demo-padding layout-padding-view layout-padding-auto">
      <div class="system-menu-search mb15">
        <el-button size="large" :type="selectedLocation === 'xueyuan' ? 'primary' : 'info'" class="ml10"
                   @click="selectLocation('xueyuan')">
          <el-icon>
            <ele-Monitor/>
          </el-icon>
          学院路校区
        </el-button>
        <!--        学院路按钮-->
        <el-button size="large" :type="selectedLocation === 'shahe' ? 'primary' : 'info'" class="ml10"
                   @click="selectLocation('shahe')">
          <el-icon>
            <ele-Promotion/>
          </el-icon>
          &nbsp;&nbsp;沙河校区&nbsp;&nbsp;
        </el-button>
        <!--        沙河校区按钮-->
      </div>
      <!--      选择校区-->
      <div v-if="selectedLocation === 'xueyuan' ">
        <Table
            ref="tableRef"
            v-bind="xyTable.tableData"
            class="booking-table-demo"
            @cellClick="onCellClick"
        />
      </div>
      <div v-else-if="selectedLocation === 'shahe'">
        <Table
            ref="tableRef"
            v-bind="shTable.tableData"
            class="booking-table-demo"
            @cellClick="onCellClick"
        />
      </div>
    </div>
    <!--    预约按钮-->
        <SubmitDialog :campus="selectedLocation" :row="selectedRow" :column="selectedColumn" ref="submitDialogRef" @refresh="getTableData()"/>
  </div>
</template>

<script setup lang="ts">
import {defineAsyncComponent, onMounted, reactive, ref} from "vue";
import '/@/types/session.d.ts'
import {ElMessage} from "element-plus";

const selectedLocation = ref('xueyuan');
const submitDialogRef = ref();
const SubmitDialog = defineAsyncComponent(() => import('/@/views/session/dialog.vue'));
const Table = defineAsyncComponent(() => import('/@/components/table/sessionTable.vue'));
const xyTable = reactive<TableState>(<TableState>{
  tableData: {
    // 列表数据（必传）
    data: [],
    // 表头内容（必传，注意格式）
    header: [
      {key: 'event', colWidth: '150px', title: '场次', type: 'text', isCheck: true},
      {key: 'day1', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: '周一', type: 'text', isCheck: true},
      {key: 'day2', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: '周二', type: 'text', isCheck: true},
      {key: 'day3', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: '周三', type: 'text', isCheck: true},
      {key: 'day4', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: '周四', type: 'text', isCheck: true},
      {key: 'day5', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: '周五', type: 'text', isCheck: true},
      {key: 'day6', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: '周六', type: 'text', isCheck: true},
      {key: 'day7', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: '周日', type: 'text', isCheck: true},
    ],    // 配置项
    config: {
      total: 0,
      loading: true, // loading 加载
      isBorder: true, // 是否显示表格边框
      isSerialNo: false, // 是否显示表格序号
      isSelection: false, // 是否显示表格多选
      isOperate: false, // 是否显示表格操作栏
    },
  },
});
const shTable = reactive<TableState>(<TableState>{
  tableData: {
    // 列表数据（必传）
    data: [
    ],
    // 表头内容（必传，注意格式）
    header: [
      {key: 'event', colWidth: '150px', title: '场次', type: 'text', isCheck: true},
      {key: 'day1', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: '周一', type: 'text', isCheck: true},
      {key: 'day2', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: '周二', type: 'text', isCheck: true},
      {key: 'day3', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: '周三', type: 'text', isCheck: true},
      {key: 'day4', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: '周四', type: 'text', isCheck: true},
      {key: 'day5', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: '周五', type: 'text', isCheck: true},
      {key: 'day6', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: '周六', type: 'text', isCheck: true},
      {key: 'day7', colWidth: window.innerWidth <= 768 ? '100px' : '180px', title: '周日', type: 'text', isCheck: true},
    ],    // 配置项
    config: {
      total: 0,
      loading: true, // loading 加载
      isBorder: true, // 是否显示表格边框
      isSerialNo: false, // 是否显示表格序号
      isSelection: false, // 是否显示表格多选
      isOperate: false, // 是否显示表格操作栏
    },
  },
});
const selectedRow = ref(0);
const selectedColumn = ref(0);
const events = ['8:00-9:30', '10:00-11:30', '14:00-15:30', '16:00-17:30'];
function selectLocation(location: string) {
  selectedLocation.value = location;
}

const getTableData = () => {
  xyTable.tableData.config.loading = true;
  shTable.tableData.config.loading = true;
  for (let i = 0; i < 4; i++) {
    xyTable.tableData.data.push({
      event: `第${i + 1}场 ${events[i]}`,
      day1: `wangda`,
      day2: `lier`,
      day3: `zhangsan`,
      day4: `lisi`,
      day5: `wangwu`,
      day6: `dingliu`,
      day7: `qianqi`,
      color1: `yellow`,
      color2:`white`
    });

    shTable.tableData.data.push({
      event: `第${i + 1}场 ${events[i]}`,
      day1: `1`,
      day2: `2`,
      day3: `3`,
      day4: `4`,
      day5: `5`,
      day6: `6`,
      day7: `7`,
    });
  }

  xyTable.tableData.config.total = xyTable.tableData.data.length;
  shTable.tableData.config.total = shTable.tableData.data.length;
  setTimeout(() => {
    xyTable.tableData.config.loading = false;
  }, 500);
  setTimeout(() => {
    shTable.tableData.config.loading = false;
  }, 500);
};
const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight)
function getScreenSize() {
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
}

const onCellClick = (info: any) => {
  selectedRow.value = info.row;
  selectedColumn.value = info.column;
  onOpenSubmit("success");
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

<style scoped>
</style>