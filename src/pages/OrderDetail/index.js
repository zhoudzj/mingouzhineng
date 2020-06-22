import React, {useState, useEffect, useReducer} from 'react';
import {Switch, Route, Link, useRouteMatch,useHistory} from 'react-router-dom'
import {Table, Button, Typography} from 'antd';
import HouseHeader from "@/components/HouseHeader";
import styles from "./index.css";
import DeviceDetail from "@pages/DeviceDetail/";
import {getProductList} from '@/config/api';
import errorImg from '@/assets/img/inner.jpg'

const pictureDomian = process.env.REACT_APP_PICTURE_DOMAIN

const {Text} = Typography;

const OrderDetail = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const [count,setCount] = useState(0);
  const [tableData,
    setTableData] = useState([]);

  const changeTableData = (optionalData) => {
    const newData = tableData;
    const findedIndex = newData.findIndex(e=>optionalData[0].typeId === e.typeId);
    newData.splice(findedIndex,optionalData.length,...optionalData);
    setTableData(newData)
  }  

  const columns = [
    {
      title: '设备名称',
      dataIndex: 'type',
      width: '120px',
      // textWrap: 'word-break',
      ellipsis: true,
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {}
        };
        if('length'in row) {
          obj.props.rowSpan = row.length;
          return obj;
        } else {
          obj.props.rowSpan = 0;
          return obj
        }
      }
    }, {
      title: '图片',
      dataIndex: 'img',
      width: '180px',
      ellipsis: true,
      render: (value, row, index) => {
        const obj = {
          children: value ?<img className={styles.g_img} src={pictureDomian+value}/>:<img className={styles.g_img} src={errorImg}/>,
          props: {}
        };
        if('length'in row) {
          obj.props.rowSpan = row.length;
          return obj;
        } else {
          obj.props.rowSpan = 0;
          return obj
        }
      }
    }, {
      title: '描述',
      dataIndex: 'description',
      width: '350px',
      ellipsis: true,
      render: (value, row, index) => {
        const obj = {
          children: <span className={styles.g_text}>{value}</span>,
          props: {}
        };
        if('length'in row) {
          obj.props.rowSpan = row.length;
          return obj;
        } else {
          obj.props.rowSpan = 0;
          return obj
        }
      }
    }, {
      title: '数量',
      dataIndex: 'number',
      width: '250px',
      ellipsis: true,
      render: (value, row, index) => {
        const obj = {
          children: (<div>
           {(row.typeId === 4) && (row.childId === 1)
            ? (
              <div style={{
                float: "right"
              }}>
                <Link to={`${match.url}/${row.typeId}`}>
                  <Button>更改</Button>
                </Link>
              </div>
            )
            : ""}
          <span>
            <span
              style={{
              textAlign: 'center',
              margin: '10px'
            }}>{row.totalNumber}</span>
          </span>
          <span
            style={{
            marginLeft: '20px',
            color: 'red'
          }}>{`￥${row.totalPrice}`}</span>
        </div>),
          props:{}
        };
        if('length'in row) {
          obj.props.rowSpan = row.length;
          return obj;
        } else {
          obj.props.rowSpan = 0;
          return obj
        }        
      }
    }
  ];
  
  useEffect(() => {
    console.log(match);
    const handdleRawItem = (typeId,rawData,item)=>{
            const arr =  rawData.filter(value=>value.typeId===typeId);
             item.length = arr.length;
             item.totalNumber = 0;
             item.totalPrice = 0;
             arr.forEach(elem => {
                item.totalNumber += elem.number;
                item.totalPrice += (elem.price * elem.number)
              })
    };

    const fetchData = async() => {
      const rawData = await getProductList({id:match.params.styleId});
      rawData.forEach(item => {
        if(item.typeId===3&&item.childId===1){
             handdleRawItem(3,rawData,item);
        }else if(item.typeId===4&&item.childId===1){
             handdleRawItem(4,rawData,item);
        }else if(item.typeId===5&&item.childId===1){
             handdleRawItem(5,rawData,item);
        }else if(item.typeId===7&&item.childId===1){
             handdleRawItem(7,rawData,item);
        }else if(item.typeId===9&&item.childId===1){
             handdleRawItem(9,rawData,item);
        }
      })
      setTableData(rawData);
    }
    fetchData();
    return ()=>{
      console.log('卸载od');
    }
  }, [count]);

  return (
    <Switch>
      <Route path={`${match.path}/:typeId`}>
        <DeviceDetail changeTableData={changeTableData}/>
      </Route>
      <Route path={`${match.path}`} exact>
        <HouseHeader title={"选择推荐"}/>
        <Table
          columns={columns}
          dataSource={tableData}
          rowKey='id'
          pagination={false}
          bordered
          summary={(pageData) => {
          let totalCount = 0;
          pageData.forEach(({totalPrice}) => {
            if(totalPrice)totalCount += totalPrice;
          });
          return (<><tr><th></th><td></td><td></td><td>总价:<Text type="danger">￥{totalCount}</Text><Button style={{
                float: "right"
              }}>提交</Button></td></tr></>)
        }}/>
      </Route>
    </Switch>
  )
}

export default OrderDetail