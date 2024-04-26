<template>
	<div class="home-container layout-pd">
		<el-row :gutter="15" class="home-card-three mb15" >
			<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
				<div 
					:xs="24"
					:sm="12"
					:md="12"
					:lg="12"
					:xl="12"
				>
					<div class="el-hide-xs-only home-card-item " style=';height: 325px; margin-top: auto' v-if='isCollapse'>
						<el-carousel :interval="5000" arrow="always">
							<el-carousel-item v-for="item in 4" :key="item">
							<h3 text="2xl" justify="center">{{ item }}</h3>
							</el-carousel-item>
						</el-carousel>
					</div>
					<div class="home-card-item" style='height: 325px;margin-top: 0px;'>
						<img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" style="height: 100%;width:100%"/>
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
				<ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
					<li v-for="i in count" :key="i" class="infinite-list-item">
						<div class="left-content">
							<div class="text-line-title">Title {{ i }}</div>
							<div class="text-line-content">Text Line 2</div>
						</div>
						<div class="right-content">
							<img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" style="height: 60px;width:100px"/>
						</div>
					</li>
				</ul>
			</div>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="home">
import { reactive, onMounted, ref, watch, nextTick, onActivated, markRaw } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';


// 定义变量内容

const storesTagsViewRoutes = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);
const count = ref(0)
const screenWidth = ref(window.innerWidth)
const isCollapse = ref(screenWidth.value >= 768)
const handleResize = () => {
  screenWidth.value = window.innerWidth
}
const load = () => {
  count.value += 2
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
onMounted(() => {
	initEchartsResize();
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
			height: 650px;
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
					font-weight: bold; 
    				font-size: 16px;
				}

				.text-line-content {
					margin-top: 10px;
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
	}
	.home-card-three {
		.home-card-item {
			height:650px;
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
