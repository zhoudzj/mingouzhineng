import React, { useState, useEffect, useReducer }  from 'react';
import { Switch, Route, Link, useRouteMatch, useHistory } from 'react-router-dom'
import Header from '../components/Header';
import House from '../components/House'
import SelectItem from './SelectItem'
import styles from "../assets/css/home.css"

const HouseInfos = [{ url: require('../assets/img/lanseqianjiang.png'), title: '蓝色钱江' }, { url: require('../assets/img/liuyuan.png'), title: '留香园' }, { url: require('../assets/img/zhineng.svg'), title: '智能小镇' }]

const initialState = {
  headerTitle: '选择案场',
  testObj:null
}

const reducer = (state, action) => {
    switch(action.type){
        case "CHANGE_HEAD":
            return {
                ...state,
                testObj:action.payload
            }
        default:
            return state;
    }
}

const Home = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const { headerTitle, testObj } = state

    const match = useRouteMatch();

    useEffect(() => {
        return () => {

        };
    },[]);

    return (
        <Switch>
            <Route path={`${match.path}:houseId`}>
                <SelectItem />
            </Route>
            <Route path={match.path}>
            <Header text={headerTitle} />
            <div className={styles.g_house_wrap}>
                {
                    HouseInfos.map((info, index) => (
                        <House title={info.title} url={info.url} key={index} houseId={100+index}/>
                    ))
                }
            </div>
            </Route>
        </Switch>
    )
}

export default Home