import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { Session, Local } from '/@/utils/storage';
import { reqInfo,reqAvatar } from '/@/api/user/index';
import { log } from 'console';

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosState => ({
		userInfos: {
			userName: '',
			photo: '',
			logintime: 0,
			roles: [],
			authBtnList: [],
			notRead:true,
		},
	}),
	actions: {
		async setUserInfos() {
			if (Session.get('userInfo')) {
				this.userInfos = Session.get('userInfo');
			} else {
				const userInfos = <UserInfos>await this.getApiUserInfo();
				this.userInfos = userInfos;
			}
		},
		async getApiUserInfo() {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					reqInfo()
						.then((result: any) => {
							let defaultRoles: Array<string> = [];
							let defaultAuthBtnList: Array<string> = [];
							let adminRoles: Array<string> = ['admin'];
							let adminAuthBtnList: Array<string> = ['btn.add', 'btn.del', 'btn.edit', 'btn.link'];
							let testRoles: Array<string> = ['user'];
							let testAuthBtnList: Array<string> = ['btn.add', 'btn.link'];
							const logintime = getLoginTime();
							if (Local.get('role') == 1) {
								defaultRoles = adminRoles;
								defaultAuthBtnList = adminAuthBtnList;
							} else {
								defaultRoles = testRoles;
								defaultAuthBtnList = testAuthBtnList;
							}
							let userInfos = {
								userName: result.data.username,
								photo: '',
								logintime: logintime,
								roles: defaultRoles,
								email: result.data.email,
								authBtnList: defaultAuthBtnList,
								notRead:true
							};
							reqAvatar().then((avatar) => {
								const ava = "http://47.93.19.22:8000" + avatar.data.avatar_url
								userInfos.photo = ava;
								////console..log(userInfos);
								Session.set('userInfo', userInfos);
								Local.set('userInfo', userInfos);
								resolve(userInfos);
							}).catch((error) => {
								console.error('发生错误：', error);
								reject(error);
							})
						})
						.catch((error) => {
							console.error('发生错误：', error);
							reject(error);
						});
				}, 0);
			});
		},
	},
});

const getLoginTime = () => {
	const currentDate = new Date();
	const year = currentDate.getFullYear();
	const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要+1，然后用padStart方法补齐两位
	const date = currentDate.getDate().toString().padStart(2, '0');
	const hours = currentDate.getHours().toString().padStart(2, '0');
	const minutes = currentDate.getMinutes().toString().padStart(2, '0');
	const seconds = currentDate.getSeconds().toString().padStart(2, '0');
	const formattedTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
	return formattedTime;
};
