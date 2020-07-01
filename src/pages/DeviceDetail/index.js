import React, {useState, useEffect, useReducer} from 'react';
import {Switch, Route, Link, useRouteMatch, useParams, useHistory} from 'react-router-dom'
import {Table, Form, Button} from 'antd';
import HouseHeader from "@/components/HouseHeader";
import styles from "./index.css";
import {getProductByType} from '@/config/api';
import errorImg from '@/assets/img/inner.jpg'
const pictureDomian = process.env.REACT_APP_PICTURE_DOMAIN

const TYPEID_PANEL = 4;
const TYPEID_SOCKET = 5;

const DeviceDetail = ({changeTableData}) => {
    const match = useRouteMatch();
    const history = useHistory();
  const [devName,
    setDevName] = useState('')
  const [tableData,
    setTableData] = useState([]);
  const [socketData,setSocketData] = useState([]);  
  const [selectedData, setSelectedData] = useState([]);
  const [selectedSockets,setSelectedSockets] = useState([]);
  let {typeId,styleId,houseId} = useParams();
  useEffect(() => {
    const fetchData = async() => {
        const typeIds = [Number(typeId)]
        if(styleId.charAt(styleId.length-1)==='1'){
          typeIds.push(TYPEID_SOCKET);
        }
      const rawData = await getProductByType({typeIds});
      const pannelArr = rawData.filter(i=>i.typeId===TYPEID_PANEL);  
      const socketArr = rawData.filter(i=>i.typeId===TYPEID_SOCKET);
      const handdleRawItem = (groupId,pannelArr,item)=>{
            const arr =  pannelArr.filter(value=>value.groupId===groupId);
            item.totalPrice = 0;
             item.length = arr.length;
             arr.forEach(elem => {
                item.totalPrice += Number(elem.price);
              })
    };
      pannelArr.forEach(item => {
        if(item.groupId===1&&item.childId===1){
             handdleRawItem(1,pannelArr,item);
        }else if(item.groupId===2&&item.childId===1){
             handdleRawItem(2,pannelArr,item);
        }else if(item.groupId===3&&item.childId===1){
             handdleRawItem(3,pannelArr,item);
        }
      })
      setTableData(pannelArr);
      setSocketData(socketArr)
    };
    fetchData();

    if (typeId.split(':')[1] === '4') {
      setDevName('设备自定义');
    }
    return ()=>{
      console.log('卸载dd');
    }
  }, [])

  const [selectionType,
    setSelectionType] = useState('radio');

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      const groupId = selectedRows[0].groupId;
      const selectedData = tableData.filter((item)=>item.groupId === groupId);
      const selectedSockets = socketData.filter(item=>item.groupId === groupId);
      setSelectedData(selectedData);
      setSelectedSockets(selectedSockets);
    },
    renderCell: (checked, record, index, originNode) => {
      if (index % 2 === 0) {
        return originNode
      }else {
        const obj = {props:{}};
        obj.props.rowSpan = 0;
        return obj
      }
    },      
  }

  const haddleGoBack = ()=>{
    changeTableData(selectedData,selectedSockets);
    history.goBack();
  }
  const columns = [
    {
      title: '图片',
      dataIndex: 'img',
      width:'180px',
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
      title: '介绍',
      dataIndex: 'description',
      width:'400px',
      ellipsis: true,
      render: (value, row, index) => {
        const obj = {
          children: (<div className={styles.text_wrap}>{value}</div>),
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
      title: '单价',
      dataIndex: 'price',
      width:'200px',
      ellipsis: true,
      render: (text, row, index) => {
        const obj = {
          children: <span>{`￥${row.totalPrice}`}</span>,
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
    }
  ]

  return (
    <div>
      <HouseHeader title={devName}/>
      <Table
        rowKey="id"
        pagination={false}
        rowSelection={{
        type: selectionType,
        ...rowSelection
      }}
        columns={columns}
        dataSource={tableData}
        summary={() => {
          return (<><tr><th></th><td></td><td></td><td><Button style={{
                float: "right"
              }} onClick={haddleGoBack}>确定</Button></td></tr></>)
        }}
        />
    </div>
  )
}

export default DeviceDetail