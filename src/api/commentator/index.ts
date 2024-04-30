import client from '../client';

const baseURL = 'http://114.116.11.41:8000';

export function myPOST(urlIn: string, field: any) {
	const url = baseURL + urlIn;
	return client.withAuth(client.POST, url, {
		...field,
	});
}
export function myGET(urlIn: string, field: any) {
	const url = baseURL + urlIn;
	return client.withAuth(client.GET, url, {
		...field,
	});
}
