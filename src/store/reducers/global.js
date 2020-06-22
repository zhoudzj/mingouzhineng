import {CHANGE_NETWORK} from '@/store/actions/global'

const initState = {
    network: true,
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