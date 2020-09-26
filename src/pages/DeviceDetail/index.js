import React, {useState, useEffect, useReducer} from 'react';
import {Switch, Route, Link, useRouteMatch, useParams, useHistory} from 'react-router-dom'
import {Table, Form, Button,Select,message} from 'antd';
import HouseHeader from "@/components/HouseHeader";
import styles from "./index.css";
import {getProductByType} from '@/config/api';
import errorImg from '@/assets/img/inner.jpg';
const pictureDomian = process.env.REACT_APP_PICTURE_DOMAIN

const { Option } = Select;

const PRODUCT_PANEL_TYPEID = 4;
const PRODUCT_SOCKET_TYPEID = 5;
const GROUP_IDS = {
  FIRST:1,
  SECOND:2,
  THIRD:3,
  FOUR:4
}
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
          typeIds.push(PRODUCT_SOCKET_TYPEID);
        }
      const rawData = await getProductByType({typeIds});
      const pannelArr = rawData.filter(i=>i.typeId===PRODUCT_PANEL_TYPEID);  
      const socketArr = rawData.filter(i=>i.typeId===PRODUCT_SOCKET_TYPEID);
      const handdleRawItem = (groupId,pannelArr,item)=>{
            const arr =  pannelArr.filter(value=>value.groupId===groupId);
            item.totalPrice = 0;
             item.length = arr.length;
             arr.forEach(elem => {
                item.totalPrice += Number(elem.price);
              })
      };
      pannelArr.forEach(item => {
        if(item.groupId===GROUP_IDS.FIRST&&item.childId===1){
             handdleRawItem(GROUP_IDS.FIRST,pannelArr,item);
        }else if(item.groupId===GROUP_IDS.SECOND&&item.childId===1){
             handdleRawItem(GROUP_IDS.SECOND,pannelArr,item);
        }else if(item.groupId===GROUP_IDS.THIRD&&item.childId===1){
             handdleRawItem(GROUP_IDS.THIRD,pannelArr,item);
        }else if(item.groupId===GROUP_IDS.FOUR&&item.childId===1){
             handdleRawItem(GROUP_IDS.FOUR,pannelArr,item);
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
      console.log(selectedSockets);
      setSelectedData(selectedData);
      setSelectedSockets(selectedSockets);
    },
    renderCell: (checked, record, index, originNode) => {
      console.log(record)
      if (record.childId === 1) {
        return originNode
      }else {
        const obj = {props:{}};
        obj.props.rowSpan = 0;
        return obj
      }
    },      
  }
  const handleChange = (row,e)=>{
    row.color = e;
    tableData.forEach(item=>{
      if(item.groupId===row.groupId){
        item.color = row.color;
      }
    })
    socketData.forEach(item=>{
      if(item.groupId===row.groupId){
        item.color = row.color;      
      }
    })
    setTableData([...tableData]);
    setSocketData([...socketData]);
  }
  const haddleGoBack = ()=>{
    if(selectedData.length===0&&selectedSockets.length===0){
      message.error({
        content: '请选择一项',
        duration: 1.5,
    })
      return
    }
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
        let pictureUrl = '';
        if(row.typeId===PRODUCT_PANEL_TYPEID||row.typeId===PRODUCT_SOCKET_TYPEID){
          pictureUrl = pictureDomian + value+'/'+ row.color +'.png';
        } else {
          pictureUrl = pictureDomian + value;
        }
        const obj = {
          children: value ?<img className={styles.g_img} src={pictureUrl}/>:<img className={styles.g_img} src={errorImg}/>,
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
      title: '颜色',
      dataIndex: 'color',
      width:'200px',
      ellipsis: true,
      render: (text, row, index) => {
        const obj = {
          children: <Select defaultValue={1} style={{ width: 120 }} onChange={handleChange.bind(this,row)}>
            <Option value={1}>雪花银</Option>
            <Option value={2}>香槟金</Option>
            <Option value={3}>云母黑</Option>
          </Select>,
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
    },{
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