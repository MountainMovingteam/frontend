import client from '../client';

enum API {
	SEARCH = '/api/problem/search',
	ANSWER = '/api/problem/query/answer',
	USER_GET_AVATAR = '/api/base/getAvatar',
}
const baseURL = 'http://47.93.19.22:8000';

export function search(field: any) {
	return client.withAuth(client.POST, baseURL + API.SEARCH, { data: { ...field } });
}

export function answer(field: any) {
	return client.withAuth(client.POST, baseURL + API.ANSWER, { data: { ...field } });
}

export function reqAvatar() {
	let url = baseURL + API.USER_GET_AVATAR;
	const reponse = client.withAuth(client.GET, url, {});
	return reponse;
}
