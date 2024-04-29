import request from '/@/utils/request';
/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function useLoginApi() {
	return {
		signIn: (data: object) => {
			return request({
				url: '/api/base/login',
				method: 'post',
				data,
			});
		},
		signOut: (data: object) => {
			return request({
				url: '/user/signOut',
				method: 'post',
				data,
			});
		},
		register: (data: object) => {
			return request({
				url: '/api/base/register',
				method:'post',
				data,
			})
		}
	};
}
/*
import client from '../client'
import qs from 'qs'
const baseURL = ''

export function userSignIn(data: any) {
    let url = baseURL + `/user/signIn/`;
    const reponse = client.withAuth(client.POST, url, {data: data});
    return reponse
}
*/

