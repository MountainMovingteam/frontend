<template>
	<el-form size="large" class="login-content-form">
		<el-form-item class="login-animation1">
			<el-input text :placeholder="$t('message.register.placeholder1')" v-model="state.ruleForm.student_id" clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon"><ele-User /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2">
			<el-input text :placeholder="$t('message.register.placeholder2')" v-model="state.ruleForm.userName" clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon"><ele-User /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation3">
			<el-input
				:type="state.isShowPassword ? 'text' : 'password'"
				:placeholder="$t('message.register.placeholder3')"
				v-model="state.ruleForm.password"
				autocomplete="off"
			>
				<template #prefix>
					<el-icon class="el-input__icon"><ele-Unlock /></el-icon>
				</template>
				<template #suffix>
					<i
						class="iconfont el-input__icon login-content-password"
						:class="state.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
						@click="state.isShowPassword = !state.isShowPassword"
					>
					</i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation4">
			<el-input
				:type="state.isShowPassword_confirm ? 'text' : 'password'"
				:placeholder="$t('message.register.placeholder4')"
				v-model="state.ruleForm.password_confirm"
				autocomplete="off"
			>
				<template #prefix>
					<el-icon class="el-input__icon"><ele-Unlock /></el-icon>
				</template>
				<template #suffix>
					<i
						class="iconfont el-input__icon login-content-password"
						:class="state.isShowPassword_confirm ? 'icon-yincangmima' : 'icon-xianshimima'"
						@click="state.isShowPassword_confirm = !state.isShowPassword_confirm"
					>
					</i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation5">
			<el-button round type="primary" v-waves class="login-content-submit" @click="onRegister" :loading="state.loading.register">
				<span>{{ $t('message.register.btnText') }}</span>
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup lang="ts" name="register">
import { reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { initFrontEndControlRoutes } from '/@/router/frontEnd';
import { useRoute, useRouter } from 'vue-router';
import { NextLoading } from '/@/utils/loading';
import { formatAxis } from '/@/utils/formatTime';
import { useI18n } from 'vue-i18n';
import { useLoginApi } from '/@/api/login';
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const emit = defineEmits(['refresh']);
// 定义变量内容
const state = reactive({
	isShowPassword: false,
	isShowPassword_confirm: false,
	ruleForm: {
		student_id: '',
		userName: '',
		password: '',
		password_confirm: '',
	},
	loading: {
		register: false,
	},
});

const onRegister = async () => {
	state.loading.register = true;
	//调用注册
	if (state.ruleForm.password != state.ruleForm.password_confirm) {
		state.loading.register = false;
		ElMessage.warning('注册失败，两次输入的密码不一致');
 	} else {
		try {
			let data = {id: state.ruleForm.student_id, name: state.ruleForm.student_id,password: state.ruleForm.password, comfirmPassword:state.ruleForm.password_confirm,
				email:'',phone:'',academy:0,avatar:''}
			const response = await useLoginApi().register(data);
			ElMessage.success('注册成功,请登录');
			emit('refresh');
			router.push('/home');
		} catch (error:any) {
			console.error('Error registerg in:', error.response);
			ElMessage.warning('注册失败');
		} finally {
			state.loading.register = false;
		}
	}
};

const currentTime = computed(() => {
	return formatAxis(new Date());
});

const registerSuccess = (isNoPower: boolean | undefined) => { //注册后直接登录
	if (isNoPower) {
		ElMessage.warning('注册失败');
	} else {
		// 初始化登录成功时间问候语
		let currentTimeInfo = currentTime.value;
		// 登录成功，跳到转首页
		// 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
		if (route.query?.redirect) {
			router.push({
				path: <string>route.query?.redirect,
				query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
			});
		} else {
			router.push('/');
		}
		// 登录成功提示
		const signInText = t('message.signInText');
		ElMessage.success(`${currentTimeInfo}，${signInText}`);
		// 添加 loading，防止第一次进入界面时出现短暂空白
		NextLoading.start();
	}
	state.loading.register = false;
};
</script>

<style scoped lang="scss">
.login-content-form {
	margin-top: 10px;
	@for $i from 1 through 4 {
		.login-animation#{$i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc($i/10) + s;
		}
	}
	.login-content-code {
		width: 100%;
		padding: 0;
	}
	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 0px;
	}
	.login-msg {
		color: var(--el-text-color-placeholder);
	}
}
</style>
