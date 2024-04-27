<template>
  <div class="book-table-container">
    <el-table
        :data="data"
        :border="setBorder"
        v-bind="$attrs"
        row-key="id"
        stripe
        style="width: 100%;"
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
            <span style="display: flex; align-items: center; justify-content: flex-start; height: 100px;">
              {{ scope.row[item.key] }}
            </span>
          </template>
          <template v-else>
<!--            <span :class="{ 'cell-active': isSelected(scope.$index, index) }"-->
<!--                  :style="{ backgroundColor: scope.row[item.key], display: 'inline-block', width: '100%', height: '100px', position: 'relative', textAlign: 'center' }"-->
<!--                  @click="handleCellClick(scope.$index, index, scope.row[item.key] )"-->
<!--            > <i v-if="isSelected(scope.$index, index)" class="check-mark">✓</i> </span>-->
            <span style="display: flex; align-items: center; justify-content: flex-start; height: 100px;":style="{ backgroundColor: scope.row[item.key].color, display: 'inline-block', width: '100%', height: '100px', position: 'relative', textAlign: 'center' }" @click="handleCellClick(scope.$index, index, scope.row[item.key] )">
              {{ scope.row[item.key].text }}
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
import { ElMessage } from 'element-plus';
import printJs from 'print-js';
import table2excel from 'js-table2excel';
import Sortable from 'sortablejs';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
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
// tool 列显示全选改变时
const onCheckAllChange = <T>(val: T) => {
  if (val) props.header.forEach((v) => (v.isCheck = true));
  else props.header.forEach((v) => (v.isCheck = false));
  state.checkListIndeterminate = false;
};
// tool 列显示当前项改变时
const onCheckChange = () => {
  const headers = props.header.filter((v) => v.isCheck).length;
  state.checkListAll = headers === props.header.length;
  state.checkListIndeterminate = headers > 0 && headers < props.header.length;
};

const isSelected= (rowIndex: number, columnIndex: number) => {
  return selectedCell.value && selectedCell.value.row === rowIndex && selectedCell.value.column === columnIndex;
}

const handleCellClick = (row: number, column: number, text: string) => {
    emit('cellClick', {row: row, column: column});
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
const onHandleSizeChange = (val: number) => {
  state.page.pageSize = val;
  emit('pageChange', state.page);
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
  state.page.pageNum = val;
  emit('pageChange', state.page);
};
// 搜索时，分页还原成默认
const pageReset = () => {
  state.page.pageNum = 1;
  state.page.pageSize = 10;
  emit('pageChange', state.page);
};

function getCellColor(type) {
  return type === 0 ? 'white' : 'yellow';
}
// 打印
const onPrintTable = () => {
  // https://printjs.crabbly.com/#documentation
  // 自定义打印
  let tableTh = '';
  let tableTrTd = '';
  let tableTd: any = {};
  // 表头
  props.header.forEach((v) => {
    tableTh += `<th class="table-th">${v.title}</th>`;
  });
  // 表格内容
  props.data.forEach((val, key) => {
    if (!tableTd[key]) tableTd[key] = [];
    props.header.forEach((v) => {
      if (v.type === 'text') {
        tableTd[key].push(`<td class="table-th table-center">${val[v.key]}</td>`);
      } else if (v.type === 'image') {
        tableTd[key].push(`<td class="table-th table-center"><img src="${val[v.key]}" style="width:${v.width}px;height:${v.height}px;"/></td>`);
      }
    });
    tableTrTd += `<tr>${tableTd[key].join('')}</tr>`;
  });
  // 打印
  printJs({
    printable: `<div style=display:flex;flex-direction:column;text-align:center><h3>${props.printName}</h3></div><table border=1 cellspacing=0><tr>${tableTh}${tableTrTd}</table>`,
    type: 'raw-html',
    css: ['//at.alicdn.com/t/c/font_2298093_rnp72ifj3ba.css', '//unpkg.com/element-plus/dist/index.css'],
    style: `@media print{.mb15{margin-bottom:15px;}.el-button--small i.iconfont{font-size: 12px !important;margin-right: 5px;}}; .table-th{word-break: break-all;white-space: pre-wrap;}.table-center{text-align: center;}`,
  });
};
// 导出
const onImportTable = () => {
  if (state.selectlist.length <= 0) return ElMessage.warning('请先选择要导出的数据');
  table2excel(props.header, state.selectlist, `${themeConfig.value.globalTitle} ${new Date().toLocaleString()}`);
};
// 刷新
const onRefreshTable = () => {
  emit('pageChange', state.page);
};
// 设置
const onSetTable = () => {
  nextTick(() => {
    const sortable = Sortable.create(toolSetRef.value, {
      handle: '.handle',
      dataIdAttr: 'data-key',
      animation: 150,
      onEnd: () => {
        const headerList: EmptyObjectType[] = [];
        sortable.toArray().forEach((val: string) => {
          props.header.forEach((v) => {
            if (v.key === val) headerList.push({ ...v });
          });
        });
        emit('sortHeader', headerList);
      },
    });
  });
};

// 暴露变量
defineExpose({
  pageReset,
});
</script>

<style scoped lang="scss">
.book-table-container {
  display: flex;
  flex-direction: column;
  .el-table {
    flex: 1;
    overflow: auto;
    .check-mark {
      font-size: 50px; /* 调整对勾的大小 */
      line-height: 100px;
      user-select: none
    }

    .cell-active {
      position: relative;
      background-color: lightpink !important;
    }

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
