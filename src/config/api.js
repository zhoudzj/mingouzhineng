import axios from "./axiosPlugin"

export const getLogin = (param) => {
    const url = '/user/login';
    return axios.post(url,param)
}

export const getUserInfo = (param) => {
    const url = '/user/getUserInfo';
    return axios.post(url,param)
}

export const getRegister = (param) => {
    const url = '/user/register';
    return axios.post(url,param)
}

export const loginOut = (param) => {
    const url = '/user/logout';
    return axios.post(url,param)
}
//获取户型列表
export const getRoomList = (param) => {
    const url = '/house/list';
    return axios.post(url,param)
}

export const getCombo = (param) => {
    const url = '/style/findByTypeId';
    return axios.post(url,param)
}

export const getProductList = (param) => {
    const url = '/product/list';
    return axios.post(url,param)
}

export const getProductByType = (param) => {
    const url = '/product/findByTypeId';
    return axios.post(url,param)
}
//获取默认产品列表
export const getDefaultProductList = (param) => {
    const url = '/product/defaultList';
    return axios.post(url,param)
}
//生成订单
export const createOrder = (param) => {
    const url = '/order/create';
    return axios.post(url,param)
}
//生成pdf
export const createPdf = (param) => {
    const url = '/order/createPdf';
    return axios.post(url,param)
}

