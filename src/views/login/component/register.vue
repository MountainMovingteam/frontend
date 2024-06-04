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
			<el-input text :placeholder="$t('message.register.placeholder6')" v-model="state.ruleForm.email" clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon"><ele-Message /></el-icon>
				</template>
				<template #append>
					<el-button @click='getCode'> 获取验证码 </el-button>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation4">
			<el-input text :placeholder="$t('message.register.placeholder7')" v-model="state.ruleForm.code" clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon"><ele-Message /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation5">
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
		<el-form-item class="login-animation6">
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
		<el-form-item class="login-animation7">
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
import { encrypt } from '/@/utils/rsa';
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
		email:'',
		code:''
	},
	loading: {
		register: false,
	},
});

const getCode = () => {
	try {
		const response =  useLoginApi().getCode({email:state.ruleForm.email});
	} catch (error:any) {
		ElMessage.warning(error.response.data.reason);
	}
}

const onRegister = async () => {
	state.loading.register = true;
	//调用注册
	if (state.ruleForm.password != state.ruleForm.password_confirm) {
		state.loading.register = false;
		ElMessage.warning('注册失败，两次输入的密码不一致');
 	} else {
		try {
			let data = {id: state.ruleForm.student_id, name: state.ruleForm.userName,password: await encrypt(state.ruleForm.password), comfirmPassword:await encrypt(state.ruleForm.password_confirm),
				email:'',phone:'',academy:0,avatar:''}
			const response = await useLoginApi().register(data);
			ElMessage.success('注册成功,请登录');
			emit('refresh');
			router.push('/home');
		} catch (error:any) {
			console.error('Error registerg in:', error.response);
			ElMessage.warning(error.response.data.reason);
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
	.el-form-item {
    margin-bottom: 8px; // reduce spacing between form items
	}
	.el-input {
		height: 36px; // reduce input height
		.el-input__inner {
		height: 100%; // ensure inner input matches parent height
		}
	}
	@for $i from 1 through 7 {
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
	}
	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
	}
	.login-msg {
		color: var(--el-text-color-placeholder);
	}
}
</style>
