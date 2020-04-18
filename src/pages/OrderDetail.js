import React, {useState, useEffect, useReducer} from 'react';
import {Switch, Route, Link, useRouteMatch} from 'react-router-dom'
import {Table, Button,Typography} from 'antd';
import HouseHeader from "../components/HouseHeader";
import styles from "../assets/css/order_detail.css";
import DeviceDetail from "./DeviceDetail";
const { Text } = Typography;

const img_int = require('../assets/img/product/shining_int_pad.png');
const img_three = require('../assets/img/product/shining_tree_pad.png');
const img_chuanglian = require('../assets/img/product/chuanglian.png');
const img_ap1000 = require('../assets/img/product/AP1000.png');
const img_s500se = require('../assets/img/product/S500SE.png');

const rawData = [
  {
    type: "智能面板",
    key: 300,
    typeId: 1,
    no: 1,
    text: `炫彩智能面板
      背光显示（0/25%/50%/100%四档可调)
      支持单击/双击/三击控制呼吸灯设计
      人体感应情景模式联动 
      按键触点振动`,
    image: img_int,
    price: 1000,
    number: 5
  }, {
    type: "智能面板",
    typeId: 1,
    no: 2,
    key: 301,
    text: `炫彩温控面板
      一台设备可同时控制中央空调、地暖、新风系统
      自带1路16A继电器控制地暖
      4路继电器控制空调水机`,
    image: img_three,
    price: 1200,
    number: 3
  }, {
    type: '电动窗帘',
    typeId: 2,
    no: 1,
    key: 401,
    text: `开合帘窗帘电机
      可强电控制、遥控、智能模块控制
      停电可手拉，有电手拉即走
      可兼容第三方智能家居系统

      窗帘轨道:
      材质：铝合金
      安装方式：明轨
      滑动装：一般滑轮`,
    image: img_chuanglian,
    price: 600,
    number: 6
  }, {
    type: 'wifi覆盖',
    typeId: 3,
    no: 1,
    key: 502,
    text: `G500SE
      该设备基于金融级硬件，集合路由、交换、无线控制（AC）和PoE供电等四大功能为一体
      300终端并发入网
      5台无线AP管理
      1个GE WAN口
      4个GE LAN口，其中4口支持PoE(IEEE802.3af）`,
    image: img_s500se,
    price: 1888,
    number: 1
  }, {
    type: 'wifi覆盖',
    typeId: 3,
    no: 2,
    key: 503,
    text: `AP1000
      全千兆网口
      2.4G/5G双频1200M带宽
      IEEE802.3af 标准PoE供电`,
    image: img_ap1000,
    price: 680,
    number: 4
  }
];
const OrderDetail = () => {
  const match = useRouteMatch();
  const [tableData,
    setTableData] = useState([])

  const plus = (e, row) => {
    row.number += 1;
    row.totalPrice = row.price * row.number;
    const newData = [...tableData];
    setTableData(newData);
  }
  const minus = (e, row) => {
    if (row.number === 0) 
      return;
    row.number -= 1;
    row.totalPrice = row.price * row.number;
    const newData = [...tableData];
    setTableData(newData)
  }
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'type',
      key: 'type',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {}
        };
        if (index === 0 || index === 3) {
          obj.props.rowSpan = 2;
          return obj;
        } else if (index === 2) {
          obj.props.rowSpan = 1;
          return obj;
        } else {
          obj.props.rowSpan = 0;
          return obj
        }
      }
    }, {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      render: (value) => {
        return <img className={styles.g_img} src={value}/>
      }
    }, {
      title: '描述',
      dataIndex: 'text',
      key: 'text',
      render: (value) => {
        return <span className={styles.g_text}>{value}</span>
      }
    }, {
      title: '数量',
      dataIndex: 'number',
      key: 'number',
      render: (value, row, index) => (
        <div>
          {(row.typeId === 1 || row.typeId === 3) && (row.no === 1)
            ? (
              <div style={{
                float: "right"
              }}>
                <Link to={`${match.url}/device:${row.typeId}`}>
                  <Button>更改</Button>
                </Link>
              </div>
            )
            : ""}
          <span>
            <button onClick={(e) => {
              minus(e, row)
            }}>-</button>
            <span
              style={{
              textAlign: 'center',
              margin: '10px'
            }}>{value}</span>
            <button onClick={(e) => {
              plus(e, row)
            }}>+</button>
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
    const newData = rawData.map(item => {
      return {
        ...item,
        totalPrice: item.price * item.number
      }
    })
    setTableData(newData);
  }, []);

  return (
    <Switch>
      <Route path={`${match.path}/:deviceId`}>
        <DeviceDetail/>
      </Route>
      <Route path={`${match.path}`}>
        <HouseHeader title={"选择推荐"}/>
        <Table
          columns={columns}
          dataSource={tableData}
          bordered
          summary={(pageData) => {
          let totalCount = 0;
          pageData.forEach(({totalPrice}) => {
            totalCount += totalPrice;
          });
          return ( <> <tr>
            <th></th>
            <td></td>
            <td></td>
            <td>
              总价:<Text type="danger">￥{totalCount}</Text>
            </td>
          </tr> < /> ) }}/>
      </Route>
    </Switch>
  )
}

export default OrderDetail