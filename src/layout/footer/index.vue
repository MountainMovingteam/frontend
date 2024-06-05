<template>
	<div class="layout-footer pb15">
		<div class="layout-footer-warp">
			<Horizontal :menuList="state.menuList" />
		</div>
	</div>
</template>

<script setup lang="ts" name="layoutFooter">
// 此处需有内容（注释也得），否则缓存将失败
import { defineAsyncComponent,reactive,onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useRoutesList } from '/@/stores/routesList';
import { useThemeConfig } from '/@/stores/themeConfig';
import mittBus from '/@/utils/mitt';
const stores = useRoutesList();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { routesList } = storeToRefs(stores);
const state = reactive({
	menuList: [] as RouteItems,
});

const Horizontal = defineAsyncComponent(() => import('/@/layout/footer/bottomMenu.vue'));

const setFilterRoutes = () => {
	state.menuList = filterRoutesFun(routesList.value);
};

const filterRoutesFun = <T extends RouteItem>(arr: T[]): T[] => {
	return arr
		.filter((item: T) => !item.meta?.isHide)
		.map((item: T) => {
			item = Object.assign({}, item);
			if (item.children) item.children = filterRoutesFun(item.children);
			return item;
		});
};

onMounted(() => {
	setFilterRoutes();
	mittBus.on('getBreadcrumbIndexSetFilterRoutes', () => {
		setFilterRoutes();
	});
});
</script>

<style scoped lang="scss">
.layout-footer {
	width: 100%;
	display: flex;
	&-warp {
		margin: auto;
		color: var(--el-text-color-secondary);
		text-align: center;
		animation: error-num 0.3s ease;
	}
}
</style>
