import axios from 'axios'
import { message } from 'antd';
import store from '@/store';
import history from '@/history'

// 创建axios实例
const instance = axios.create({ timeout: 1000 * 12 });

const base_url = process.env.REACT_APP_BASE_URL
instance.defaults.baseURL = base_url;

instance.defaults.headers.post['Content-Type'] = 'application/json';

instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if(token) {
        config.headers.Authorization = token
    }
    return config
}, error => {
    return Promise.reject(error);
})

instance.interceptors.response.use(res => {
    if (res.status === 200) {
        if (res.data.code === 200) {
            return Promise.resolve(res.data.data);
        } else if(res.data.code === 1301){
            tip(res.data.message);
            toLogin();
        }else if(res.data.code === 1302){
            tip(res.data.message);
            localStorage.removeItem("token");
            toLogin();
        } else if(res.data){
            console.log(res);
            return Promise.resolve(new Blob([res.data], { type: 'application/pdf'}));
        }else {
            return Promise.reject(res.data.message);
        }
    } else {
        return Promise.reject(res);
    }
}, error => {
    const { response } = error;
            console.log(response)
    if (response) {
        // 请求已发出
        errorHandle(response.status, response.data);
        return Promise.reject(response);
    } else {
        // 处理断网的情况
        // eg:请求超时或断网时，更新state的network状态
        // network状态控制着一个全局的断网提示组件的显示隐藏
        // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
        if (!window.navigator.onLine) {
            console.log(error)
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
    console.log(msg);
    message.error({
        content: msg,
        duration: 2,
    })
};

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
    history.push('/login')
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