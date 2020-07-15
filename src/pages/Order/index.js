import React, {useState, useEffect, useReducer} from 'react';
import {Switch, Route, Link, useRouteMatch, useHistory} from 'react-router-dom'
import {Tabs, Radio, Cascader} from 'antd';
import styles from "./index.css";
import Combo from "@/components/Combo";
import OrderDetail from "@/pages/OrderDetail"
import HouseHeader from "@/components/HouseHeader"
import {getCombo, getRoomList} from '@/config/api'

const {TabPane} = Tabs;

const Order = ({communityId}) => {
  const match = useRouteMatch();
  const [options,
    setOptions] = useState([]);
  const [rooms,
    setRooms] = useState([]);
  useEffect(() => {
    const fetchData = async() => {
      const data = await getRoomList({communityId});
      const options = haddleData(data, 'unit', 'building');
      console.log(options)
      setOptions(options)
    }
    fetchData();
    const haddleData = (data, id, pid) => {
      const result = [];
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        let buildingObj = {};
        let unitObj = {};
        let roomObj = {};
        var rawObj = data[i];
        for (var j in rawObj) {
          if(j === 'building'){
              rawObj[j] = buildingObj['value'];
              rawObj[j] = buildingObj['label'];
          }else if(j === 'unit'){
              rawObj[j] = unitObj['value'];
              rawObj[j] = unitObj['label'];
              buildingObj.children.push(unitObj);
          }else if(j === 'room'){
              rawObj[j] = roomObj['value'];
              rawObj[j] = roomObj['label'];
              unitObj.children.push(roomObj);
          }
        }
        result.push(buildingObj);
      }
      console.log(result);
      // for (var j in obj) {   //当前元素   var current = obj[j];   //当前元素的父元素   var
      // currentParent = obj[current[pid]];   //如果当前元素存在父元素   if (currentParent) {
      // //如果当前元素的父元素没有children键     if (!currentParent['children']) {
      // currentParent['children'] = [];     }
      // currentParent['children'].push(current);   } else {     result.push(current);
      //   } }
      return result
    }

  }, []);
  const onChange = (value) => {
    console.log(value);
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
          <Cascader options={options} onChange={onChange} placeholder="Please select"/> {/*{roomArray.map(i => (
                <Combo key={i.typeId} getCombo={getCombo} typeId={i.typeId}/>
            ))}*/}
        </div>
      </Route>
    </Switch>
  )
}

export default Order