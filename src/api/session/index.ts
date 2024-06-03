import client from "/@/api/client";

const baseURL = 'http://47.93.19.22:8000';

export function getPlaceDetails() {
    let url = baseURL + '/api/manage/search'
    return client.withAuth(client.GET, url, {});
}

export function getCommentators() {
    let url = baseURL + '/api/manage/lecturer'
    return client.withAuth(client.GET, url, {});
}

export function getSearchDetails(week_num: number, time_index: number) {
    let url = baseURL + '/api/manage/search/details';
    return client.withAuth(client.POST, url, {
        data: {
            week_num: week_num,
            time_index: time_index
        },
    });
}

export function rejectOppointment(data:any) {
    let url = baseURL + '/api/manage/reject'
    return client.withAuth(client.POST, url,{data:data});
}




