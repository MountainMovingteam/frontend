import client from '../client';

enum API {
	USER_INFO = 'api/base/getInfo', //个人信息
	USER_EDIT_INFO = 'api/base/editInfo',
}
const baseURL = 'http://47.93.19.22:8000';

export interface Request {
	avatar: string;
	email: string;
	password: string;
	username: string;
	role: string;
	[key: string]: string;
}

export function reqInfo() {
	let url = baseURL + API.USER_INFO;
	const reponse = client.withAuth(client.GET, url, {});
	return reponse;
}

export function modifyBaseInfo(data: FormData) {
	let url = baseURL + API.USER_EDIT_INFO;
	console.log(data);

	const reponse = client.withAuth(client.POST, url, { data: data });
	return reponse;
}
