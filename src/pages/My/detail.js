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

  const columns = useMemo(()=>[
    {
      title:'名称',
      dataIndex:'name'
    },
    {
      title:'类型',
      dataIndex: 'type'
    },
    {
      title: '价格',
      dataIndex: 'price'
    },
    {
      title: '数量',
      dataIndex: 'number'
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