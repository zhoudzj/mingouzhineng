import React, {useState, useEffect, useReducer, memo, useMemo, useCallback,useRef} from 'react';
import {Switch, Route, Link, useRouteMatch, useHistory} from 'react-router-dom';
import styles from "./index.scss";
import Header from '@/components/Header';
import {
  Table,
  Button,
  Modal,
  List,
  Pagination,
  Input,
  message,
  Space
} from 'antd';
import {getOrderList,getOrderListDetail,removeOrder} from '@/config/api';
import {connect} from 'react-redux';
import MyDetail from './detail';
import moment from 'moment';

const MemoTable = memo(Table);
const MemoMyDetail= memo(MyDetail);
const My = ({userInfo}) => {

  const [tableData,
    setTableData] = useState([]);
  const [isShow,setIsShow] = useState(false);
  const [orderItem,setOrderItem] = useState({});
  const [state,setState] = useState({loading:false,pagination:false,bordered:false});

  const goDetail = async (record) => {
    setIsShow(true);
    setOrderItem(record);
  };

  const deleteOrder = async (record) => {
    setState({...state,loading:true})
    await removeOrder({orderId:String(record.id)});
    const rawData = await getOrderList();
        setState({...state,loading:false})
    setTableData(rawData);
  };

  const handleCancel = useCallback(() => {
    setIsShow(false)
  },[isShow]);
  
  const columns = useMemo(()=>[
    {
      title: '楼盘名称',
      dataIndex: 'project_name',
      width: '150px',
      // textWrap: 'word-break',
      ellipsis: true,
    },{
      title: '户型',
      dataIndex: 'style_name',
      width: '100px'
    },
    {
      title: '房间号',
      dataIndex: 'house_num',
      width: '120px'
    },
    {
      title: '户主名',
      dataIndex: 'master_name',
      width: '120px'
    },{
      title: '销售名',
      dataIndex: 'sales_name',
      width: '120px'
    },{
      title: '创建时间',
      dataIndex: 'create_time',
      render: (text) => (moment(text).format('YYYY-MM-DD HH:mm:ss'))
    },
    {
      title: '操作',
      key: 'action',
      width: '100px',
      render: (text,record) => (
        <div>
        <Space size="middle"><a onClick={()=>goDetail(record)}>详情</a></Space>
        |<Space size="middle"><a onClick={()=>deleteOrder(record)}>删除</a></Space>
        </div>
      )
    }
  ],[]);

    useEffect(() => {
    const fetchData = async () => {
      const rawData = await getOrderList();
      setTableData(rawData);
    }
    fetchData();
    return () => {
    }
  }, []);

  return (
    <div>
      <Header text={'我的订单'} home={'首页'}/>
      <MemoTable columns={columns}
          dataSource={tableData}
          rowKey='id'
          {...state}/>
       <MemoMyDetail isShow={isShow} orderItem={orderItem} handleCancel={handleCancel} />   
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    ...state.user
  }
}
export default connect(mapStateToProps)(My)
