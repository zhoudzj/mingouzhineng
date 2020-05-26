import axios from "./axiosPlugin"

export const getLogin = (param) => {
    const url = '/user/login';
    return axios.post(url,param)
}

export const getUserInfo = (param) => {
    const url = '/user/login';
    return axios.post(url,param)
}

export const getRegister = (param) => {
    const url = '/user/register';
    return axios.post(url,param)
}

