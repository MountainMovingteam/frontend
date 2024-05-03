import client from "/@/api/client";

const baseURL = 'http://47.93.19.22:8000';

export function getPlaceDetails() {
    let url = baseURL + '/api/manage/search'
    return client.withAuth(client.GET, url, {});
}
