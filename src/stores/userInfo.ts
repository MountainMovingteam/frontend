import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { Session,Local } from '/@/utils/storage';
import { reqInfo } from '/@/api/user/index'
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
			time: 0,
			roles: [],
			authBtnList: [],
		},
	}),
	actions: {
		async setUserInfos() {
			// 存储用户信息到浏览器缓存
			if (Session.get('userInfo')) {
				this.userInfos = Session.get('userInfo');
			} else {
				const userInfos = <UserInfos>await this.getApiUserInfo();
				this.userInfos = userInfos;
			}
		},
		// 模拟接口数据
		// https://gitee.com/lyt-top/vue-next-admin/issues/I5F1HP
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
					  if (Local.get('role') == 1) {
						// 默认都是管理员
						defaultRoles = adminRoles;
						defaultAuthBtnList = adminAuthBtnList;
					  } else {
						defaultRoles = testRoles;
						defaultAuthBtnList = testAuthBtnList;
					  }
					  const userInfos = {
						username: result.data.username,
						photo: result.data.avatar,
						time: new Date().getTime(),
						roles: defaultRoles,
						email:result.data.email,
						authBtnList: defaultAuthBtnList,
					  };
					  Session.set('userInfo', userInfos);
					  Local.set('userInfo',userInfos);
					  resolve(userInfos);
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
