import client from '../client';

const baseURL = 'http://47.93.19.22:8000';

export function singleBooking(time_index: number, name: string, id: string, phone: string, academy: number) {
	let url = baseURL + '/api/order/person';
	return client.withAuth(client.POST, url, {
		data: {
			time_index: time_index,
			name: name,
			id: id,
			phone: phone,
			academy: academy,
		},
	});
}

export function groupBooking(
	leader: { name: string; id: string; phone: string },
	persons: { id: string; name: string }[],
	academy: number,
	time_index: number
) {
	let url = baseURL + '/api/order/group';
	return client.withAuth(client.POST, url, {
		data: {
			leader: leader,
			persons: persons,
			academy: academy,
			time_index: time_index,
		},
	});
}

export function getPlaceDetails() {
	let url = baseURL + '/api/order/getInfo';
	return client.withAuth(client.GET, url, {});
}
