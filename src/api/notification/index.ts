import client from '../client';

enum API {
	GET_NOTICE = '/api/base/notice', //个人信息
	GET_NOTICE_DETAIL = '/api/base/notice/info',
	IS_READ = '/api/base/read'
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

export function reqNotice() {
	let url = baseURL + API.GET_NOTICE;
	const reponse = client.withAuth(client.GET, url, {});
	return reponse;
}

export function reqNoticeDetail(data : any) {
	let url = baseURL + API.GET_NOTICE_DETAIL;
	const reponse = client.withAuth(client.POST, url, {data:data});
	return reponse;
}


export function readEmail(data : any) {
	let url = baseURL + API.IS_READ;
	const reponse = client.withAuth(client.POST, url, {data:data});
	return reponse;
}

