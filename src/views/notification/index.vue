<template>
	<div class="home-container " >
		<div class='home-card-item'>
			<div class="home-card-item-title" style="display: flex; align-items: center;">
				<div style="font-size: large; margin-left: 5px;">通知中心</div>
				<div style="flex: 1;"></div>
					<el-button @click="selectAll" v-if="!isSelectAll" size='small'>全选</el-button>
					<el-button @click="cancelSelectAll" size='small' v-else>取消</el-button>
					<el-button @click="" size='small' type='danger'>删除</el-button>
				</div>
			<ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto;margin-left: auto;margin-right: auto;" v-if='notice.maxNotices > 0'>
				<li v-for="(item, index) in notice.noticeArray" :key="index" class="infinite-list-item" >
					<div class="left-left">
						<el-checkbox v-model='item.isChoose'/>
						<el-badge :is-dot="!item.status" style='margin-left: 10%;'/>
					</div>
					<div class="left-content" @click='openDialog(index)'>
						<div class="text-line-title">驳回通知</div>
						<div class="text-line-content">{{ item.key_words }}</div>
					</div>
					<div class="right-content" @click='openDialog(index)'>
						<div class="text-line-content" style='margin-top: 30px;'>{{ item.time }} </div>
					</div>
				</li>
			</ul>
			<el-empty :description="$t('message.user.newDesc')"  class='empty' v-else></el-empty>
		</div>
		<DetailDialog ref="DetailDialogRef" />
	</div>
</template>

<script setup lang="ts" name="notification">
import { defineAsyncComponent,reactive, computed,ref,onMounted } from 'vue';
import { staticRoutes } from '/@/router/route';
import { reqNotice } from '/@/api/notification/index';
import { ElMessage } from 'element-plus';

const message = ref(ElMessage);
const DetailDialog = defineAsyncComponent(() => import('/@/views/notification/dialog.vue'));
const DetailDialogRef = ref();
const count = ref(0)
const noticeList = ref([]);
const notice = reactive<any>({
	maxNotices : 0,
	noticeArray : [],
	start: 1,
	end:10,
})
const isSelectAll = ref(false)

const load = () => {
	if (notice.noticeArray.length >= notice.maxNotices) {
		return;
	} else {
		notice.start = notice.end + 1;
		if (notice.start + 9 < notice.maxNotices) {
			notice.end = notice.start + 9;
		} else {
			notice.end = notice.maxNotices;
		}
		getInfo(notice.start,notice.end);
	}
}


const getInfo = (start:number,end:number)  => {
	const data = {
		start:start,
		end:end
	}
	
	const slicedNoticeList = noticeList.value.slice(start - 1, end);
	slicedNoticeList.forEach((item:any) => {
    	item.isChoose=false;
	})
	notice.noticeArray = notice.noticeArray.concat(slicedNoticeList);	
}

onMounted(() => {
	isSelectAll.value = false;
	const response = reqNotice();
	response.then(response => {
		notice.maxNotices = response.data.num;
		if (notice.maxNotices == 0) {
			return;
		}
		noticeList.value = response.data.notice_list.slice().reverse();
		noticeList.value.forEach((item:any) => {
    		item.isChoose=false;
		})
		if (notice.maxNotices <= 10) {
			getInfo(1,notice.maxNotices);
		} else {
			getInfo(1,10);
		}
	}).catch(error => {
		message.value.error('通知加载失败');
	})
	
});

const openDialog = (i:any) => {
	DetailDialogRef.value.openDialog(notice.noticeArray[i].notice_id);
	notice.noticeArray[i].status=true;
}

const selectAll  = () => {
	isSelectAll.value = true;
	noticeList.value.forEach((item:any) => {
    	item.isChoose=true;
	})
}

const cancelSelectAll  = () => {
	isSelectAll.value = false;
	noticeList.value.forEach((item:any) => {
    	item.isChoose=false;
	})
}

</script>

<style scoped lang="scss">
$homeNavLengh: 8;

.home-container {
	overflow: hidden;
	max-height: 100%;
	
		.infinite-list {
			@media only screen and (max-width: 768px) {
				height: 680px;
			}
			@media only screen and (min-width: 768px) {
				height:600px;
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
				
				.left-left {
					@media only screen and (max-width: 768px) {
						width: 10%;
					}
					@media only screen and (max-width: 1320px) {
						width: 6%;
					}
					@media only screen and (min-width: 1320px) {
						width: 4%;
					}
					
					margin-top: auto;
					margin-bottom: auto;
				}
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
			height: 100%;
			margin-top: 5px;
			margin-left: auto;
			margin-right: auto;
			border-radius: 4px;
			transition: all ease 0.3s;
			padding: 20px;
			overflow: hidden;
			background: var(--el-color-white);
			color: var(--el-text-color-primary);
			border: 1px solid var(--next-border-color-light);
			.empty {
				@media only screen and (max-width: 768px) {
				height: 680px;
			}
				@media only screen and (min-width: 768px) {
					height:600px;
			}
			}
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