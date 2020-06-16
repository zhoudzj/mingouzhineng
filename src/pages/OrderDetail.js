import React, {useState, useEffect, useReducer} from 'react';
import {Switch, Route, Link, useRouteMatch} from 'react-router-dom'
import {Table, Button, Typography} from 'antd';
import HouseHeader from "../components/HouseHeader";
import styles from "../assets/css/order_detail.css";
import DeviceDetail from "./DeviceDetail";
import {getProductList} from '../config/api'
const pictureDomian = process.env.REACT_APP_PICTURE_DOMAIN

const {Text} = Typography;

const OrderDetail = () => {
  const match = useRouteMatch();
  const [tableData,
    setTableData] = useState([])

  const columns = [
    {
      title: '设备名称',
      dataIndex: 'type',
      width: '150px',
      // textWrap: 'word-break',
      ellipsis: true,
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {}
        };
        if (row.id===3||row.id===4||row.id===5||row.id===24||row.id===27) {
          obj.props.rowSpan = 2;
          return obj;
        } else if(row.id===7||row.id===8||row.id===9||row.id===25||row.id===28||row.id===29||(row.typeId===400&&!('length'in row))){
          obj.props.rowSpan = 0;
          return obj;
        } else if('length'in row) {
          obj.props.rowSpan = row.length;
          return obj;
        } else {
          obj.props.rowSpan = 1;
          return obj
        }
      }
    }, {
      title: '图片',
      dataIndex: 'img',
      width: '150px',
      ellipsis: true,
      render: (value, row, index) => {
        // console.log(row);
        const obj = {
          children: <img className={styles.g_img} src={pictureDomian+value}/>,
          props: {}
        };
        if(row.id===3||row.id===4||row.id===5||row.id===24||row.id===27){
          obj.props.rowSpan = 2;
          return obj
        } else if(row.id===7||row.id===8||row.id===9||row.id===25||row.id===28||row.id===29||(row.typeId===400&&!('length'in row))){
          obj.props.rowSpan = 0;
          return obj
        } else if('length'in row) {
          obj.props.rowSpan = row.length;
          return obj;
        } else {
          return obj
        }
      }
    }, {
      title: '描述',
      dataIndex: 'description',
      width: '350px',
      ellipsis: true,
      render: (value) => {
        return <span className={styles.g_text}>{value}</span>
      }
    }, {
      title: '数量',
      dataIndex: 'number',
      width: '250px',
      ellipsis: true,
      render: (value, row, index) => (
        <div>
          {/* {(row.typeId === 300) && (index === 1)
            ? (
              <div style={{
                float: "right"
              }}>
                <Link to={`${match.url}/device:${row.typeId}`}>
                  <Button>更改</Button>
                </Link>
              </div>
            )
            : ""} */}
          <span>
            <span
              style={{
              textAlign: 'center',
              margin: '10px'
            }}>{value}</span>
          </span>
          <span
            style={{
            marginLeft: '20px',
            color: 'red'
          }}>{`￥${row.totalPrice}`}</span>
        </div>
      )
    }
  ];
 
  useEffect(() => {
    const fetchData = async() => {
      const rawData = await getProductList({id:match.params.styleId});
      const typeIdArr = rawData.filter(record=>record.typeId ===400);
      const typeId_firstIndex = rawData.findIndex(value=>value.typeId===400);

      const newData = rawData.map((item,index) => {
        if(index===typeId_firstIndex){
          item.length = typeIdArr.length
        }
        return {
          ...item,
          totalPrice: item.price * item.number
        }
      })
      setTableData(newData);
    }
    fetchData();

  }, []);

  return (
    <Switch>
      <Route path={`${match.path}/:deviceId`}>
        <DeviceDetail/>
      </Route>
      <Route path={`${match.path}`}>
        <HouseHeader title={"选择推荐"}/>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={tableData}
          pagination={false}
          bordered
          summary={(pageData) => {
          let totalCount = 0;
          pageData.forEach(({totalPrice}) => {
            totalCount += totalPrice;
          });
          return (<><tr><th></th><td></td><td></td><td>总价:<Text type="danger">￥{totalCount}</Text></td></tr></>)
        }}/>
      </Route>
    </Switch>
  )
}

export default OrderDetail