import { log } from 'console';
import client from '../client';

enum API {
	INFO_LIST = '/api/base/push', //个人信息
    PIC_LIST ='/api/base/pictures',
	HISTORY_LIST = '/api/question/query/history'
	
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

export function getInfoList(data: any) {
	let url = baseURL + API.INFO_LIST;    
	const reponse = client.withAuth(client.POST, url, {data:data});
	return reponse;
}

export function getPicList() {
	let url = baseURL + API.PIC_LIST;
	const reponse = client.withAuth(client.GET, url, {});
	return reponse;
}

export function getQuestionHistory() {
	let url = baseURL + API.HISTORY_LIST;
	const reponse = client.withAuth(client.GET, url, {});
	return reponse;
}
