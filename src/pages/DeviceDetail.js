import React, {useState, useEffect, useReducer} from 'react';
import {Switch, Route, Link, useRouteMatch, useParams} from 'react-router-dom'
import {Table, Form, Button} from 'antd';
import HouseHeader from "../components/HouseHeader";
import styles from "../assets/css/device_detail.css";

//自定义
const img_stadard = require('../assets/img/pad/stadard.png');
const img_stadard_three = require('../assets/img/pad/stadard_three.png');
const img_iron = require('../assets/img/pad/iron.png');
const img_iron_three = require('../assets/img/pad/iron_three.png');
const img_shine = require('../assets/img/pad/shine.png');
const img_shine_tree = require('../assets/img/pad/shine_three.png');
//wifi自定义
const img_AP1000 = require('../assets/img/wifi/AP1000.png');
const img_BeeconIPTV = require('../assets/img/wifi/BeeconIPTV.png');
const img_BeeconSE = require('../assets/img/wifi/BeeconSE.png');
const img_G500SE = require('../assets/img/wifi/G500SE.png');

const padData = [
  {
    type: '标准智能面板',
    typeId: 1,
    key: 1,
    text: `标准智能面板
      背光效果：文字背景灯黄色 ，工作灯白色
      颜色：可按客户需求定制
      功能：灯光、场景、空调、窗帘、紧急求助等`,
    image: img_stadard,
    price: 480,
    color: "玉石黑"
  }, {
    type: '标准三合一温控面板',
    typeId: 1,
    key: 2,
    text: `标准三合一温控面板
      一台设备可同时控制中央空调、地暖、新风系统
      自带1路16A继电器控制地暖
      4路继电器控制空调水机`,
    image: img_stadard_three,
    price: 550,
    color: "玉石黑"
  }, {
    type: '金属亚光智能面板',
    typeId: 2,
    key: 3,
    text: `金属亚光智能面板
    材质：铝合金
    颜色 ：灰色拉丝，可按客户要求定制
    功能 ：灯光、场景、空调、窗帘、紧急求助等`,
    image: img_iron,
    price: 880,
    color: "灰色拉丝"
  }, {
    type: '三合一旋钮温控智能面板',
    typeId: 2,
    key: 4,
    text: `三合一旋钮温控智能面板
          材质：铝合金
          颜色 ：灰色拉丝，可按客户要求定制
          功能 ：空调控制`,
    image: img_iron_three,
    price: 1680,
    color: "灰色拉丝"
  }, {
    type: '炫彩智能面板',
    typeId: 3,
    key: 5,
    text: `炫彩智能面板
            背光显示（0/25%/50%/100%四档可调）
            支持单击/双击/三击控制呼吸灯设计，
            人体感应情景模式联动，
            按键触点振动`,
    image: img_shine,
    price: 1080,
    color: "阿姆斯特丹橙"
  }, {
    type: '三和一温控智能面板',
    typeId: 3,
    key: 6,
    text: `三和一温控智能面板
      一台设备可同时控制中央空调、地暖、新风系统
      自带1路16A继电器控制地暖
      4路继电器控制空调水机`,
    image: img_shine_tree,
    price: 1280,
    color: "阿姆斯特丹橙"
  }
]
const wifiData = [
  {
    type: 'G500SE',
    typeId: 1,
    key: 1,
    text: `G500SE
    该设备基于金融级硬件，集合路由、交换、无线控制（AC）和PoE供电等四大功能为一体
    300终端并发入网
    5台无线AP管理
    1个GE WAN口
    4个GE LAN口，其中4口支持PoE(IEEE802.3af）`,
    image: img_G500SE,
    price: 1880
  }, {
    type: 'AP1000',
    typeId: 2,
    key: 2,
    text: `AP1000
      全千兆网口
      2.4G/5G双频1200M带宽
      IEEE802.3af 标准PoE供电`,
    image: img_AP1000,
    price: 680
  }, {
    type: 'BeeconSE',
    typeId: 3,
    key: 3,
    text: `BeeconSE
    集合路由、交换等功能为一体
    1个FE WAN口
    1个FE LAN口，LAN3口支持PoE受电
    支持5V1A国标电源和PoE受电两种方式`,
    image: img_BeeconIPTV,
    price: 580
  }, {
    type: 'BeeconIPTV',
    typeId: 4,
    key: 4,
    text: `BeeconIPTV
      支持802.11b/g/n,2.4G 300M带宽
      10/100Mbps Rj45口
      IEEE802.3af 标准PoE供电`,
    image: img_BeeconSE,
    price: 350
  }
]

const DeviceDetail = () => {
  const [devName,
    setDevName] = useState('')
  const [tableData,
    setTableData] = useState([]);
  let {deviceId} = useParams();

  useEffect(() => {
    if (deviceId.split(':')[1] === '1') {
      setDevName('设备自定义');
      setTableData(padData);
    } else if (deviceId.split(':')[1] === '3') {
      setDevName('wifi自定义');
      setTableData(wifiData);
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
      dataIndex: 'image',
      render: value => <img className={styles.img_wrap} src={value}/>
    }, {
      title: '文本',
      dataIndex: 'text',
      render: text => <div className={styles.text_wrap}>{text}</div>
    }, {
      title: '单价',
      dataIndex: 'price',
      render: (text, row, index) => (
        <div>
          <div>
            {(index%2===0&&deviceId.split(':')[1] === '1')?<div><span>颜色:</span><span>{row.color}</span></div> :''}
          </div>
          <span>单价:</span><a>{text}</a>
        </div>
      )
    }
  ]

  return (
    <div>
      <HouseHeader title={devName}/>
      <Table
        rowSelection={{
        type: selectionType,
        ...rowSelection
      }}
        columns={columns}
        dataSource={tableData}/>
    </div>
  )
}

export default DeviceDetail