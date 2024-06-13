<template>
	<div class="layout-navbars-breadcrumb-user pr15" :style="{ flex: layoutUserFlexNum }">
		<div class="layout-navbars-breadcrumb-user-icon" @click="onSearchClick">
			<el-icon :title="$t('message.user.title2')">
				<ele-Search />
			</el-icon>
		</div>
		<!--<div class="layout-navbars-breadcrumb-user-icon" @click="onLayoutSetingClick">
			<i class="icon-skin iconfont" :title="$t('message.user.title3')"></i>
		</div>-->
		<div class="layout-navbars-breadcrumb-user-icon" ref="userNewsBadgeRef" v-click-outside="onUserNewsClick" v-if='showNotice'>
			<el-badge :is-dot="userInfos.notRead">
				<el-icon :title="$t('message.user.title4')">
					<ele-Bell />
				</el-icon>
			</el-badge>
		</div>
		<el-popover
			ref="userNewsRef"
			:virtual-ref="userNewsBadgeRef"
			placement="bottom"
			trigger="click"
			transition="el-zoom-in-top"
			virtual-triggering
			:width="300"
			:persistent="false"
			v-if='showNotice'
		>
			<UserNews />
		</el-popover>
		<div class="layout-navbars-breadcrumb-user-icon mr10" @click="onScreenfullClick">
			<i
				class="iconfont"
				:title="state.isScreenfull ? $t('message.user.title6') : $t('message.user.title5')"
				:class="!state.isScreenfull ? 'icon-fullscreen' : 'icon-tuichuquanping'"
			></i>
		</div>
		<el-dropdown :show-timeout="70" :hide-timeout="50" @command="onHandleCommandClick">
			<span class="layout-navbars-breadcrumb-user-link">
				<img :src="userInfos.photo" class="layout-navbars-breadcrumb-user-link-photo mr5" />
				{{ userInfos.userName === '' ? 'user' : userInfos.userName }}
				<el-icon class="el-icon--right">
					<ele-ArrowDown />
				</el-icon>
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="/home">{{ $t('message.user.dropdown1') }}</el-dropdown-item>
					<router-link :to="item.path" v-slot="{ href }" v-for="(item, index) in menuLists" :key="index" style="text-decoration: none;" v-if='isPhone'>
						<el-dropdown-item :command="href" :class="{ active: item.path === state.defaultActive }" style="text-decoration: none;">
							{{ $t(item.meta.title) }}
						</el-dropdown-item>
					</router-link>
					<el-dropdown-item command="/personal">{{ $t('message.user.dropdown2') }}</el-dropdown-item>
					<el-dropdown-item divided command="logOut">{{ $t('message.user.dropdown5') }}</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
		<Search ref="searchRef" />
	</div>
</template>

<script setup lang="ts" name="layoutBreadcrumbUser">
import { defineAsyncComponent, ref, unref, computed, reactive, onMounted,onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage, ClickOutside as vClickOutside } from 'element-plus';
import screenfull from 'screenfull';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '/@/stores/userInfo';
import { useThemeConfig } from '/@/stores/themeConfig';
import mittBus from '/@/utils/mitt';
import { Session, Local } from '/@/utils/storage';

import { useRoutesList } from '/@/stores/routesList';
import { useRoute, onBeforeRouteUpdate, RouteRecordRaw } from 'vue-router';

import { reqNotice } from '/@/api/notification/index';

// 引入组件
const UserNews = defineAsyncComponent(() => import('/@/layout/navBars/topBar/userNews.vue'));
const Search = defineAsyncComponent(() => import('/@/layout/navBars/topBar/search.vue'));

// 定义变量内容
const userNewsRef = ref();
const userNewsBadgeRef = ref();
const { locale, t } = useI18n();
const router = useRouter();
const stores = useUserInfo();
const storesThemeConfig = useThemeConfig();
const { userInfos } = storeToRefs(stores);
const { themeConfig } = storeToRefs(storesThemeConfig);
const searchRef = ref();
const isPhone = ref(false);
const state = reactive({
	isScreenfull: false,
	disabledI18n: 'zh-cn',
	disabledSize: 'large',
	menuList: [] as RouteItems,
	defaultActive: '' as string | undefined,
});
const storesRouter = useRoutesList();
const { routesList } = storeToRefs(storesRouter);
const showNotice = ref<boolean>(true);
// 设置分割样式
const layoutUserFlexNum = computed(() => {
	let num: string | number = '';
	const { layout, isClassicSplitMenu } = themeConfig.value;
	const layoutArr: string[] = ['defaults', 'columns'];
	if (layoutArr.includes(layout) || (layout === 'classic' && !isClassicSplitMenu)) num = '1';
	else num = '';
	return num;
});
// 全屏点击时
const onScreenfullClick = () => {
	if (!screenfull.isEnabled) {
		ElMessage.warning('暂不不支持全屏');
		return false;
	}
	screenfull.toggle();
	screenfull.on('change', () => {
		if (screenfull.isFullscreen) state.isScreenfull = true;
		else state.isScreenfull = false;
	});
};
// 消息通知点击时
const onUserNewsClick = () => {
	unref(userNewsRef).popperRef?.delayHide?.();
};
// 布局配置 icon 点击时
const onLayoutSetingClick = () => {
	//mittBus.emit('openSetingsDrawer');
	Local.clear()
	window.location.reload();
	// @ts-ignore
	Local.set('version', __NEXT_VERSION__);
};
// 下拉菜单点击时
const onHandleCommandClick = (path: string) => {
	if (path === 'logOut') {
		ElMessageBox({
			closeOnClickModal: false,
			closeOnPressEscape: false,
			title: t('message.user.logOutTitle'),
			message: t('message.user.logOutMessage'),
			showCancelButton: true,
			confirmButtonText: t('message.user.logOutConfirm'),
			cancelButtonText: t('message.user.logOutCancel'),
			buttonSize: 'default',
			beforeClose: (action, instance, done) => {
				if (action === 'confirm') {
					instance.confirmButtonLoading = true;
					instance.confirmButtonText = t('message.user.logOutExit');
					setTimeout(() => {
						done();
						setTimeout(() => {
							instance.confirmButtonLoading = false;
						}, 300);
					}, 700);
				} else {
					done();
				}
			},
		})
			.then(async () => {
				// 清除缓存/token等
				Session.clear();
				// 使用 reload 时，不需要调用 resetRoute() 重置路由
				window.location.reload();
			})
			.catch(() => {});
	} else if (path === 'wareHouse') {
		window.open('https://gitee.com/lyt-top/vue-next-admin');
	} else {
		router.push(path);
	}
};
// 菜单搜索点击
const onSearchClick = () => {
	searchRef.value.openSearch();
	Local.remove('userInfo')
	userInfos.value.notRead = false;
	Local.set('userInfo', userInfos.value)
	Session.remove('userInfo')
	Session.set('userInfo', userInfos.value)
};
// 初始化组件大小/i18n
const initI18nOrSize = (value: string, attr: string) => {
	(<any>state)[attr] = Local.get('themeConfig')[value];
};
// 页面加载时

onMounted(async () => {
	setFilterRoutes();
	if (Local.get('themeConfig')) {
		initI18nOrSize('globalComponentSize', 'disabledSize');
		initI18nOrSize('globalI18n', 'disabledI18n');
	}
	if (Local.get('role') == 1) {
		showNotice.value = false;
	}
	try {
		const result = await reqNotice();
		var mark = 0;
		for (let i = 0; i < result.data.notice_list.length; i++) {
			const item = result.data.notice_list[i];
			if (!item.status) {
				Local.remove('userInfo');
				userInfos.value.notRead = true;
				Local.set('userInfo', userInfos.value);
				Session.remove('userInfo');
				Session.set('userInfo', userInfos.value);
				mark = 1;
				break; // 跳出整个循环
			}
		}
		if (mark == 0) {
			Local.remove('userInfo')
			userInfos.value.notRead = false;
			Local.set('userInfo', userInfos.value)
			Session.remove('userInfo')
			Session.set('userInfo', userInfos.value)
		}
	} catch (error) {
		////console..log('debug:信息加载问题');
	}

	isPhone.value = window.innerWidth <= 767;
});

window.addEventListener('resize', () => {
    isPhone.value = window.innerWidth <= 767;
});
//过滤

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

const route = useRoute();

// 获取父级菜单数据
const menuLists = computed(() => {
	////console..log( <RouteItems>state.menuList.filter((item:any) => !item.meta.isBottom));
	return <RouteItems>state.menuList.filter((item:any) => !item.meta.isBottom)
});
// 路由过滤递归函数
const filterRoutesFun2 = <T extends RouteItem>(arr: T[]): T[] => {
	return arr
		.filter((item: T) => !item.meta?.isHide)
		.map((item: T) => {
			item = Object.assign({}, item);
			if (item.children) item.children = filterRoutesFun2(item.children);
			return item;
		});
};
// 传送当前子级数据到菜单中
const setSendClassicChildren = (path: string) => {
	const currentPathSplit = path.split('/');
	let currentData: MittMenu = { children: [] };
	filterRoutesFun2(routesList.value).map((v, k) => {
		if (v.path === `/${currentPathSplit[1]}`) {
			v['k'] = k;
			currentData['item'] = { ...v };
			currentData['children'] = [{ ...v }];
			if (v.children) currentData['children'] = v.children;
		}
	});
	return currentData;
};
// 设置页面当前路由高亮
const setCurrentRouterHighlight = (currentRoute: RouteToFrom) => {
	const { path, meta } = currentRoute;
	if (themeConfig.value.layout === 'classic') {
		state.defaultActive = `/${path?.split('/')[1]}`;
	} else {
		const pathSplit = meta?.isDynamic ? meta.isDynamicPath!.split('/') : path!.split('/');
		if (pathSplit.length >= 4 && meta?.isHide) state.defaultActive = pathSplit.splice(0, 3).join('/');
		else state.defaultActive = path;
	}
};
// 页面加载前
onBeforeMount(() => {
	setCurrentRouterHighlight(route);
});
// 路由更新时
onBeforeRouteUpdate((to) => {
	// 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
	setCurrentRouterHighlight(to);
	// 修复经典布局开启切割菜单时，点击tagsView后左侧导航菜单数据不变的问题
	let { layout, isClassicSplitMenu } = themeConfig.value;
	if (layout === 'classic' && isClassicSplitMenu) {
		mittBus.emit('setSendClassicChildren', setSendClassicChildren(to.path));
	}
});
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	&-link {
		height: 100%;
		display: flex;
		align-items: center;
		white-space: nowrap;
		&-photo {
			width: 25px;
			height: 25px;
			border-radius: 100%;
		}
	}
	&-icon {
		padding: 0 10px;
		cursor: pointer;
		color: var(--next-bg-topBarColor);
		height: 50px;
		line-height: 50px;
		display: flex;
		align-items: center;
		&:hover {
			background: var(--next-color-user-hover);
			i {
				display: inline-block;
				animation: logoAnimation 0.3s ease-in-out;
			}
		}
	}
	:deep(.el-dropdown) {
		color: var(--next-bg-topBarColor);
	}
	:deep(.el-badge) {
		height: 40px;
		line-height: 40px;
		display: flex;
		align-items: center;
	}
	:deep(.el-badge__content.is-fixed) {
		top: 12px;
	}
}
</style>
