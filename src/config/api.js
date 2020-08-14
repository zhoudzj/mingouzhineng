import axios from "./axiosPlugin"
//用户登录
export const getLogin = (param) => {
    const url = '/user/login';
    return axios.post(url,param)
}
//获取用户信息
export const getUserInfo = (param) => {
    const url = '/user/getUserInfo';
    return axios.post(url,param)
}
//用户注册
export const getRegister = (param) => {
    const url = '/user/register';
    return axios.post(url,param)
}
//登出
export const loginOut = (param) => {
    const url = '/user/logout';
    return axios.post(url,param)
}
//获取户型列表
export const getRoomList = (param) => {
    const url = '/house/list';
    return axios.post(url,param)
}
//查找房产类型
export const getCombo = (param) => {
    const url = '/style/findType';
    return axios.post(url,param)
}
//获取产品列表
export const getProductList = (param) => {
    const url = '/product/list';
    return axios.post(url,param)
}
//获取产品类型
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
//获取订单
export const getOrderList = (param) => {
    const url = '/order/list';
    return axios.get(url)
}
//获取订单详情
export const getOrderListDetail = (param) => {
    const url = '/order/detail';
    return axios.post(url,param)
}
//删除订单
export const removeOrder = (param) => {
    const url = '/order/remove';
    return axios.post(url,param)
}
//生成pdf
export const createPdf = (param) => {
    const url = '/order/createPdf';
    return axios.get(url,{
        params:param,
        responseType: 'arraybuffer',
        headers:{
            'Accept':'application/pdf'
        }
    })
}

