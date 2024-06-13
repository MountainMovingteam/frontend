<template>
  <div class="table-demo-container layout-padding">
    <div class="table-demo-padding layout-padding-view" style='height: 100%;'>
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
      <div v-if="selectedLocation === 'xueyuan' && selectedTime === 0" style='height: 100%;'>
        <Table
            ref="tableRef"
            v-bind="xyTable0.tableData"
            class="booking-table-demo"
            @cellClick="onCellClick"
        />
      </div>
      <div v-else-if="selectedLocation === 'shahe'&& selectedTime=== 0" style='height: 100%;'>
        <Table
            ref="tableRef"
            v-bind="shTable0.tableData"
            class="booking-table-demo"
            @cellClick="onCellClick"
        />
      </div>
      <div v-else-if="selectedLocation === 'xueyuan'&& selectedTime === 1" style='height: 100%;'>
        <Table
            ref="tableRef"
            v-bind="xyTable1.tableData"
            class="booking-table-demo"
            @cellClick="onCellClick"
        />
      </div>
      <div v-else-if="selectedLocation === 'shahe'&& selectedTime === 1" style='height: 100%;'>
        <Table
            ref="tableRef"
            v-bind="shTable1.tableData"
            class="booking-table-demo"
            @cellClick="onCellClick"
        />
      </div>
    </div>
    <!--    预约按钮-->
    <SubmitDialog :week_num="selectedTime"
                  :time_index="(selectedColumn - 1) * 4 + selectedRow + 1 + (selectedLocation=='shahe' ? 28:0)"
                  :campus="selectedLocation"
                  :row="selectedRow"
                  :column="selectedColumn"
                  ref="submitDialogRef"
                  @refresh="getTableData()"/>
  </div>
</template>

<script setup lang="ts">
import {defineAsyncComponent, nextTick, onMounted, reactive, ref} from "vue";
import '/@/types/session.d.ts'
import {getPlaceDetails} from "/@/api/session";
import {ElMessage} from "element-plus";

const selectedTime = ref(0);

const texts = reactive<any>([]);
const selectedLocation = ref('xueyuan');
const submitDialogRef = ref();
const SubmitDialog = defineAsyncComponent(() => import('/@/views/session/dialog.vue'));
const Table = defineAsyncComponent(() => import('/@/components/table/sessionTable.vue'));
const xyTable0 = reactive<any>(<any>{
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
const xyTable1 = reactive<any>(<any>{
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
const shTable0 = reactive<any>(<any>{
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
const shTable1 = reactive<any>(<any>{
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
let state = reactive<any>({
  place_details: [
    {
      week_num: 0,
      time_index: 0,
      capacity: 0,
      enrolled: 0,
      lecturer: [
        "string"
      ],
      type: 0
    }
  ]
});

const events = ['8:00-9:30', '10:00-11:30', '14:00-15:30', '16:00-17:30'];

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
  const response = getPlaceDetails();
  let colors:any = [];
  response.then(response => {
    const data = response.data;
    state.place_details = data.place_details;
    for (let i = 0; i < state.place_details.length; i++) {
      const place_detail = state.place_details[i];
      let lectures=[];
      lectures=state.place_details[i].lecturer;
      const time=place_detail.time_index+place_detail.week_num*56
      texts[time]=''
      for(let j=0;j<lectures.length;j++)
      {
        texts[time]+=lectures[j]+'\n';
      }
      if (place_detail.enrolled > 0) {
        colors[i+1] = "#ffff00";
      } else {
        colors[i+1] = "#ffffff";
      }
    }

      for (let i = 1; i <= 4; i++) {
        xyTable0.tableData.data.push({
          event: `第${i}场 ${events[i - 1]}`,
          day1: {text: texts[i], color: colors[i]}, // 使用颜色名称
          day2: {text: texts[i + 4], color: colors[i + 4]}, // 使用十六进制颜色码
          day3: {text: texts[i + 8], color: colors[i + 8]}, // 使用 RGB 颜色值
          day4: {text: texts[i + 12], color: colors[i + 12]},
          day5: {text: texts[i + 16], color: colors[i + 16]},
          day6: {text: texts[i + 20], color: colors[i + 20]},
          day7: {text: texts[i + 24], color: colors[i + 24]},
        });

        shTable0.tableData.data.push({
          event: `第${i}场 ${events[i - 1]}`,
          day1: {text: texts[i+28], color: colors[i+28]}, // 使用颜色名称
          day2: {text: texts[i + 32], color: colors[i + 32]}, // 使用十六进制颜色码
          day3: {text: texts[i + 36], color: colors[i + 36]}, // 使用 RGB 颜色值
          day4: {text: texts[i + 40], color: colors[i + 40]},
          day5: {text: texts[i + 44], color: colors[i + 44]},
          day6: {text: texts[i + 48], color: colors[i + 48]},
          day7: {text: texts[i + 52], color: colors[i + 52]},
        });

        xyTable1.tableData.data.push({
          event: `第${i}场 ${events[i-1]}`,
          day1: {text: texts[i+56], color: colors[i+56]}, // 使用颜色名称
          day2: {text: texts[i +60], color: colors[i + 60]}, // 使用十六进制颜色码
          day3: {text: texts[i + 64], color: colors[i + 64]}, // 使用 RGB 颜色值
          day4: {text: texts[i + 68], color: colors[i + 68]},
          day5: {text: texts[i + 72], color: colors[i + 72]},
          day6: {text: texts[i + 76], color: colors[i + 76]},
          day7: {text: texts[i + 80], color: colors[i + 80]},
        });

        shTable1.tableData.data.push({
          event: `第${i}场 \n\n ${events[i-1]}`,
          day1: {text: texts[i+84], color: colors[i+84]}, // 使用颜色名称
          day2: {text: texts[i + 88], color: colors[i + 88]}, // 使用十六进制颜色码
          day3: {text: texts[i + 92], color: colors[i + 92]}, // 使用 RGB 颜色值
          day4: {text: texts[i + 96], color: colors[i + 96]},
          day5: {text: texts[i + 100], color: colors[i + 100]},
          day6: {text: texts[i + 104], color: colors[i + 104]},
          day7: {text: texts[i + 108], color: colors[i + 108]},
        });
      }
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
  });

};
const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight)

function getScreenSize() {
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
}

const onCellClick = (info: any) => {
  //console..log('点击的行数据:', info.row);
  //console..log('点击的列数据:', info.column);
  selectedRow.value = info.row;
  selectedColumn.value = info.column;
  nextTick(() => {
    onOpenSubmit("success");
  });
}

function areValuesValid(rowValue: number, columnValue: number) {
  const isRowInRange = rowValue >= 0 && rowValue <= 3;
  const isColumnInRange = columnValue >= 1 && columnValue <= 7;
  return isRowInRange && isColumnInRange;
}


const onOpenSubmit = (type: string) => {
  if (areValuesValid(selectedRow.value, selectedColumn.value)) {
    var init = 0;
    if (selectedLocation.value == 'xueyuan' && selectedTime.value == 0) {
      if (selectedTime.value == 0) {
        init = 0;
      } else {
        init = 56;
      }
    } else {
      if (selectedTime.value == 0) {
        init = 28;
      } else {
        init = 84;
      }
    }    
    submitDialogRef.value.openDialog(type,texts[init+(selectedColumn.value-1) * 4 + selectedRow.value +  1]);
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
  getPlaceDetails();
});
</script>

<style scoped>
</style>