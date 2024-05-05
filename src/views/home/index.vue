<template>
	<div class="home-container layout-pd">
		<el-row :gutter="15" class="home-card-three mb15" >
			<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" v-if='isCollapse'>
				<div 
					:xs="24"
					:sm="12"
					:md="12"
					:lg="12"
					:xl="12"
				>
					<div class="home-card-change-item " style='margin-top: auto' >
						<el-carousel :interval="5000" arrow="always">
							<el-carousel-item v-for="(src, index) in pics.pictureArray" :key="index">
								<img :src="`${pics.base}${src}`" style="height: 100%;width:100%"/>
							</el-carousel-item>
						</el-carousel>
					</div>
					<div class="home-card-change-item" style='margin-top: 0px;'>
						<div class="home-card-item-title">快捷导航工具</div>
							<div class="home-monitor">
								<div class="flex-warp">
									<div class="flex-warp-item" v-for="(v, k) in state.homeThree" :key="k">
										<div class="flex-warp-item-box" :class="`home-animation${k}`">
											<div class="flex-margin">
												<i :class="v.icon" :style="{ color: v.iconColor }"></i>
												<span class="pl5">{{ v.label }}</span>
												<div class="mt10">{{ v.value }}</div>
											</div>
										</div>
									</div>
								</div>
							</div>
					</div>
				</div>
			</el-col>
			<el-col
				:xs="24"
				:sm="12"
				:md="12"
				:lg="12"
				:xl="12"
			>
			<div class='home-card-item' >
				<ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto" >
					<el-carousel :interval="5000" arrow="always" v-if='!isCollapse'>
							<el-carousel-item v-for="(src, index) in pics.pictureArray" :key="index">
								<img :src="`${pics.base}${src}`" style="height: 100%;width:100%"/>
							</el-carousel-item>
						</el-carousel>
					<li v-for="(item, index) in info.infoArray" :key="index" class="infinite-list-item">
						<div class="left-content">
							<div class="text-line-title">{{ item.title }}</div>
							<div class="text-line-content">{{item.pre_content}}</div>
						</div>
						<div class="right-content">
							<img :src="`${info.base}${item.picture}`" style="height: 60px;width:100px"/>
						</div>
					</li>
				</ul>
			</div>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="home">
import { reactive, onMounted, ref, watch, nextTick, onActivated, markRaw,computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { getInfoList,getPicList } from '/@/api/mainpage/index'
import { ElMessage } from 'element-plus';
// 定义变量内容

const storesTagsViewRoutes = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);

const message = ref(ElMessage);
const screenWidth = ref(window.innerWidth)
const isCollapse = ref(screenWidth.value >= 768)

const info = reactive<any>({
	base:'http://47.93.19.22:8000',
	maxInfos : 0,
	infoArray : [],
	start: 1,
	end:10,
})

const pics = reactive<any>({
	base:'http://47.93.19.22:8000',
	pictureArray:[],
})
const handleResize = () => {
  screenWidth.value = window.innerWidth
}

const state = reactive({
	global: {
		homeChartOne: null,
		homeChartTwo: null,
		homeCharThree: null,
		dispose: [null, '', undefined],
	} as any,
	homeThree: [
		{
			icon: 'iconfont icon-yangan',
			label: '快捷工具1',
			value: '1',
			iconColor: '#F72B3F',
		},
		{
			icon: 'iconfont icon-wendu',
			label: '快捷工具2',
			value: '2',
			iconColor: '#91BFF8',
		},
		{
			icon: 'iconfont icon-shidu',
			label: '快捷工具3',
			value: '3',
			iconColor: '#88D565',
		},
		{
			icon: 'iconfont icon-shidu',
			label: '快捷工具4',
			value: '4',
			iconColor: '#88D565',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '快捷工具5',
			value: '5',
			iconColor: '#FBD4A0',
		},
	],
	myCharts: [] as EmptyArrayType,
	charts: {
		theme: '',
		bgColor: '',
		color: '#303133',
	},
});


// 批量设置 echarts resize
const initEchartsResizeFun = () => {
	nextTick(() => {
		for (let i = 0; i < state.myCharts.length; i++) {
			setTimeout(() => {
				state.myCharts[i].resize();
			}, i * 1000);
		}
	});
};
// 批量设置 echarts resize
const initEchartsResize = () => {
	window.addEventListener('resize', initEchartsResizeFun);
};
// 页面加载时

const getGraph = () => {
	const response = getPicList();
	response.then(response => {
		pics.pictureArray = response.data.pictures;
	}).catch(error => {
		message.value.error('图片加载失败');
	})
}

const getInfo = (start:number,end:number)  => {
	const data = {
		start:start,
		end:end
	}
	const response = getInfoList(data);
  	response.then(response => {
		info.maxInfos = response.data.total;
		info.infoArray = info.infoArray.concat(response.data.list);
		console.log(info.infoArray);
		
	}).catch(error => {
		message.value.error('推送加载失败');
	})
}

const load = () => {
	if (info.infoArray.length >= info.maxInfos) {
		return;
	} else {
		info.start = info.end + 1;
		if (info.start + 9 < info.maxInfos) {
			info.end = info.start + 9;
		} else {
			info.end = info.maxInfos;
		}
		getInfo(info.start,info.end);
	}
}

onMounted(() => {
	initEchartsResize();
	getGraph();
	getInfo(1,10);
});
// 由于页面缓存原因，keep-alive
onActivated(() => {
	initEchartsResizeFun();
	window.addEventListener("resize", handleResize)
});
// 监听 pinia 中的 tagsview 开启全屏变化，重新 resize 图表，防止不出现/大小不变等
watch(
	() => isTagsViewCurrenFull.value,
	() => {
		initEchartsResizeFun();
	}
);
// 监听 pinia 中是否开启深色主题
watch(
	() => themeConfig.value.isIsDark,
	(isIsDark) => {
		nextTick(() => {
			state.charts.theme = isIsDark ? 'dark' : '';
			state.charts.bgColor = isIsDark ? 'transparent' : '';
			state.charts.color = isIsDark ? '#dadada' : '#303133';
		});
	},
	{
		deep: true,
		immediate: true,
	}
);



watch(screenWidth, (newValue, oldValue) => {
  if (newValue < 768) {
    isCollapse.value = false
  } else {
    isCollapse.value = true
  }
  console.log("值发生了变更", newValue, oldValue, isCollapse.value)
})
</script>

<style scoped lang="scss">
$homeNavLengh: 8;

.home-container {
	overflow: hidden;
	.home-card-three {

		.infinite-list {
			overflow-y: hidden;
			@media only screen and (max-width: 768px) {height:650px;};
			@media only screen and (min-width: 768px) {height:600px;};
			width: 100%;
			padding: 0;
			margin: 0;
			list-style: none;
			}
			.infinite-list .infinite-list-item {
				border: 1px solid #ccc;
				display: flex;
				//align-items: center;
				justify-content: center;
				height: 70px;
				
				
				.left-content {
    				flex: 1; /* 左侧内容占据剩余空间 */
				}

				.right-content {
					
					margin-top: 5px;
					margin-right: 10px;
					margin-bottom: 5px;
				}

				.text-line-title {
					margin-top: 5px; 
					margin-left: 5px; 
					font-weight: bold; 
    				font-size: 16px;
				}

				.text-line-content {
					margin-left: 5px;
					@media only screen and (max-width: 768px) {margin-top: 5px;};
					@media only screen and (min-width: 768px) {margin-top: 10px;};
				}
			}
			
		.home-card-item {
			width: 100%;
			height: 650px;
			border-radius: 4px;
			transition: all ease 0.3s;
			padding: 20px;
			overflow: hidden;
			background: var(--el-color-white);
			color: var(--el-text-color-primary);
			border: 1px solid var(--next-border-color-light);
			&:hover {
				box-shadow: 0 2px 12px var(--next-color-dark-hover);
				transition: all ease 0.3s;
			}
			&-icon {
				width: 70px;
				height: 70px;
				border-radius: 100%;
				flex-shrink: 1;
				i {
					color: var(--el-text-color-placeholder);
				}
			}
			&-title {
				font-size: 15px;
				font-weight: bold;
				height: 30px;
			}
			.el-carousel__item h3 {
				color: #475669;
				opacity: 0.75;
				line-height: 300px;
				margin: 0;
				text-align: center;
				}

				.el-carousel__item:nth-child(2n) {
				background-color: #99a9bf;
				}

				.el-carousel__item:nth-child(2n + 1) {
				background-color: #d3dce6;
				}
		}

		.home-card-change-item {
			width: 100%;
			@media only screen and (max-width: 768px) {height:350px;};
			@media only screen and (min-width: 768px) {height:325px;};
			border-radius: 4px;
			transition: all ease 0.3s;
			padding: 20px;
			overflow: hidden;
			background: var(--el-color-white);
			color: var(--el-text-color-primary);
			border: 1px solid var(--next-border-color-light);
			&:hover {
				box-shadow: 0 2px 12px var(--next-color-dark-hover);
				transition: all ease 0.3s;
			}
			&-icon {
				width: 70px;
				height: 70px;
				border-radius: 100%;
				flex-shrink: 1;
				i {
					color: var(--el-text-color-placeholder);
				}
			}
			&-title {
				font-size: 15px;
				font-weight: bold;
				height: 30px;
			}
			.home-monitor {
				height: 100%;
				.flex-warp-item {
					width: 25%;
					height: 111px;
					display: flex;
					.flex-warp-item-box {
						margin: auto;
						text-align: center;
						color: var(--el-text-color-primary);
						display: flex;
						border-radius: 5px;
						background: var(--next-bg-color);
						cursor: pointer;
						transition: all 0.3s ease;
						&:hover {
							background: var(--el-color-primary-light-9);
							transition: all 0.3s ease;
						}
					}
					@for $i from 0 through $homeNavLengh {
						.home-animation#{$i} {
							opacity: 0;
							animation-name: error-num;
							animation-duration: 0.5s;
							animation-fill-mode: forwards;
							animation-delay: calc($i/10) + s;
						}
					}
				}
			}
			
		}
	}
	.home-card-three {
		.home-card-item {
			@media only screen and (max-width: 768px) {
				height:700px;
			}
			@media only screen and (min-width: 768px) {
				height:650px;
			}
			width: 100%;
			overflow: hidden;
			.home-monitor {
				height: 100%;
				.flex-warp-item {
					width: 25%;
					height: 111px;
					display: flex;
					.flex-warp-item-box {
						margin: auto;
						text-align: center;
						color: var(--el-text-color-primary);
						display: flex;
						border-radius: 5px;
						background: var(--next-bg-color);
						cursor: pointer;
						transition: all 0.3s ease;
						&:hover {
							background: var(--el-color-primary-light-9);
							transition: all 0.3s ease;
						}
					}
					@for $i from 0 through $homeNavLengh {
						.home-animation#{$i} {
							opacity: 0;
							animation-name: error-num;
							animation-duration: 0.5s;
							animation-fill-mode: forwards;
							animation-delay: calc($i/10) + s;
						}
					}
				}
			}
		}
	}
}
</style>
