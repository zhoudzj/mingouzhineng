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

export const getCombo = (param) => {
    const url = '/style/findByTypeId';
    return axios.post(url,param)
}

export const getProductList = (param) => {
    const url = '/product/list';
    return axios.post(url,param)
}

export const getProductByGroup = (param) => {
    const url = '/product/findByTypeId';
    return axios.post(url,param)
}

