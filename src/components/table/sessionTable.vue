<template>
  <div class="session-table-container">
    <el-table
        :data="data"
        :border="setBorder"
        :cell-style="getCell"
        v-bind="$attrs"
        row-key="id"
        stripe
        v-loading="config.loading"
        @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" :reserve-selection="true" width="30" v-if="config.isSelection" />
<!--      <el-table-column type="index" label="序号" width="60" v-if="config.isSerialNo" />-->
      <el-table-column
          v-for="(item, index) in setHeader"
          :key="index"
          show-overflow-tooltip
          :prop="item.key"
          :width="item.colWidth"
          :label="item.title"
          
      >
        <template v-slot="scope">
          <template v-if="item.key === 'event'">
            <span  style="display: flex; align-items: center; justify-content: flex-start; height: 100%;">
              {{ scope.row[item.key] }}
            </span>
          </template>
          <template v-else>
            <span style="display: flex; align-items: center; justify-content: flex-start; height: 100px;white-space: pre-wrap;" @click="handleCellClick(scope.$index, index, scope.row[item.key] )">
              {{ getFirstTwoLines(scope.row[item.key].text) }}
              </span>
          </template>
<!--          格内功能-->
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" v-if="config.isOperate">
        <template v-slot="scope">
          <el-popconfirm title="确定删除吗？" @confirm="onDelRow(scope.row)">
            <template #reference>
              <el-button text type="primary">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts" name="netxTable">
import { reactive, computed, nextTick, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
//import { toRaw } from '@vue/reactivity';
import '/@/theme/tableTool.scss';

const selectedCell = ref<any>(null);

// 定义父组件传过来的值
const props = defineProps({
  // 列表内容
  data: {
    type: Array<EmptyObjectType>,
    default: () => [],
  },
  // 表头内容
  header: {
    type: Array<EmptyObjectType>,
    default: () => [],
  },
  // 配置项
  config: {
    type: Object,
    default: () => {},
  },
  // 打印标题
  printName: {
    type: String,
    default: () => '',
  },
});

// 定义子组件向父组件传值/事件
const emit = defineEmits(['delRow', 'pageChange', 'sortHeader', 'cellClick']);

// 定义变量内容
const toolSetRef = ref();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const state = reactive({
  page: {
    pageNum: 1,
    pageSize: 10,
  },
  selectlist: [] as EmptyObjectType[],
  checkListAll: true,
  checkListIndeterminate: false,
});

// 设置边框显示/隐藏
const setBorder = computed(() => {
  return props.config.isBorder ? true : false;
});
// 获取父组件 配置项（必传）
const getConfig = computed(() => {
  return props.config;
});
// 设置 tool header 数据
const setHeader = computed(() => {
  return props.header.filter((v) => v.isCheck);
});

const handleCellClick = (row: number, column: number, text: string) => {
    emit('cellClick', {row: row, column: column});
    ////console..log(row);
    ////console..log(column);
}
// 表格多选改变时，用于导出
const onSelectionChange = (val: EmptyObjectType[]) => {
  state.selectlist = val;
};
// 删除当前项
const onDelRow = (row: EmptyObjectType) => {
  emit('delRow', row);
};
// 分页改变


// 搜索时，分页还原成默认
const pageReset = () => {
  state.page.pageNum = 1;
  state.page.pageSize = 10;
  emit('pageChange', state.page);
};


const getCell = (row:any , column:any) => {
  var list = JSON.parse(JSON.stringify(props.data));
  var obj = list[row.rowIndex][`day${row.columnIndex}`];
  if (obj) {
    if (obj.color != '#ffffff')
    return {'background-color': obj.color,}
  }
}

const getFirstTwoLines = (text:any) => {
  if (!text) {
    return '暂无讲解员';
  }
  const lines = text.split('\n');
  return lines.slice(0, 2).join('\n');
}

// 暴露变量
defineExpose({
  pageReset,
});
</script>

<style scoped lang="scss">
.session-table-container {
  display: flex;
  flex-direction: column;
  height: 83%;
  .el-table {
    flex: 1;
    overflow-y: auto;
    .cell-active::after {
      content: ''; /* 对勾符号 */
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
   
  }
  .table-footer {
    display: flex;
    .table-footer-tool {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      i {
        margin-right: 10px;
        cursor: pointer;
        color: var(--el-text-color-regular);
        &:last-of-type {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
