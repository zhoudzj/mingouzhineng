import {CHANGE_NETWORK} from '../actions/global'

const initState = {
    network: false,
}

export default (state = initState,action) =>{
    switch (action.type) {
        case CHANGE_NETWORK:
            return Object.assign({},state,{
                network:action.payload.network
            })
        default:
            return state
    }
}