<template>
	<div class="personal layout-pd">
		<el-row>
			<!-- 个人信息 -->
			<el-col :xs="24" :sm="16">
				<el-card shadow="hover" header="个人信息">
					<div class="personal-user">
						<div class="personal-user-left">
							<div class="h100 personal-user-left-upload">
								<img :src="state.personalForm.avatar" />
								<el-button type="primary" round size='small' bg style="border: none;" class='uploadButton'
									@click='changeAvatar'>
									上传头像
								</el-button>
							</div>
						</div>
						<div class="personal-user-right">
							<el-row>
								<el-col :span="24" class="personal-title mb18">{{ currentTime
								}}，{{ state.personalForm.name }} </el-col>
								<el-col :span="24">
									<el-row>
										<el-col :xs="24" :sm="8" class="personal-item mb6">
											<div class="personal-item-label">{{ state.roleIdent }}：</div>
											<div class="personal-item-value">{{ state.personalForm.id }}</div>
										</el-col>
										<el-col :xs="24" :sm="16" class="personal-item mb6">
											<div class="personal-item-label">身份：</div>
											<div class="personal-item-value">{{ state.personalForm.role }}</div>
										</el-col>
									</el-row>
								</el-col>
								<el-col :span="24">
									<el-row>
										<el-col :xs="24" :sm="8" class="personal-item mb6" v-if='!state.isAdmin'>
											<div class="personal-item-label">学院：</div>
											<div class="personal-item-value">{{ state.personalForm.academy === 0 ? '暂无学院信息'
												: state.personalForm.academy }}</div>
										</el-col>
										<el-col :xs="24" :sm="16" class="personal-item mb6">
											<div class="personal-item-label">登录时间：</div>
											<div class="personal-item-value">{{ state.personalForm.logintime }}</div>
										</el-col>
									</el-row>
								</el-col>
							</el-row>
						</div>
					</div>
				</el-card>
			</el-col>

			<!-- 消息通知 -->
			<el-col :xs="24" :sm="8" class="pl15 personal-info">
				<el-card shadow="hover">
					<template #header>
						<span>消息通知<el-badge :is-dot="hasNotRead"/></span>
						<span class="personal-info-more" @click='moreNotifications' v-if='!state.isAdmin'>更多</span>
					</template>
					<div class="personal-info-box">
						<ul class="personal-info-ul" v-if='notice.total > 0'>
							<li v-for="(v, k) in notice.noticeArray" :key="k" class="personal-info-li"
								@click='openDetailDialog(k)'>
								<p style='font-size: large;'>驳回申请<el-badge :is-dot="!v.status"/></p>
								<div target="_block" class="personal-info-li-title">{{ v.key_words }}</div>
								<div> {{ v.time }} </div>
							</li>
						</ul>
						<el-empty :description="$t('message.user.newDesc')" style='height: 50%;' v-else></el-empty>
					</div>
				</el-card>
			</el-col>

			<!-- 预约记录 -->
			<el-col :span="24">
				<el-card shadow="hover" class="mt15" header="预约记录" style="height: 400px!;">
					<el-row :gutter="15" class="personal-recommend-row">
						<el-col :sm="6" v-for="(v, k) in state.recommendList" :key="k" class="personal-recommend-col">
							<div class="personal-recommend" :style="{ 'background-color': v.bg }">
								<SvgIcon :name="v.icon" :size="70" :style="{ color: v.iconColor }" />
								<div class="personal-recommend-tagsContainer">
									<el-tag class="personal-recommend-tag" type="warning" effect="light">{{ v.type
									}}</el-tag>
									<el-tag class="personal-recommend-tag" type="danger" effect="light"
										v-if="v.status == '已驳回'">{{
											v.status }}</el-tag>
								</div>
								<div class="personal-recommend-auto">
									<div style="font-weight: bold;">校区：{{ v.campus }}</div>
									<div class="personal-recommend-msg">第{{ v.week_num }}周: {{ v.weekday }}</div>
									<div class="personal-recommend-msg">场次: {{ v.session }}</div>
									<div class="personal-recommend-msg">讲解员: {{ v.commentator }}</div>
								</div>
								<el-button v-if="v.status != '已驳回'" color="#626aef" plain
									class="personal-recommend-cancel-button" @click="cancelBooking(v)">取消预约</el-button>
							</div>


						</el-col>
					</el-row>
				</el-card>
			</el-col>

			<!-- 更新信息 -->
			<el-col :span="24">
				<el-card shadow="hover" class="mt15 personal-edit" header="更新信息">
					<div class="personal-edit-title">基本信息</div>
					<el-form :model="state.personalForm" size="default" label-width="40px" class="mt35 mb35">
						<el-row :gutter="35">
							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
								<el-form-item label="昵称">
									<el-input v-model="state.personalForm.name" placeholder="请输入昵称" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
								<el-form-item label="邮箱">
									<el-input v-model="state.personalForm.email" placeholder="请输入邮箱" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
								<el-form-item label="手机">
									<el-input v-model="state.personalForm.phone" placeholder="请输入手机号" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20"
								v-if='state.personalForm.academy != 0'>
								<el-form-item label="学院">
									<el-input v-model="state.personalForm.academy" placeholder="请输入学院号"
										clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
								<el-form-item>
									<el-button type="primary" style='background-color: #409eff;border-color: #409eff;'
										@click='changeInfo'>
										<el-icon>
											<ele-Position />
										</el-icon>
										更新个人信息
									</el-button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<div class="personal-edit-title mb15">账号安全</div>
					<div class="personal-edit-safe-box">
						<div class="personal-edit-safe-item">
							<div class="personal-edit-safe-item-left">
								<div class="personal-edit-safe-item-left-label">账户密码</div>
<!--								<div class="personal-edit-safe-item-left-value">当前密码强度：强</div>-->
							</div>
							<div class="personal-edit-safe-item-right">
								<el-button text type="primary" @click='changePassword'>立即修改</el-button>
							</div>
						</div>
					</div>
					<div class="personal-edit-safe-box" v-if='changePw.changePw'>
						<div class="personal-edit-safe-item">
							<div class="personal-edit-safe-item-left">
								<div class="personal-edit-safe-item-left-label">修改密码</div>
								<el-form-item label="原密码：">
									<el-input :type="changePw.isShowPassword ? 'text' : 'password'" :placeholder="'请输入原密码'"
										v-model="changePw.originPassword" autocomplete="off" size="medium">
										<template #prefix>
											<el-icon class="el-input__icon"><ele-Unlock /></el-icon>
										</template>
										<template #suffix>
											<i class="iconfont el-input__icon login-content-password"
												:class="changePw.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
												@click="changePw.isShowPassword = !changePw.isShowPassword">
											</i>
										</template>
									</el-input>
								</el-form-item>
								<el-form-item label="新密码：">
									<el-input :type="changePw.isShowNewPassword ? 'text' : 'password'"
										:placeholder="'请输入新密码'" v-model="changePw.newPassword" autocomplete="off"
										size="medium">
										<template #prefix>
											<el-icon class="el-input__icon"><ele-Unlock /></el-icon>
										</template>
										<template #suffix>
											<i class="iconfont el-input__icon login-content-password"
												:class="changePw.isShowNewPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
												@click="changePw.isShowNewPassword = !changePw.isShowNewPassword">
											</i>
										</template>
									</el-input>
								</el-form-item>

								<el-form-item label="重复新密码：">
									<el-input :type="changePw.isShowConfirmNewPassword ? 'text' : 'password'"
										:placeholder="'请再次输入新密码'" v-model="changePw.newConfirmPassword" autocomplete="off"
										size="medium">
										<template #prefix>
											<el-icon class="el-input__icon"><ele-Unlock /></el-icon>
										</template>
										<template #suffix>
											<i class="iconfont el-input__icon login-content-password"
												:class="changePw.isShowConfirmNewPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
												@click="changePw.isShowConfirmNewPassword = !changePw.isShowConfirmNewPassword">
											</i>
										</template>
									</el-input>
								</el-form-item>

								<div style="display: flex; justify-content: right; margin-top: 10px;">
									<el-form-item>
										<el-button type="primary" style='background-color: #409eff;border-color: #409eff;'
											size='middle' v-waves class="" @click="onConfirmChange"
											:loading="changePw.loading">
											<span>确认修改</span>
										</el-button>
										<el-button type="info" size='middle' v-waves class="" @click="onCancelChange"
											:loading="changePw.loading">
											<span>取消修改</span>
										</el-button>
									</el-form-item>
								</div>
							</div>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
		<Dialog ref="DialogRef" @refresh='getInfo' />
		<DetailDialog ref="DetailDialogRef" />
	</div>
</template>

<script setup lang="ts" name="personal">
import { reactive, computed, onMounted, ref, defineAsyncComponent } from 'vue';
import { formatAxis } from '/@/utils/formatTime';
import { newsInfoList } from './mock';
import { storeToRefs } from 'pinia';
import router from '/@/router';
import { reqInfo, modifyBaseInfo, modifyPassword, reqAvatar, refBookingInfo, refCancelBooking } from "/@/api/user/index";
import { useUserInfo } from '/@/stores/userInfo';
import { Local, Session } from '/@/utils/storage';
import { ElMessage } from 'element-plus';
import { reqNotice } from '/@/api/notification/index';
import { encrypt } from '/@/utils/rsa';
import { getBookingData2Show, info2TimeIndex } from '/@/utils/transform';

const DetailDialog = defineAsyncComponent(() => import('/@/views/notification/dialog.vue'));
const DetailDialogRef = ref();
const message = ref(ElMessage);
const stores = useUserInfo();
const { userInfos } = storeToRefs(stores);
const DialogRef = ref();
const Dialog = defineAsyncComponent(() => import('/@/views/personal/dialog.vue'));
const changeAvatar = () => {
	DialogRef.value.openDialog(state.personalForm.avatar, assemblyFormData());
}
const hasNotRead = ref(false)
// 定义变量内容
const state = reactive<PersonalState>({
	isAdmin: false,
	newsInfoList,
	recommendList: [],
	roleIdent: '',
	personalForm: {
		id: '',
		name: '',
		role: '',
		academy: 0,
		email: '',
		autograph: '',
		avatar: '',
		phone: '',
		sex: '',
		logintime: ''
	},
});

const notice = reactive<any>({
	total: 0,
	noticeArray: [],
})

const changePw = reactive({
	loading: false,
	changePw: false,
	isShowPassword: false,
	isShowNewPassword: false,
	isShowConfirmNewPassword: false,
	originPassword: '',
	newPassword: '',
	newConfirmPassword: ''
});
// 当前时间提示语
const currentTime = computed(() => {
	return formatAxis(new Date());
});

const changePassword = () => {
	changePw.changePw = true;
}

onMounted(() => {
	getInfo();
	getNotice();
	getBookingInfo();
})

const getNotice = () => {
	hasNotRead.value=false;
	if (Local.get('role') == 1) {
		return;
	}
	const response = reqNotice();
	response.then(response => {
		notice.total = response.data.num;
		if (notice.total > 0) {
			const reversedList = response.data.notice_list.slice().reverse();
			if (notice.total > 1) {
				notice.noticeArray = reversedList.slice(0, 2);
			} else {
				notice.noticeArray = reversedList;
			}
			for (let i = 0; i < reversedList.length; i++) {
				const item = reversedList[i];
				if (!item.status) {
					hasNotRead.value = true;
					break; // 跳出整个循环
				}
			}
		}
	}).catch(error => {
		message.value.error('通知加载失败');
	})
}

const getInfo = () => {
	const response = reqInfo();
	response.then(response => {
		const data = response.data.student_info;
		state.personalForm.id = data.id;
		state.personalForm.name = data.name;
		state.personalForm.email = data.email;
		state.personalForm.phone = data.phone;
		state.personalForm.academy = data.academy === null ? 0 : data.academy;
		state.personalForm.logintime = Local.get('userInfo').logintime;
		if (Local.get('role') == 1) {
			state.personalForm.role = '管理员'
			state.roleIdent = '工号'
			state.isAdmin = true;
			state.personalForm.academy = 0;
		} else {
			state.personalForm.role = '普通用户'
			state.roleIdent = '学号'
			state.isAdmin = false;
		}
	})
	const ava = reqAvatar();
	ava.then(response => {
		state.personalForm.avatar = "http://47.93.19.22:8000" + response.data.avatar_url
		Local.remove('userInfo')
		userInfos.value.photo = state.personalForm.avatar;
		Local.set('userInfo', userInfos.value)
		Session.remove('userInfo')
		Session.set('userInfo', userInfos.value)
	})
}

const getBookingInfo = () => {
	const response = refBookingInfo();
	response.then(response => {
		state.recommendList = getBookingData2Show(response.data.list);
	}).catch(error => {
		ElMessage.error('获取预约信息失败:', error);
	})
}

const cancelBooking = (v: any) => {
	refCancelBooking({
		"week_num": v.week_num,
		"time_index": info2TimeIndex(v)
	}).then(response => {
		//console..log(response)
		if (response.data.success) {
			ElMessage.success('取消预约成功');
			getBookingInfo();
		} else {
			ElMessage.error('取消预约失败');
		}
	}).catch(error => {
		ElMessage.error('取消预约失败:', error);
	})
}

const assemblyFormData = () => {
	const formData = new FormData();
	formData.append('id', "");
	formData.append('name', state.personalForm.name);
	formData.append('email', state.personalForm.email);
	formData.append('phone', state.personalForm.phone);
	if (Local.get('role') == 0) {
		formData.append('academy', state.personalForm.academy.toString());
	} else {
		formData.append('academy', "0");
	}
	return formData;
}

const changeInfo = () => {
	const formData = assemblyFormData();

	const response = modifyBaseInfo(formData);
	////console..log(formData);

	response.then(response => {
		message.value.success('修改成功');
		Local.remove('userInfo')
		userInfos.value.name = state.personalForm.name;
		Local.set('userInfo', userInfos.value)
		Session.remove('userInfo')
		Session.set('userInfo', userInfos.value)
	}).catch(error => {
		message.value.error(error.response.data.reason);
	})
}


const clearCpwInfo = () => {
	changePw.changePw = false;
	changePw.isShowPassword = false;
	changePw.isShowNewPassword = false;
	changePw.isShowConfirmNewPassword = false;
	changePw.originPassword = '';
	changePw.newPassword = '';
	changePw.newConfirmPassword = '';
}

const onConfirmChange = async () => {
	changePw.loading = true;
	const data = {
		old_password: await encrypt(changePw.originPassword),
		password: await encrypt(changePw.newPassword),
	}

	try {
		const response = await modifyPassword(data);
    if (changePw.newPassword == changePw.newConfirmPassword) {
      message.value.success('修改成功');
      changePw.loading = false;
      clearCpwInfo();
    }else {
      message.value.error('两次输入的新密码不一致');
      changePw.loading = false;
    }
  }
	catch (error) {
		message.value.error(error.response.data.reason);
    changePw.loading = false;
	}
}

const onCancelChange = () => {
	clearCpwInfo();
}

const moreNotifications = () => {
	router.push('/notification');
}

const openDetailDialog = (i: any) => {
	DetailDialogRef.value.openDialog(notice.noticeArray[i].notice_id);
	notice.noticeArray[i].status=true;
}
</script>

<style scoped lang="scss">
@import '../../theme/mixins/index.scss';

.personal {

	.personal-user {
		height: 130px;
		display: flex;
		align-items: center;

		.personal-user-left {
			width: 100px;
			height: 130px;
			border-radius: 3px;

			:deep(.el-upload) {
				height: 100%;
			}

			.personal-user-left-upload {
				img {
					width: 100%;
					height: 95%;
					border-radius: 3px;
				}

				&:hover {
					img {
						animation: logoAnimation 0.3s ease-in-out;
					}
				}

				.uploadButton {
					width: 100%;
					margin: 0 auto;
					background-color: #409eff;
				}
			}
		}

		.personal-user-right {
			flex: 1;
			padding: 0 15px;

			.personal-title {
				font-size: 18px;
				@include text-ellipsis(1);
			}

			.personal-item {
				display: flex;
				align-items: center;
				font-size: 13px;

				.personal-item-label {
					color: var(--el-text-color-secondary);
					@include text-ellipsis(1);
				}

				.personal-item-value {
					@include text-ellipsis(1);
				}
			}
		}
	}

	.personal-info {
		.personal-info-more {
			float: right;
			color: var(--el-text-color-secondary);
			font-size: 13px;

			&:hover {
				color: var(--el-color-primary);
				cursor: pointer;
			}
		}

		.personal-info-box {
			height: 130px;
			overflow: hidden;

			.personal-info-ul {
				list-style: none;

				.personal-info-li {
					font-size: 13px;
					padding-bottom: 10px;

					.personal-info-li-title {
						display: inline-block;
						@include text-ellipsis(1);
						color: var(--el-text-color-secondary);
						text-decoration: none;
					}

					& a:hover {
						color: var(--el-color-primary);
						cursor: pointer;
					}
				}
			}
		}
	}

	.personal-recommend-row {
		.personal-recommend-col {
			.personal-recommend {
				position: relative;
				height: 150px;
				border-radius: 3px;
				overflow: hidden;
				margin-top: 8px;

				&:hover {
					i {
						right: 0px !important;
						bottom: 0px !important;
						transition: all ease 0.3s;
					}
				}

				i {
					position: absolute;
					right: -10px;
					bottom: -10px;
					font-size: 70px;
					transform: rotate(-30deg);
					transition: all ease 0.3s;
				}

				.personal-recommend-auto {
					padding: 15px;
					position: absolute;
					left: 0;
					color: var(--next-color-white);

					.personal-recommend-msg {
						font-weight: bold;
						font-size: 12px;
						margin-top: 10px;
					}
				}

				.personal-recommend-tagsContainer {
					display: flex;
					float: right;
					flex-direction: row;
					/* 修改为横向排布 */

					.personal-recommend-tag {
						// 放在最右边
						float: right;
						margin-top: 12px;
						margin-right: 5px;
					}
				}

				.personal-recommend-cancel-button {
					position: absolute;
					right: 5px;
					bottom: 10px;
					border-radius: 5px;
					cursor: pointer;
					transition: opacity 0.3s ease;
					height: 23%;
					/* 设置按钮高度 */
					line-height: 21%;
					/* 设置行高使文本垂直居中 */
					padding: 0 4%;
					/* 调整内边距使按钮内容居中 */
					font-size: 12px;
					/* 调整字体大小 */
				}
			}
		}
	}

	.personal-edit {
		.personal-edit-title {
			position: relative;
			padding-left: 10px;
			color: var(--el-text-color-regular);

			&::after {
				content: '';
				width: 2px;
				height: 10px;
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				background: var(--el-color-primary);
			}
		}

		.personal-edit-safe-box {
			border-bottom: 1px solid var(--el-border-color-light, #ebeef5);
			padding: 15px 0;

			.personal-edit-safe-item {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.personal-edit-safe-item-left {
					flex: 1;
					overflow: hidden;

					.personal-edit-safe-item-left-label {
						color: var(--el-text-color-regular);
						margin-bottom: 5px;
					}

					.personal-edit-safe-item-left-value {
						color: var(--el-text-color-secondary);
						@include text-ellipsis(1);
						margin-right: 15px;
					}
				}
			}

			&:last-of-type {
				padding-bottom: 0;
				border-bottom: none;
			}
		}
	}
}
</style>