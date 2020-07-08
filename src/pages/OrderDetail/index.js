import React, {useState, useEffect, useReducer} from 'react';
import {Switch, Route, Link, useRouteMatch, useHistory} from 'react-router-dom'
import {
  Table,
  Button,
  Typography,
  Modal,
  List,
  Form,
  Pagination,
  Input
} from 'antd';
import HouseHeader from "@/components/HouseHeader";
import styles from "./index.css";
import DeviceDetail from "@pages/DeviceDetail/";
import {getProductList,getDefaultProductList} from '@/config/api';
import errorImg from '@/assets/img/inner.jpg';

const pictureDomian = process.env.REACT_APP_PICTURE_DOMAIN

const {Text} = Typography;

const PRODUCT_MACHINE_TYPEID = 1;
const PRODUCT_MODLE_TYPEID = 2;
const PRODUCT_PANEL_TYPEID = 4;
const PRODUCT_SOCKET_TYPEID = 5;

const OrderDetail = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const [tableData,
    setTableData] = useState([]);
  const [previewList,setPreviewList] = useState([]); 
  const [visible,
    setVisible] = useState(false);
  const [current,setCurrent] = useState(1);
  const changeTableData = (optionalData, associationData) => {
    const rawData = tableData;
    if (associationData.length > 0) {
      const socketArr = rawData.filter(value => value.typeId === associationData[0].typeId);
      associationData[0].totalNumber = 0;
      associationData[0].totalPrice = 0;
      associationData[0].length = associationData.length;
      associationData.forEach(i => {
        socketArr.forEach(elem => {
          if (i.childId === elem.childId) {
            i.number = elem.number
          }
        })
        if(!isNaN(i.number)&&!isNaN(i.price)){
          associationData[0].totalNumber += i.number;
          associationData[0].totalPrice += i.number * Number(i.price);
        }
      })
      const findedAssoIndex = rawData.findIndex(e => associationData[0].typeId === e.typeId);
      rawData.splice(findedAssoIndex, socketArr.length, ...associationData);
    }
    const selectedArr = rawData.filter(value => value.typeId === optionalData[0].typeId);
    optionalData[0].totalNumber = 0;
    optionalData[0].totalPrice = 0;
    optionalData.forEach(i => {
      selectedArr.forEach(elem => {
        if (i.childId === elem.childId) {
          i.number = elem.number
        }
      })
      if(!isNaN(i.number)&&!isNaN(i.price)){
      optionalData[0].totalNumber += i.number;
      optionalData[0].totalPrice += i.number * Number(i.price);
      }
    });

    const findedIndex = rawData.findIndex(e => optionalData[0].typeId === e.typeId);
    rawData.splice(findedIndex, selectedArr.length, ...optionalData);

    setTableData(rawData)
  };

  const getColor = (index) => {
    if(index===1){
      return '雪花银'
    }else if(index===2){
      return '香槟金'
    }else if(index===3){
      return '云母黑'
    }
  }
  const onPageChange = page => {
    console.log(page);
    setCurrent(page)
  }
  const preView = async () => {
    const data = await getDefaultProductList({id: match.params.styleId});
    if(data&&data.length>0){
        const topArr = data.filter(e => (e.typeId === PRODUCT_MACHINE_TYPEID||e.typeId === PRODUCT_MODLE_TYPEID));
        const otherArr = data.filter(e => (e.typeId !== PRODUCT_MACHINE_TYPEID&&e.typeId !== PRODUCT_MODLE_TYPEID));
        setPreviewList([...topArr,...tableData,...otherArr]);
    }
    setVisible(true);
  };
  const handleOk = e => {
    setVisible(false);
  };
  const handleCancel = e => {
    setVisible(false);
  };
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
        if ('length' in row) {
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
        let pictureUrl = '';
        if(row.typeId===PRODUCT_PANEL_TYPEID||row.typeId===PRODUCT_SOCKET_TYPEID){
          pictureUrl = pictureDomian + value+'/'+ row.color +'.png';
        } else {
          pictureUrl = pictureDomian + value;
        }
        const obj = {
          children: value
            ? <img className={styles.g_img} src={pictureUrl}/>
            : <img className={styles.g_img} src={errorImg}/>,
          props: {}
        };
        if ('length' in row) {
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
        if ('length' in row) {
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
          children: (
            <div>
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
            </div>
          ),
          props: {}
        };
        if ('length' in row) {
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
    const handdleRawItem = (typeId, rawData, item) => {
      const arr = rawData.filter(value => value.typeId === typeId);
      item.length = arr.length;
      item.totalNumber = 0;
      item.totalPrice = 0;
      arr.forEach(elem => {
        item.totalNumber += elem.number;
        item.totalPrice += (elem.price * elem.number)
      })
    };
    const fetchData = async() => {
      const rawData = await getProductList({id: match.params.styleId});
      rawData.forEach(item => {
        if (item.typeId === 3 && item.childId === 1) {
          handdleRawItem(3, rawData, item);
        } else if (item.typeId === 4 && item.childId === 1) {
          handdleRawItem(4, rawData, item);
        } else if (item.typeId === 5 && item.childId === 11) {
          handdleRawItem(5, rawData, item);
        } else if (item.typeId === 7 && item.childId === 1) {
          handdleRawItem(7, rawData, item);
        } else if (item.typeId === 9 && item.childId === 1) {
          handdleRawItem(9, rawData, item);
        }
      })
      setTableData(rawData);
    }
    fetchData();
    return () => {
    }
  }, []);

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
            if (totalPrice) 
              totalCount += totalPrice;
            }
          );
          return ( <><tr><th></th><td></td><td></td><td> 总价 : <Text type="danger">￥{totalCount}</Text> < Button style = {{ float: "right" }}onClick = {
            preView
          } > 提交 < /Button></td></tr></>) }}/>
        <Modal
          width={800}
          title="订单预览"
          visible={visible}
          onCancel={handleCancel}
          footer={current===2?<Button key='submit' type="primary" onClick={handleOk}>提交</Button>:null}
          >
          {current===1?
          <List
            size="large"
            dataSource={previewList}
            renderItem={item => <List.Item key={item.id}>
            <div className = {styles.g_item_name}>{item.name}</div>
            <div className = {styles.g_item_item}>{getColor(item.color)}</div>
            <div className = {styles.g_item_item}>{`￥${item.price}`}</div>
            <div className = {styles.g_item_item}>{`数量${item.number}${item.unit}`}</div>
          </List.Item>}/>:null}
          <div>{current===2?
          (<Form>
            <Form.Item
            label="项目名称"
            name="项目名称">
              <Input />
            </Form.Item>
            <Form.Item
            label="户型"
            name="户型">
              <Input />
            </Form.Item>
            <Form.Item
            label="房号"
            name="房号">
              <Input />
            </Form.Item>
            <Form.Item
            label="销售姓名"
            name="销售姓名">
              <Input />
            </Form.Item>
            <Form.Item
            label="姓名"
            name="姓名">
              <Input />
            </Form.Item>
          </Form>):null}
          </div>
          <Pagination simple defaultCurrent={1} defaultPageSize={1} onChange={onPageChange} total={2} />
        </Modal>
      </Route>
    </Switch>
  )
}

export default OrderDetail