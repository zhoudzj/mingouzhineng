import React, {useState, useEffect, useReducer, memo, useMemo,useCallback,forwardRef,useRef} from 'react';
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
  Space,
  Descriptions
} from 'antd';
import {getOrderListDetail,createPdf} from '@/config/api';
import xlsx from 'xlsx';
import html2canvas from 'html2canvas';
import jsPdf from 'jspdf'

const MyDetail = ({isShow,orderItem,handleCancel})=>{

  const [tableData,
    setTableData] = useState([]);
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
      dataIndex:'itemColor',
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

  const fetchPdf = async() => {
    const blob = await createPdf({url:window.location.href});
    console.log(blob);
    const url = window.URL.createObjectURL(blob);
    console.log(url);
    window.open(url);
    window.URL.revokeObjectURL(url);
  }
  const getPdf = () => {
    const domElement = document.getElementsByClassName('ant-modal-body');
    html2canvas(domElement[0]).then((canvas)=>{
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;

        const img = canvas.toDataURL('image/jpeg');
        
        var imgWidth = 595.28;
        var imgHeight = 592.28/contentWidth * contentHeight;
        const pdf = new jsPdf('', 'pt', 'a4');
        pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight)
        pdf.save(`${orderItem.project_name}${orderItem.house_num}.pdf`)
    })
  }

  
  useEffect(() => {
    const fetchData = async () => {
      const rawData = await getOrderListDetail({orderId:String(orderItem.id)});
      setTableData(rawData);
    }
    if(isShow){
      fetchData();
    }
    return () => {
    }
  }, [isShow]);

  const callbackHandler = useCallback(() => {
    let totalPrice = 0;
    for(const item of tableData){
      totalPrice += (Number(item.price) * item.number);
    }
    return (<><tr><th></th><td></td><td></td><td></td><td></td><td>{`总价:${totalPrice}`}</td></tr></>)
  },[tableData]);

  return (
    <Modal width={1000}
          title="订单详情"
          visible={isShow}
          onCancel={handleCancel}
          footer={<><Button type="primary" onClick={getPdf}>导出pdf</Button></>}>
        <Descriptions>
          <Descriptions.Item label="项目名称">{orderItem.project_name}</Descriptions.Item>
          <Descriptions.Item label="房号">{orderItem.house_num}</Descriptions.Item>
          <Descriptions.Item label="户型">{orderItem.style_name}</Descriptions.Item>
          <Descriptions.Item label="销售名称">{orderItem.sales_name}</Descriptions.Item>
          <Descriptions.Item label="姓名">{orderItem.master_name}</Descriptions.Item>
        </Descriptions>
        <Table size="small" columns={columns} dataSource={tableData} rowKey='id' pagination={false} summary={callbackHandler}/>
    </Modal>
  )
};

export default MyDetail