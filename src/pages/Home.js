import React, {useState, useEffect, useReducer, createContext,useCallback,memo} from 'react';
import {Switch, Route, Link, useRouteMatch, useHistory} from 'react-router-dom';
import Header from '@/components/Header';
import House from '@/components/House';
import styles from "@/assets/css/home.css";
import Order from '@pages/Order';
import {Context} from '@/context-manager';

const MemoHouse = memo(House);
const HouseInfos = [
    {
        url: require('@/assets/img/lanseqianjiang.png'),
        title: '春月锦庐'
    }
];

const initialState = {
    headerTitle: '项目选择',
    testObj: null
}

const reducer = (state, action) => {
    switch (action.type) {
        case "CHANGE_HEAD":
            return {
                ...state,
                testObj: action.payload
            }
        default:
            return state;
    }
}

const Home = () => {
    const [state,
        dispatch] = useReducer(reducer, initialState);
    const [comunityName,setComunityName] = useState('');  
    const {headerTitle, testObj} = state

    const match = useRouteMatch();

    const houseClickHandle = useCallback(value => {
        setComunityName(value);
    },[comunityName])

    useEffect(() => {
        return () => {};
    }, []);

    return (
        <Switch>
            <Route path={`${match.path}/:houseId`}>
                <Context.Provider value={comunityName}>
                    <Order communityId={1}/>
                </Context.Provider>
            </Route>
            <Route path={match.path}>
                <Header text={headerTitle}/>
                <div className={styles.g_house_wrap}>
                    {HouseInfos.map((info, index) => (<MemoHouse houseClickHandle={houseClickHandle} title={info.title} url={info.url} key={index} houseId={100 + index}/>))
}
                </div>
            </Route>
        </Switch>
    )
}

export default Home