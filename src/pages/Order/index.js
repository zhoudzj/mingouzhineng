import React, {useState, useEffect, useReducer,memo,useMemo} from 'react';
import {Switch, Route, Link, useRouteMatch, useHistory} from 'react-router-dom';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import {Tabs, Radio, Cascader} from 'antd';
import styles from "./index.css";
import Combo from "@/components/Combo";
import OrderDetail from "@/pages/OrderDetail";
import HouseHeader from "@/components/HouseHeader";
import {getCombo, getRoomList} from '@/config/api';

const {TabPane} = Tabs;
const Order = ({communityId}) => {
  const match = useRouteMatch();
  const [options,
    setOptions] = useState([]);
  const [roomData,setRoomData] = useState([]);
  useEffect(() => {
    const fetchData = async() => {
      const data = await getRoomList({communityId});
      const options = haddleData(data);
      setOptions(options)
    }
    console.log(options);
    fetchData();
    const haddleData = (data) => {
      var container = {};
      data.forEach(item => {
        container[item.building] = container[item.building] || [];
        container[item.building].push(item);
      });
      Object
        .keys(container)
        .forEach((key) => {
          const unitArr = container[key];
          var unitContainer = {};
          unitArr.forEach(item => {
            unitContainer[item.unit] = unitContainer[item.unit] || [];
            unitContainer[item.unit].push({value:String(item.room),label:item.room+'室'});
          });
          const newUnitArr = Object.values(unitContainer).map((arr,index)=>{
            return {value:(Object.keys(unitContainer))[index],label:(Object.keys(unitContainer))[index]+'单元',children:arr}
          });
          container[key] = newUnitArr
        })
        const result = Object.values(container).map((arr,index)=>{
          return {value:(Object.keys(container))[index],label:(Object.keys(container))[index]+'幢',children:arr}
        });
        console.log(result);
      return result
    }
  }, []);
  const onChange = (value) => {
    setRoomData(value);
  }
  return (
    <CacheSwitch>
      <Route path={`${match.path}/:styleId`}>
        <OrderDetail/>
      </Route>
      <CacheRoute path={`${match.path}`} exact>
        <HouseHeader title={"智能选装"}/>
        <div className={styles.order_wrap}>
          <div className={styles.table_wrap}>
            <div className={styles.room_style}>户型</div>
            <div className={styles.rec_style}>推荐套餐</div>
          </div>
          <div className={styles.order_right}>
          <Cascader options={options} onChange={onChange} placeholder="请选择房间"/>
          <Combo roomData={roomData}/>
          </div>
        </div>
      </CacheRoute>
    </CacheSwitch>
  )
}

export default Order