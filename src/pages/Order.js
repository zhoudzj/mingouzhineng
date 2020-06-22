import React, {useState, useEffect, useReducer} from 'react';
import {Switch, Route, Link, useRouteMatch, useHistory} from 'react-router-dom'
import {Tabs, Radio} from 'antd';
import styles from "@/assets/css/order.css";
import Combo from "@/components/Combo";
import OrderDetail from "./OrderDetail/"
import HouseHeader from "@/components/HouseHeader"
import {getCombo} from '@/config/api'

const {TabPane} = Tabs;

const Order = () => {
  const match = useRouteMatch();
  const [mode,
    setMode] = useState('left');
  const [roomArray] = useState([{typeId:10,name:'A户型'}, {typeId:22,name:'B2户型'}, {typeId:31,name:'C1户型'},{typeId:32,name:'C2户型'},{typeId:50,name:'E户型'}]);
  useEffect(()=>{
  },[]);
  
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
          <Tabs
            defaultActiveKey="1"
            tabPosition={mode}
            >
            {roomArray.map(i => (
              <TabPane tab={i.name} key={i.typeId}>
                <Combo key={i.typeId} getCombo={getCombo} typeId={i.typeId}/>
              </TabPane>
            ))}
          </Tabs>
        </div>
      </Route>
    </Switch>
  )
}

export default Order