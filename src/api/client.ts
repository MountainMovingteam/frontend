import axios from 'axios'
import {Local, Session} from '/@/utils/storage'
import { ElMessage } from 'element-plus'
import { log } from 'console'

function DELETE(url: string, options?: any) {
  return axios({ method: 'DELETE', url, ...options })
}

function GET(url: string, options?: any) {
  return axios({ method: 'GET', url, ...options })
}

function POST(url: string, options?: any) {
  // if (
  //   options?.data &&
  //   options.headers?.['Content-Type'] !== 'multipart/form-data'
  // )
  //   options.data = qs.stringify(options.data, { arrayFormat: 'brackets' })
  return axios({ method: 'POST', url, ...options })
}

function PUT(url: string, options?: any) {
  // if (options?.data)
  //   options.data = qs.stringify(options.data, { arrayFormat: 'brackets' })
  return axios({ method: 'PUT', url, ...options })
}

async function withAuth(func: Function, url: String, options:any) {
  try {
    const headers = { Authorization: Local.get('access') };
    options.headers = headers;
    console.log(options);
    
    const response = await func(url, options);
    return response;
  } catch (error:any) {
    console.log(error.response.data.message)
    if (error.response.request.status == 401) {
        console.log("超时")
        ElMessage({
        type: 'error',
        message: '连接超时，请重新登录'
      })
      Session.clear();
      window.location.reload();
    } else {
      throw error
    }
  }
}

export default { DELETE, GET, POST, PUT, withAuth }