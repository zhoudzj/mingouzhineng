import axios from 'axios'
import { message } from 'antd';
import store from '../store';
const createHistory = require('history').createBrowserHistory;

// 创建axios实例
const instance = axios.create({ timeout: 1000 * 12 });

let env = process.env.NODE_ENV
if (env === 'development') {
    instance.defaults.baseURL = '/app';
} else if (env === 'production') {
    instance.defaults.baseURL = 'https://www.365tc.cn/app';
}

instance.defaults.headers.post['Content-Type'] = 'application/json';

instance.interceptors.request.use(config => {
    config.headers.Authorization = localStorage.getItem('token')
    return config
}, error => {
    return Promise.reject(error);
})

instance.interceptors.response.use(res => {
    if (res.status === 200) {
        if (res.data.code === 200) {
            return Promise.resolve(res.data.data);
        } else {
            tip(res.data.message);
            return Promise.reject(res.data.message);
        }
    } else {
        return Promise.reject(res);
    }
}, error => {
    const { response } = error;
    if (response) {
        // 请求已发出，但是不在2xx的范围
        errorHandle(response.status, response.data);
        return Promise.reject(response);
    } else {
        // 处理断网的情况
        // eg:请求超时或断网时，更新state的network状态
        // network状态控制着一个全局的断网提示组件的显示隐藏
        // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
        if (!window.navigator.onLine) {
            store.dispatch({
                type: 'CHANGE_NETWORK',
                payload: { network: false }
            });
        } else {
            return Promise.reject(error);
        }
    }
})

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const tip = (msg) => {
    message.error({
        content: msg,
        duration: 1,
    })
};

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
    createHistory().push('/login')
};

const errorHandle = (status, other) => {
    // 状态码判断
    switch (status) {
        // 401: 未登录状态，跳转登录页
        case 401:
            toLogin();
            break;
        // 403 token过期
        // 清除token并跳转登录页
        case 403:
            tip('登录过期，请重新登录');
            localStorage.removeItem('token');
            store.commit('loginSuccess', null);
            setTimeout(() => {
                toLogin();
            }, 1000);
            break;
        // 404请求不存在
        case 404:
            tip('请求的资源不存在');
            break;
        default:
            console.log(other);
    }
};

window.axios = instance;
export default instance