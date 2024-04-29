<template>
	<div class="home-container " >
		<div class='home-card-item'>
			<div class="home-card-item-title">通知中心</div>
			<ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto;margin-left: auto;margin-right: auto;">
				<li v-for="i in count" :key="i" class="infinite-list-item" @click='openDialog(i)'>
					<div class="left-content">
						<div class="text-line-title">Title {{ i }}</div>
						<div class="text-line-content">Text Line 2</div>
					</div>
					<div class="right-content">
						<div class="text-line-content" style='margin-top: 100%;'> time </div>
					</div>
				</li>
			</ul>
		</div>
		<DetailDialog ref="DetailDialogRef" @refresh="getInfoData" />
	</div>
</template>

<script setup lang="ts" name="notification">
import { defineAsyncComponent,reactive, computed,ref } from 'vue';
const DetailDialog = defineAsyncComponent(() => import('/@/views/notification/dialog.vue'));
const DetailDialogRef = ref();
const count = ref(0)
const load = () => {
  count.value += 2
}
// 定义变量内容
const state = reactive<any>({

});

const getInfoData = () => {

}

const openDialog = (i:any) => {
	console.log(i);
	const data = {
		title: 'Hello',
		content: 'Some content here',
		time: '2024-04-30'
	};
	DetailDialogRef.value.openDialog(i,data);
}
</script>

<style scoped lang="scss">
$homeNavLengh: 8;

.home-container {
	overflow: hidden;
	max-height: 100%;
	
		.infinite-list {
			@media only screen and (max-width: 768px) {
				height: 800px;
			}
			@media only screen and (min-width: 768px) {
				height:500px;
			}
			list-style: none;
			}
			.infinite-list .infinite-list-item {
				border-top: 1px solid #ccc;
				border-bottom: 1px solid #ccc;
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
			@media only screen and (max-width: 768px) {
				width:100%;
			}
			@media only screen and (min-width: 768px) {
				width:60%;
			}
			margin-left: auto;
			margin-right: auto;
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
}
</style>