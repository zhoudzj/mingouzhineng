import React, {useState, useEffect, useReducer, memo, useMemo} from 'react';
import {Switch, Route, Link, useRouteMatch, useHistory} from 'react-router-dom';
import styles from "./detail.scss";
import {
  Table,
  Button,
  Modal,
  Form,
  Pagination,
  Input,
  message,
  Space
} from 'antd';
import {getOrderListDetail} from '@/config/api';

const OrderDetail = ({isShow,orderId,handleCancel})=>{

  const [tableData,
    setTableData] = useState([]);
    console.log('走了')
    const getColor = (index) => {
    if(index===1){
      return '雪花银'
    }else if(index===2){
      return '香槟金'
    }else if(index===3){
      return '云母黑'
    }
  }
  const columns = useMemo(()=>[
    {
      title:'名称',
      dataIndex:'name'
    },
    {
      title: '品牌',
      dataIndex: 'brand'
    },
    {
      title:'类型',
      dataIndex: 'type'
    },
    {
      title:'模式',
      dataIndex: 'model'
    },
    {
      title:'颜色',
      dataIndex:'color',
      render: (value, row, index) => {
        return (<span>{getColor(value)}</span>)
      }
    },
    {
      title: '价格',
      dataIndex: 'price'
    },
    {
      title: '数量',
      dataIndex: 'number'
    },
    {
      title: '单位',
      dataIndex: 'unit'
    }
  ],[])
  
  useEffect(() => {
    const fetchData = async () => {
      const rawData = await getOrderListDetail({orderId});
      console.log(rawData);
      setTableData(rawData);
    }
    if(isShow){
      fetchData();
    }
    return () => {
    }
  }, [isShow]);
  return (
    <Modal width={1000}
          title="订单详情"
          visible={isShow}
          onCancel={handleCancel}
          footer={null}>
      <Table columns={columns} dataSource={tableData} rowKey='id'/>
    </Modal>
  )
}

export default OrderDetail