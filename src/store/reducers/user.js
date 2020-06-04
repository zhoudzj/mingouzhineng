import {ADD_TOKEN,SET_USERINFO,REMOVE_TOKEN} from '../actions/user'
import history from '../../history'
let userInfo = localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):null;
let token = localStorage.getItem('token')?localStorage.getItem('token'):'';
const initState = {
    token,
    userInfo
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
            const userInfo = action.payload.userInfo;
            localStorage.setItem("userInfo",JSON.stringify(userInfo));
            return Object.assign({},state,{
                userInfo
            })
        case REMOVE_TOKEN:
            localStorage.removeItem("token");
            history.push('/login');
            return Object.assign({},state,{
                token:''
            })
        default:
            return state;
    }
}
