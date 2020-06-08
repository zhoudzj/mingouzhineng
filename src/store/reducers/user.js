import {ADD_TOKEN,SET_USERINFO,REMOVE_TOKEN} from '../actions/user'
let userInfo_store = localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):null;
let token_store = localStorage.getItem('token')?localStorage.getItem('token'):'';
const initState = {
    token:token_store,
    userInfo:userInfo_store
}

export default (state = initState,action) =>{
    switch (action.type) {
        case ADD_TOKEN:
            const token = action.payload.token;
            localStorage.setItem("token",token);
            return Object.assign({},state,{
                token
            })
        case SET_USERINFO:
            const userInfo = action.payload.userInfo
            localStorage.setItem("userInfo",JSON.stringify(userInfo));
            return Object.assign({},state,{
                userInfo
            })
        case REMOVE_TOKEN:
            // const token = action.payload.token;
            // const userInfo = action.payload.userInfo;
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
            return Object.assign({},state,{
                token:action.payload.token,userInfo:action.payload.userInfo
            })
        default:
            return state;
    }
}
