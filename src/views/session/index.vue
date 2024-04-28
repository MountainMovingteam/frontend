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
          沙河校区
        </el-button>
        <!--        沙河校区按钮-->
      </div>
      <!--      选择校区-->
      <div class="system-menu-search mb15">
        <el-button size="large" :type="selectedTime === 0 ? 'primary' : 'info'" class="ml10"
                   @click="selectTime(0)">
          <el-icon>
            <ele-Monitor/>
          </el-icon>
          本周
        </el-button>
        <!--        本周按钮-->
        <el-button size="large" :type="selectedTime === 1 ? 'primary' : 'info'" class="ml10"
                   @click="selectTime(1)">
          <el-icon>
            <ele-Promotion/>
          </el-icon>
          下周
        </el-button>
        <!--        下周按钮-->
      </div>
      <!--      选择时间-->
      <div v-if="selectedLocation === 'xueyuan' && selectedTime === 0">
        <Table
            ref="tableRef"
            v-bind="xyTable0.tableData"
            class="booking-table-demo"
            @cellClick = "onCellClick"
        />
      </div>
      <div v-else-if="selectedLocation === 'shahe'&& selectedTime=== 0">
        <Table
            ref="tableRef"
            v-bind="shTable0.tableData"
            class="booking-table-demo"
            @cellClick = "onCellClick"
        />
      </div>
      <div v-else-if="selectedLocation === 'xueyuan'&& selectedTime === 1">
        <Table
            ref="tableRef"
            v-bind="xyTable1.tableData"
            class="booking-table-demo"
            @cellClick = "onCellClick"
        />
      </div>
      <div v-else-if="selectedLocation === 'shahe'&& selectedTime === 1">
        <Table
            ref="tableRef"
            v-bind="shTable1.tableData"
            class="booking-table-demo"
            @cellClick = "onCellClick"
        />
      </div>
    </div>
    <!--    预约按钮-->
    <SubmitDialog :time="selectTime" :campus="selectedLocation" :row="selectedRow" :column="selectedColumn"
                  ref="submitDialogRef"
                  @refresh="getTableData()"/>
  </div>
</template>

<script setup lang="ts">
import {defineAsyncComponent, onMounted, reactive, ref} from "vue";
import '/@/types/session.d.ts'
import {ElMessage} from "element-plus";

const selectedTime = ref(0);

const selectedLocation = ref('xueyuan');
const submitDialogRef = ref();
const SubmitDialog = defineAsyncComponent(() => import('/@/views/session/dialog.vue'));
const Table = defineAsyncComponent(() => import('/@/components/table/sessionTable.vue'));
const xyTable0 = reactive<TableState>(<TableState>{
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
const xyTable1 = reactive<TableState>(<TableState>{
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
const shTable0 = reactive<TableState>(<TableState>{
  tableData: {
    // 列表数据（必传）
    data: [],
    // 表头内容（必传，注意格式）
    header: [
      {key: 'event', colWidth: '150px', title: '场次', type: 'text', isCheck: true},
      {
        key: 'day1',
        colWidth: window.innerWidth <= 768 ? '100px' : '180px',
        color: 'white',
        title: '周一',
        type: 'text',
        isCheck: true
      },
      {
        key: 'day2',
        colWidth: window.innerWidth <= 768 ? '100px' : '180px',
        color: 'white',
        title: '周二',
        type: 'text',
        isCheck: true
      },
      {
        key: 'day3',
        colWidth: window.innerWidth <= 768 ? '100px' : '180px',
        color: 'white',
        title: '周三',
        type: 'text',
        isCheck: true
      },
      {
        key: 'day4',
        colWidth: window.innerWidth <= 768 ? '100px' : '180px',
        color: 'white',
        title: '周四',
        type: 'text',
        isCheck: true
      },
      {
        key: 'day5',
        colWidth: window.innerWidth <= 768 ? '100px' : '180px',
        color: 'white',
        title: '周五',
        type: 'text',
        isCheck: true
      },
      {
        key: 'day6',
        colWidth: window.innerWidth <= 768 ? '100px' : '180px',
        color: 'white',
        title: '周六',
        type: 'text',
        isCheck: true
      },
      {
        key: 'day7',
        colWidth: window.innerWidth <= 768 ? '100px' : '180px',
        color: 'white',
        title: '周日',
        type: 'text',
        isCheck: true
      },
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
const shTable1 = reactive<TableState>(<TableState>{
  tableData: {
    // 列表数据（必传）
    data: [],
    // 表头内容（必传，注意格式）
    header: [
      {key: 'event', colWidth: '150px', title: '场次', type: 'text', isCheck: true},
      {
        key: 'day1',
        colWidth: window.innerWidth <= 768 ? '100px' : '180px',
        color: 'white',
        title: '周一',
        type: 'text',
        isCheck: true
      },
      {
        key: 'day2',
        colWidth: window.innerWidth <= 768 ? '100px' : '180px',
        color: 'white',
        title: '周二',
        type: 'text',
        isCheck: true
      },
      {
        key: 'day3',
        colWidth: window.innerWidth <= 768 ? '100px' : '180px',
        color: 'white',
        title: '周三',
        type: 'text',
        isCheck: true
      },
      {
        key: 'day4',
        colWidth: window.innerWidth <= 768 ? '100px' : '180px',
        color: 'white',
        title: '周四',
        type: 'text',
        isCheck: true
      },
      {
        key: 'day5',
        colWidth: window.innerWidth <= 768 ? '100px' : '180px',
        color: 'white',
        title: '周五',
        type: 'text',
        isCheck: true
      },
      {
        key: 'day6',
        colWidth: window.innerWidth <= 768 ? '100px' : '180px',
        color: 'white',
        title: '周六',
        type: 'text',
        isCheck: true
      },
      {
        key: 'day7',
        colWidth: window.innerWidth <= 768 ? '100px' : '180px',
        color: 'white',
        title: '周日',
        type: 'text',
        isCheck: true
      },
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
const data = {
  "week_num": 0,
  "place_details": [
    {
      "time_index": 0,
      "capacity": 0,
      "enrolled": 0,
      "lecturer": "讲师A",
      "type": 0
    },
    // ... 其他数据项
  ]
};

function selectLocation(location: string) {
  selectedLocation.value = location;
}

function selectTime(time: number) {
  selectedTime.value = time;
}

const getTableData = () => {
  xyTable0.tableData.config.loading = true;
  shTable0.tableData.config.loading = true;
  xyTable1.tableData.config.loading = true;
  shTable1.tableData.config.loading = true;
  for (let i = 0; i < 4; i++) {
    xyTable0.tableData.data.push({
      event: `第${i + 1}场 ${events[i]}`,
      day1: {text:"wangda",color:"#ffffff"}, // 使用颜色名称
      day2: {text:"qianer",color:"#ffff00"}, // 使用十六进制颜色码
      day3: {text:"zhangsan",color:"#ffffff"}, // 使用 RGB 颜色值
      day4: {text:"lisi",color:"#ffff00"},
      day5: {text:"wangwu",color:"#ffffff"},
      day6: {text:"dingliu",color:"#ffffff"},
      day7: {text:"heqi",color:"#ffff00"},
    });

    shTable0.tableData.data.push({
      event: `第${i + 1}场 ${events[i]}`,
      day1: "#f54545", // 使用颜色名称
      day2: "#99FF99", // 使用十六进制颜色码
      day3: "#99FF99", // 使用 RGB 颜色值
      day4: "#90EE90",
      day5: "#90EE90",
      day6: "#90EE90",
      day7: "#90EE90",
    });

    xyTable1.tableData.data.push({
      event: `第${i + 1}场 ${events[i]}`,
      day1: "#f54545", // 使用颜色名称
      day2: "#f54545", // 使用十六进制颜色码
      day3: "#f54545", // 使用 RGB 颜色值
      day4: "#99FF99",
      day5: "#f54545",
      day6: "#f54545",
      day7: "#99FF99",
    });

    shTable1.tableData.data.push({
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

  //修改后data有了更多元素
  // for (let i = 0; i < 4; i++) {
  //   const xycellTime0: CellDataType = ({
  //     text: `第${i + 1}场 ${events[i]}`,
  //     color: 'white'
  //   })
  //   xyTable0.tableData.data.push(xycellTime0);
  //   const xycellData0: CellDataType[] = Array.from({length: 7}, (_, index) => ({
  //     text: `1`, // 根据日期生成不同的文本
  //     color: index % 2 === 0 ? 'yellow' : 'white' // 根据某种逻辑设置颜色，这里简单地交替颜色
  //   }));
  //   for (i = 0; i < 7; i++) {
  //     xyTable0.tableData.data.push(xycellData0[i]);
  //   }
  //
  //   const xycellTime1: CellDataType = ({
  //     text: `第${i + 1}场 ${events[i]}`,
  //     color: 'white'
  //   })
  //   xyTable1.tableData.data.push(xycellTime1);
  //   const xycellData1: CellDataType[] = Array.from({length: 7}, (_, index) => ({
  //     text: `1`, // 根据日期生成不同的文本
  //     color: index % 2 === 0 ? 'yellow' : 'white' // 根据某种逻辑设置颜色，这里简单地交替颜色
  //   }));
  //   for (i = 0; i < 7; i++) {
  //     xyTable1.tableData.data.push(xycellData1[i]);
  //   }
  //
  //   const shcellTime0: CellDataType = ({
  //     text: `第${i + 1}场 ${events[i]}`,
  //     color: 'white'
  //   })
  //   shTable0.tableData.data.push(shcellTime0);
  //   const shcellData0: CellDataType[] = Array.from({length: 7}, (_, index) => ({
  //     text: `第${i + 1}场 ${events[i]}`, // 根据日期生成不同的文本
  //     color: index % 2 === 0 ? 'yellow' : 'white' // 根据某种逻辑设置颜色，这里简单地交替颜色
  //   }));
  //   for (i = 0; i < 7; i++) {
  //     shTable0.tableData.data.push(shcellData0[i]);
  //   }
  //
  //   const shcellTime1: CellDataType = ({
  //     text: `第${i + 1}场 ${events[i]}`,
  //     color: 'white'
  //   })
  //   shTable1.tableData.data.push(shcellTime1);
  //   const shcellData1: CellDataType[] = Array.from({length: 7}, (_, index) => ({
  //     text: `第${i + 1}场 ${events[i]}`, // 根据日期生成不同的文本
  //     color: index % 2 === 0 ? 'yellow' : 'white' // 根据某种逻辑设置颜色，这里简单地交替颜色
  //   }));
  //   for (i = 0; i < 7; i++) {
  //     shTable1.tableData.data.push(shcellData1[i]);
  //   }
  // }


  xyTable0.tableData.config.total = xyTable0.tableData.data.length;
  shTable0.tableData.config.total = shTable0.tableData.data.length;
  xyTable1.tableData.config.total = xyTable1.tableData.data.length;
  shTable1.tableData.config.total = shTable1.tableData.data.length;
  setTimeout(() => {
    xyTable0.tableData.config.loading = false;
  }, 500);
  setTimeout(() => {
    shTable0.tableData.config.loading = false;
  }, 500);
  setTimeout(() => {
    xyTable1.tableData.config.loading = false;
  }, 500);
  setTimeout(() => {
    shTable1.tableData.config.loading = false;
  }, 500);
};
const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight)

function getScreenSize() {
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
}

const onCellClick = (info: any) => {
  console.log('点击的行数据:', info.row);
  console.log('点击的列数据:', info.column);
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