import React, {useState, useEffect, useReducer,memo,useMemo} from 'react';
import {Switch, Route, Link, useRouteMatch, useHistory} from 'react-router-dom';
import {Tabs, Radio, Cascader} from 'antd';
import styles from "./index.css";
import Combo from "@/components/Combo";
import OrderDetail from "@/pages/OrderDetail";
import HouseHeader from "@/components/HouseHeader";
import {getCombo, getRoomList} from '@/config/api';

const {TabPane} = Tabs;
const ChildCombo = memo(Combo);
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
    console.log(value);
    setRoomData(value);
  }
  return (
    <Switch>
      <Route path={`${match.path}/:styleId`}>
        <OrderDetail/>
      </Route>
      <Route path={`${match.path}`} exact>
        <HouseHeader title={"智能选装"}/>
        <div className={styles.order_wrap}>
          <div className={styles.table_wrap}>
            <span className={styles.room_style}>户型</span>
            <span className={styles.rec_style}>推荐套餐</span>
          </div>
          <div>
          <Cascader options={options} onChange={onChange} placeholder="请选择房间"/>
          <ChildCombo roomData={useMemo(()=>roomData,[roomData])}/>
          </div>
        </div>
      </Route>
    </Switch>
  )
}

export default Order