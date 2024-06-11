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
						<div style="height:95%;margin-top: auto;margin-bottom: auto;" ref="homeLineRef" v-if='isAdmin'></div>
						<div style="height:95%;margin-top: auto;margin-bottom: auto;" ref="homePieRef" v-else></div>
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
import { getInfoList,getPicList,getQuestionHistory } from '/@/api/mainpage/index'
import { ElMessage } from 'element-plus';
import { Local} from '/@/utils/storage';
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
const homePieRef = ref();
const isAdmin = ref(false);
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
	if (Local.get('role') == 1) {
		isAdmin.value = true;
	} else {
		isAdmin.value = false;
	}
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
				if (Local.get('role') == 1) {
					initLineChart();
				} else {
					initPieChart();
				}
				
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

const initPieChart = async () => {
	var getvalue = <any>[];
	try {
		const response = await getQuestionHistory();
		//getvalue.push(response.data.);
		console.log(response.data);
		if (response.data.question_num == 0) {
			getvalue.push((100).toFixed(2));
			getvalue.push((0).toFixed(2));
		} else {
			getvalue.push((response.data.correct_rate * 100).toFixed(2));
			getvalue.push(((1-response.data.correct_rate) * 100).toFixed(2));
		}
		
	} finally {
		if (!state.global.dispose.some((b: any) => b === state.global.homeChartTwo)) state.global.homeChartTwo.dispose();
		state.global.homeChartTwo = markRaw(echarts.init(homePieRef.value, state.charts.theme));
		var getname = ['正确率', '错误率'];
		var data = [];
		for (var i = 0; i < getname.length; i++) {
			data.push({ name: getname[i], value: getvalue[i] });
		}
		const colorList = ['#36C78B','#FF0000'];
		const option = {
			backgroundColor: state.charts.bgColor,
			title: {
				text: '答题正确率',
				x: 'left',
				textStyle: { fontSize: '15', color: state.charts.color },
			},
			tooltip: { trigger: 'item', formatter: '{b} <br/> {c}%' },
			graphic: {
				elements: [
					{
						type: 'image',
						z: -1,
						style: {
							image: themeConfig.value.isIsDark
								? ''
								: 'data:image/png;base64,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',
							width: 230,
							height: 230,
						},
						left: '16.5%',
						top: 'center',
					},
				],
			},
			legend: {
				type: 'scroll',
				orient: 'vertical',
				right: '0%',
				left: '65%',
				top: 'center',
				itemWidth: 14,
				itemHeight: 14,
				data: getname,
				textStyle: {
					rich: {
						name: {
							fontSize: 14,
							fontWeight: 400,
							width: 200,
							height: 35,
							padding: [0, 0, 0, 60],
							color: state.charts.color,
						},
						rate: {
							fontSize: 15,
							fontWeight: 500,
							height: 35,
							width: 40,
							padding: [0, 0, 0, 30],
							color: state.charts.color,
						},
					},
				},
			},
			series: [
				{
					type: 'pie',
					radius: ['82', themeConfig.value.isIsDark ? '50' : '102'],
					center: ['32%', '50%'],
					itemStyle: {
						color: function (params: any) {
							return colorList[params.dataIndex];
						},
					},
					label: { show: false },
					labelLine: { show: false },
					data: data,
				},
			],
		};
		state.global.homeChartTwo.setOption(option);
		state.myCharts.push(state.global.homeChartTwo);
	}
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
			@media only screen and (min-width: 768px) {padding: 20px;};
			@media only screen and (min-width: 768px) {border-radius: 4px;};
			
			transition: all ease 0.3s;
			overflow: hidden;
			background: var(--el-color-white);
			color: var(--el-text-color-primary);
			@media only screen and (min-width: 768px) {border: 1px solid var(--next-border-color-light);};
			
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
		}
	}
}
</style>
