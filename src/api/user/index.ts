import client from '../client'

enum API{
    USER_INFO = 'api/base/getInfo', //个人信息
}
const baseURL = 'http://123.57.128.246:8000/'

export interface Request {
    avatar: string;
    email: string;
    password: string;
    username: string;
    role : string;
    [key: string]: string;
}

export function reqInfo() {
    let url = baseURL + API.USER_INFO;
    const reponse = client.withAuth(client.GET, url, {});
    return reponse
}
