import client from '../client';

enum API {
	SEARCH = '/api/problem/search',
	ANSWER = '/api/problem/query/answer',
}
const baseURL = 'http://47.93.19.22:8000';

export function search(field: any) {
	return client.withAuth(client.POST, baseURL + API.SEARCH, { data: { ...field } });
}

export function answer(field: any) {
	return client.withAuth(client.POST, baseURL + API.SEARCH, { data: { ...field } });
}
