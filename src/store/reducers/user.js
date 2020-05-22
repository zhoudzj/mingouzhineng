import {ADD_TOKEN,SET_USERINFO} from '../actions/user'

const initState = {
    token: '',
    userInfo: null
}

export default (state = initState,action) =>{
    switch (action.type) {
        case ADD_TOKEN:
            return Object.assign({},state,{
                token:action.payload.token
            })
        case SET_USERINFO:
            return Object.assign({},state,{
                userInfo:action.payload.userInfo
            })
        default:
            return state
    }
}
