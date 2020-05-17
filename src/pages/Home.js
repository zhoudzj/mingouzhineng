import React, { useState, useEffect, useReducer }  from 'react';
import { Switch, Route, Link, useRouteMatch, useHistory } from 'react-router-dom'
import Header from '../components/Header';
import House from '../components/House'
import SelectItem from './SelectItem'
import styles from "../assets/css/home.css"

const HouseInfos = [{ url: require('../assets/img/lanseqianjiang.png'), title: '春月锦庐' }]

const initialState = {
  headerTitle: '选择项目',
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
            console.log(match);
        };
    },[]);

    return (
        <Switch>
            <Route path={`${match.path}/:houseId`}>
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