import React, {useState, useEffect, useReducer} from 'react';
import {Switch, Route, Link, useRouteMatch} from 'react-router-dom'
import {Table} from 'antd';
import HouseHeader from "../components/HouseHeader";
import styles from "../assets/css/order_detail.css";

const img_int = require('../assets/img/product/shining_int_pad.png');
const img_three = require('../assets/img/product/shining_tree_pad.png');
const img_machine = require('../assets/img/product/window_machine.png');
const img_ray = require('../assets/img/product/window_ray.png');
const img_ap1000 = require('../assets/img/product/AP1000.png');
const img_s500se = require('../assets/img/product/S500SE.png');

const OrderDetail = () => {
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'type',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {}
        };
        if (index === 0 || index === 2 || index === 4) {
          obj.props.rowSpan = 2;
          return obj;
        } else {
          obj.props.rowSpan = 0;
          return obj
        }
      }
    }, {
      title: '图片',
      dataIndex: 'image',
      render: (value) => {
        return <img className={styles.g_img} src={value}/>
      }
    }, {
      title: '描述',
      dataIndex: 'text',
      render: (value) => {
        return <span className={styles.g_text}>{value}</span>
      }
    }, {
      title: '数量',
      dataIndex: 'number'
    }
  ];
  const data = [
    {
      type: "智能面板",
      id: 300,
      text: `炫彩智能面板: /n
      背光显示（0/25%/50%/100%四档可调）/n
      支持单击/双击/三击控制呼吸灯设计，人体感应情景模式联动 
      按键触点振动`,
      image: img_int
    }, {
      type: "智能面板",
      id: 301,
      text: `炫彩温控面板:
      一台设备可同时控制中央空调、地暖、新风系统
      自带1路16A继电器控制地暖
      4路继电器控制空调水机`,
      image: img_three
    }, {
      type: '电动窗帘',
      id: 401,
      text: `开合帘窗帘电机：
可强电控制、遥控、智能模块控制
停电可手拉
，有电手拉即走
可兼容第三方智能家居系统`,
      image: img_machine
    }, {
      type: '电动窗帘',
      id: 401,
      text: `窗帘轨道:
材质：铝合金
安装方式：明轨
滑动装：一般滑轮`,
      image: img_ray
    }, {
      type: 'wifi覆盖',
      id: 502,
      text: `G500SE:
该设备基于金融级硬件，集合路由、交换、无线控制（AC）和PoE供电等四大功能为一体
300终端并发入网
5台无线AP管理
1个GE WAN口
4个GE LAN口，其中4口支持PoE(IEEE802.3af）`,
      image: img_s500se
    }, {
      type: 'AP100',
      id: 503,
      text: `AP1000:
全千兆网口
2.4G/5G双频1200M带宽
IEEE802.3af 标准PoE供电`,
      image: img_ap1000
    }
  ]
  return (
    <div>
      <HouseHeader title={"选择推荐"}/>
      <Table columns={columns} dataSource={data} bordered></Table>
    </div>
  )
}

export default OrderDetail