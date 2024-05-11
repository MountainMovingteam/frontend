import request from '/@/utils/request';

export function pubKeyApi() {
	return {
		getPubKey: () => {
			return request({
				url: '/api/base/getPublicKey',
				method: 'get'
			});
		}
	};
}