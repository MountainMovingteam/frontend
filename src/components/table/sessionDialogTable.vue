<template>
	<div class="table-container">
		<el-table
			:data="data"
			:border="setBorder"
			v-bind="$attrs"
			row-key="id"
			stripe
			style="width: 100%"
			v-loading="config.loading"
			@selection-change="onSelectionChange"
		>
			<el-table-column type="selection" :reserve-selection="true" width="30" v-if="config.isSelection" />
			<el-table-column type="index" label="序号" width='' v-if="config.isSerialNo" />
			<el-table-column
				v-for="(item, index) in setHeader"
				:key="index"
				show-overflow-tooltip
				:prop="item.key"
				:width="item.colWidth"
				:label="item.title"
			>
				<template v-slot="scope">
					<template v-if="item.type === 'text'">
						{{ scope.row[item.key] }}
					</template>
					<template v-else-if="item.type === 'label'">
						<el-tag type="warning">{{ scope.row[item.key] }}</el-tag>
					</template>
                    <template v-else>
						<el-button size='small' :type=item.btType @click="rejectRow(scope.row)">{{ scope.row[item.key] }}</el-button>
					</template>
				</template>
			</el-table-column>
		</el-table>
	</div>
	<ChoiceDialog 
                  ref="choiceDialogRef"
                  @confirmReject="onConfirmReject"/>
</template>

<script setup lang="ts" name="netxTable">
import {defineAsyncComponent, reactive, computed, nextTick, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import '/@/theme/tableTool.scss';
const ChoiceDialog = defineAsyncComponent(() => import('/@/views/session/choiceDialog.vue'));
const choiceDialogRef = ref();
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
});

// 定义子组件向父组件传值/事件
const emit = defineEmits(['delRow', 'pageChange', 'sortHeader','rejectRow']);

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
// 表格多选改变时，用于导出
const onSelectionChange = (val: EmptyObjectType[]) => {
	state.selectlist = val;
};
// 删除当前项


const temp = ref({});

const rejectRow = (row: EmptyObjectType) => {
	choiceDialogRef.value.openDialog();
	temp.value = row;
};

const dealChoice = () => {
	choiceDialogRef.value.handleClose();
}

const onConfirmReject = (reason:any) => {
	emit('rejectRow', temp.value,reason);
}
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

// 暴露变量
defineExpose({
	pageReset,
	dealChoice,
});
</script>

<style scoped lang="scss">
.table-container {
	display: flex;
	flex-direction: column;
	.el-table {
		flex: 1;
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
