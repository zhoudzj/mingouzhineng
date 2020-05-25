import {ADD_TOKEN,SET_USERINFO} from '../actions/user'

const initState = {
    token: '',
    userInfo: null
}

export default (state = initState,action) =>{
    switch (action.type) {
        case ADD_TOKEN:
            const token = action.payload.token;
            localStorage.setItem("token",token)
            return Object.assign({},state,{
                token
            })
        case SET_USERINFO:
            return Object.assign({},state,{
                userInfo:action.payload.userInfo
            })
        default:
            return state
    }
}
