import React, {useState, useEffect, useReducer} from 'react';
import {Switch, Route, Link, useRouteMatch, useParams} from 'react-router-dom'
import {Table, Form, Button} from 'antd';
import HouseHeader from "@/components/HouseHeader";
import styles from "./index.css";
import {getProductByGroup} from '@/config/api';
import errorImg from '@/assets/img/inner.jpg'
const pictureDomian = process.env.REACT_APP_PICTURE_DOMAIN

const DeviceDetail = () => {
    const match = useRouteMatch();

  const [devName,
    setDevName] = useState('')
  const [tableData,
    setTableData] = useState([]);
  let {typeId} = useParams();

  useEffect(() => {
    console.log(typeId);
    const fetchData = async() => {
      const rawData = await getProductByGroup({typeId:Number(typeId)});
      const handdleRawItem = (groupId,rawData,item)=>{
            const arr =  rawData.filter(value=>value.groupId===groupId);
            item.totalPrice = 0;
             item.length = arr.length;
             arr.forEach(elem => {
                item.totalPrice += Number(elem.price);
              })
    };
      rawData.forEach(item => {
        if(item.groupId===1&&item.childId===1){
             handdleRawItem(1,rawData,item);
        }else if(item.groupId===2&&item.childId===1){
             handdleRawItem(2,rawData,item);
        }else if(item.groupId===3&&item.childId===1){
             handdleRawItem(3,rawData,item);
        }
      })
      setTableData(rawData);
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
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    renderCell: (checked, record, index, originNode) => {
      if (index % 2 === 0) {
        return originNode
      }
    }
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
        summary={(pageData) => {
          let totalCount = 0;
          pageData.forEach(({totalPrice}) => {
            if(totalPrice)totalCount += totalPrice;
          });
          return (<><tr><th></th><td></td><td></td><td><Button style={{
                float: "right"
              }}>确定</Button></td></tr></>)
        }}
        />
    </div>
  )
}

export default DeviceDetail