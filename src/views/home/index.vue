<template>
	<div class="home-container layout-pd">
		<el-row :gutter="15" class="home-card-three mb15" >
			<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" v-if='isCollapse' style='height: 100%;'>
				<div 
					:xs="24"
					:sm="12"
					:md="12"
					:lg="12"
					:xl="12"
					style='height: 100%;'
				>
					<div class="home-card-change-item "  >
						<el-carousel :interval="5000" arrow="always" indicator-position="outside" >
							<el-carousel-item v-for="(src, index) in pics.pictureArray" :key="index">
								<img :src="`${pics.base}${src}`" style="height: 100%;width:100%;"/>
							</el-carousel-item>
						</el-carousel>
					</div>
					<div class="home-card-change-item" style='margin-top: 0px;'>
						<div style="height:95%;margin-top: auto;margin-bottom: auto;" ref="homeLineRef"></div>
					</div>
				</div>
			</el-col>
			<el-col
				:xs="24"
				:sm="12"
				:md="12"
				:lg="12"
				:xl="12"
				style='height:100%'
			>
			<div class='home-card-item' ref='right'>
				<ul v-infinite-scroll="load"  class="infinite-list" style="overflow: auto;" >
					<el-carousel :interval="5000" arrow="always" v-if='!isCollapse'>
							<el-carousel-item v-for="(src, index) in pics.pictureArray" :key="index">
								<img :src="`${pics.base}${src}`" style="height: 100%;width:100%"/>
							</el-carousel-item>
					</el-carousel>
					<li v-for="(item, index) in info.infoArray" :key="index" class="infinite-list-item" @click="openUrl(item.address)">
						<div class="left-content">
							<div class="text-line-title">{{ item.title }}</div>
							<div class="text-line-content">{{item.pre_content}}</div>
						</div>
						<div class="right-content">
							<img :src="`${info.base}${item.picture}`" style="height: 100%;width:100px;"/>
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
import * as echarts from 'echarts';
// 定义变量内容
import router from '/@/router';
const storesTagsViewRoutes = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);
const message = ref(ElMessage);
const screenWidth = ref(window.innerWidth)
const isCollapse = ref(screenWidth.value >= 768)
const homeLineRef = ref();
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
		getInfo(1,5);
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

const openUrl = (address:string) => {
        window.open(address);
    }

onMounted(async () => {
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
			setTimeout(() => {
				initLineChart();
			}, 500);
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

const initLineChart = () => {
	if (!state.global.dispose.some((b: any) => b === state.global.homeChartOne)) state.global.homeChartOne.dispose();
	state.global.homeChartOne = markRaw(echarts.init(homeLineRef.value, state.charts.theme));
	const option = {
		backgroundColor: state.charts.bgColor,
		title: {
			text: '参观人数',
			x: 'left',
			textStyle: { fontSize: '15', color: state.charts.color },
		},
		grid: { top: 70, right: 20, bottom: 30, left: 30 },
		tooltip: { trigger: 'axis' },
		legend: { data: ['人数', '最新成交价'], right: 0 },
		xAxis: {
			data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
		},
		yAxis: [
			{
				type: 'value',
				name: '人数',
				splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
			},
		],
		series: [
			{
				name: '人数',
				type: 'line',
				symbolSize: 6,
				symbol: 'circle',
				smooth: true,
				data: [0, 41.1, 30.4, 65.1, 53.3, 53.3, 53.3, 41.1, 30.4, 65.1, 53.3, 10],
				lineStyle: { color: '#fe9a8b' },
				itemStyle: { color: '#fe9a8b', borderColor: '#fe9a8b' },
				areaStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: '#fe9a8bb3' },
						{ offset: 1, color: '#fe9a8b03' },
					]),
				},
			},
			/*{
				name: '最新成交价',
				type: 'line',
				symbolSize: 6,
				symbol: 'circle',
				smooth: true,
				data: [0, 24.1, 7.2, 15.5, 42.4, 42.4, 42.4, 24.1, 7.2, 15.5, 42.4, 0],
				lineStyle: { color: '#9E87FF' },
				itemStyle: { color: '#9E87FF', borderColor: '#9E87FF' },
				areaStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: '#9E87FFb3' },
						{ offset: 1, color: '#9E87FF03' },
					]),
				},
				emphasis: {
					itemStyle: {
						color: {
							type: 'radial',
							x: 0.5,
							y: 0.5,
							r: 0.5,
							colorStops: [
								{ offset: 0, color: '#9E87FF' },
								{ offset: 0.4, color: '#9E87FF' },
								{ offset: 0.5, color: '#fff' },
								{ offset: 0.7, color: '#fff' },
								{ offset: 0.8, color: '#fff' },
								{ offset: 1, color: '#fff' },
							],
						},
						borderColor: '#9E87FF',
						borderWidth: 2,
					},
				},
			},*/
		],
	};
	state.global.homeChartOne.setOption(option);
	state.myCharts.push(state.global.homeChartOne);
};
</script>

<style scoped lang="scss">
$homeNavLengh: 8;

.home-container {
	height: 100%;
	.home-card-three {
		height: 100%;
		overflow: hidden;
		max-height: calc(85vh);
		.infinite-list {
			overflow-y: hidden;
			/*@media only screen and (max-width: 768px) {height:650px;};
			@media only screen and (min-width: 768px) {height:600px;};*/
			height: 100%;
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
				height: 15%;
				
				
				.left-content {
    				flex: 1; /* 左侧内容占据剩余空间 */
				}

				.right-content {
					margin-top: auto;
					margin-right: 10px;
					margin-bottom: auto;
					height: 90%;
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
			height: 100%;
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
		}

		.home-card-change-item {
			width: 100%;
			height:50%;
			/*@media only screen and (max-width: 768px) {height:350px;};
			@media only screen and (min-width: 768px) {height:325px;};*/
			border-radius: 4px;
			transition: all ease 0.3s;
			
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
		}
	}
	.home-card-three {
		height: 100%;
		.home-card-item {
			/*@media only screen and (max-width: 768px) {
				height:700px;
			}
			@media only screen and (min-width: 768px) {
				height:650px;
			}*/
			height: 100%;
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
