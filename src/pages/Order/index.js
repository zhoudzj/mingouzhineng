import React, {useState, useEffect, useReducer} from 'react';
import {Switch, Route, Link, useRouteMatch, useHistory} from 'react-router-dom'
import {Tabs, Radio, Cascader} from 'antd';
import styles from "./index.css";
import Combo from "@/components/Combo";
import OrderDetail from "@/pages/OrderDetail"
import HouseHeader from "@/components/HouseHeader"
import {getCombo,getRoomList} from '@/config/api'

const {TabPane} = Tabs;

const Order = ({communityId}) => {
  const match = useRouteMatch();
  const [options,setOptions] = useState([]);
  const [rooms,setRooms] = useState([]);
  useEffect(()=>{
    const data = getRoomList(communityId);
    setOptions(data)
  },[]);
  const onChange = (value) => {
    console.log(value);
  }
  return (
    <Switch>
      <Route path={`${match.path}/:styleId`} >
        <OrderDetail/>
      </Route>
      <Route path={`${match.path}`} exact>
        <HouseHeader title={"智能选装"}/>
        <div className={styles.order_wrap}>
          <div className={styles.table_wrap}>
            <span className={styles.room_style}>户型</span>
            <span className={styles.rec_style}>推荐套餐</span>
          </div>
          <Cascader options={options} onChange={onChange} placeholder="Please select"/>

            {/*{roomArray.map(i => (
                <Combo key={i.typeId} getCombo={getCombo} typeId={i.typeId}/>
            ))}*/}
        </div>
      </Route>
    </Switch>
  )
}

export default Order