import client from '../client';

enum API {
	USER_INFO = '/api/base/getInfo', //个人信息
	USER_EDIT_INFO = '/api/base/editInfo',
	USER_GET_AVATAR = '/api/base/getAvatar',
	User_EDIT_PASSWORD = '/api/base/modify/password',
	BOOKING_INFO = '/api/base/orderLog',
	CANCEL_BOOKING = '/api/order/delete',
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

export function reqAvatar() {
	let url = baseURL + API.USER_GET_AVATAR;
	const reponse = client.withAuth(client.GET, url, {});
	return reponse;
}

export function modifyBaseInfo(data: FormData) {
	let url = baseURL + API.USER_EDIT_INFO;
	console.log(data);
	const reponse = client.withAuth(client.POST, url, { data: data });
	return reponse;
}

export function modifyPassword(data: any) {
	let url = baseURL + API.User_EDIT_PASSWORD;
	const reponse = client.withAuth(client.POST, url, { data: data });
	return reponse;
}

export function refBookingInfo() {
	let url = baseURL + API.BOOKING_INFO;
	const reponse = client.withAuth(client.GET, url, {});
	return reponse;
}

export function refCancelBooking(field: any) {
	let url = baseURL + API.CANCEL_BOOKING;
	const reponse = client.withAuth(client.POST, url, { data: { ...field } });
	return reponse;
}
