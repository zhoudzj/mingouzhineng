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
  Space
} from 'antd';
import {getOrderListDetail,createPdf} from '@/config/api';
import xlsx from 'xlsx';
import html2canvas from 'html2canvas'
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

  // const getPdf = async() => {
  //   const blob = await createPdf({url:window.location.href});
  //   console.log(blob);
  //   const url = window.URL.createObjectURL(blob);
  //   console.log(url);
  //   window.open(url);
  //   window.URL.revokeObjectURL(url);
  // }
  const getPdf = () => {
    const domElement = document.getElementById('tab');
    html2canvas(domElement).then((canvas)=>{
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
      console.log(rawData);
      setTableData(rawData);
    }
    if(isShow){
      fetchData();
    }
    return () => {
    }
  }, [isShow]);

  const submit = useCallback(() => {
    let totalPrice = 0;
    let arr = tableData.map((item, index) => {
      totalPrice += item.price*item.number;
      return {
          '产品名称': item.name,
          '颜色': getColor(item.color),
          '价格': item.price,
          '数量': item.number
        }
    });
    const topHeader = {
      A1:{t:'s',v:'项目名称'},
      B1:{t:'s',v:`${orderItem.project_name}`},
      A2:{t:'s',v:`销售姓名:${orderItem.sales_name}`},
      B2:{t:'s',v:`姓名:${orderItem.master_name}`},
      C2:{t:'s',v:`房号:${orderItem.house_num}`},
      D2:{t:'s',v:`户型:${orderItem.style_name}`},
      A3:{t:'s',v:`总价:${totalPrice}`},
      B3:{t:'s',v:`元`}
    }
    const _headers = ['产品名称','颜色','价格','数量']
    let headers = _headers.map((v,i)=>Object.assign({},{v:v,t:'s',position:String.fromCharCode(65+i)+4})).reduce((prev,next) => Object.assign({},prev,{[next.position]:{v:next.v,t:next.t}}),{});
    let data = arr.map((v,i)=>_headers.map((k,j)=>{ let type = '';if(k==='产品名称'||k==='颜色'){type='s'}else{type='n'}  return Object.assign({},{v:v[k],t:type,position:String.fromCharCode(65+j)+(i+5)}) })).reduce((prev,next)=>prev.concat(next)).reduce((prev,next)=>Object.assign({},prev,{[next.position]:{v:next.v,t:next.t}}),{});
    let output = Object.assign({},topHeader,headers,data);

    let outputPos = Object.keys(output);
    let ref = outputPos[0]+':'+outputPos[outputPos.length-1];

    let book = xlsx
        .utils
        .book_new();

    xlsx
      .utils
      .book_append_sheet(book, Object.assign({},output,{'!ref':ref}), "sheet1");
    xlsx.writeFile(book, `user${new Date().getTime()}.xls`);

  },[tableData])

  const callbackHandler = useCallback((pageData) => {
    return (<><tr><td><Button onClick={getPdf}>导出pdf</Button></td></tr></>)
  }, [tableData]);
  return (
    <Modal width={1000}
          title="订单详情"
          visible={isShow}
          onCancel={handleCancel}
          footer={null}>
      <Table id="tab" size="small" columns={columns} dataSource={tableData} rowKey='id' summary={callbackHandler} pagination={false}/>
    </Modal>
  )
};

export default MyDetail