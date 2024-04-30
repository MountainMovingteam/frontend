import client from '../client';

const baseURL = 'http://114.116.11.41:8000';

export function submitAdd(field: any) {
	const url = baseURL + 'api/manage/lecturer/add';
	return client.withAuth(client.POST, url, {
		...field,
	});
}
