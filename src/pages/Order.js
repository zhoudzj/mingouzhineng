import React, {useState, useEffect, useReducer} from 'react';
import {Switch, Route, Link, useRouteMatch, useHistory} from 'react-router-dom'
import {Tabs, Radio} from 'antd';
import styles from "../assets/css/order.css";
import Combo from "../components/Combo";
import OrderDetail from "./OrderDetail"
import HouseHeader from "../components/HouseHeader"

const {TabPane} = Tabs;

const Order = () => {
  const match = useRouteMatch();
  const [mode,
    setMode] = useState('left');
  const [roomArray] = useState(['三室两厅', '两室一厅', '三室一厅']);
  return (
    <Switch>
      <Route path={`${match.path}/:index`}>
        <OrderDetail/>
      </Route>
      <Route path={`${match.path}`}>
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
              <TabPane tab={i} key={i}>
                <Combo key={i}/>
              </TabPane>
            ))}
          </Tabs>
        </div>
      </Route>
    </Switch>
  )
}

export default Order