import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  memo,
  useCallback,
  useMemo
} from 'react';
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
  useHistory,
  useLocation
} from 'react-router-dom'
import {
  Table,
  Button,
  Typography,
  Modal,
  List,
  Form,
  Pagination,
  Input,
  message,
  Row,
  Col
} from 'antd';
import HouseHeader from "@/components/HouseHeader";
import styles from "./index.scss";
import DeviceDetail from "@pages/DeviceDetail/";
import {getProductList, getDefaultProductList, createOrder} from '@/config/api';
import errorImg from '@/assets/img/inner.jpg';
import {Context} from '@/context-manager';
import xlsx from 'xlsx';
import html2canvas from 'html2canvas';
import jsPdf from 'jspdf'

const MemoTable = memo(Table);
const MemoForm = memo(Form);
const pictureDomian = process.env.REACT_APP_PICTURE_DOMAIN

const {Text} = Typography;

const PRODUCT_MACHINE_TYPEID = 1;
const PRODUCT_MODLE_TYPEID = 2;
const PRODUCT_PANEL_TYPEID = 4;
const PRODUCT_SOCKET_TYPEID = 5;

let initFormValue = {
  comunityName: '春月锦庐',
  style: '',
  room: '',
  salesman: '',
  name: ''
}

const reducer = (state, action) => {
  switch (action.type) {
    case "init":
      return {
        ...state,
        title: action.payload.title,
        style: action.payload.style,
        room: action.payload.room
      }
    default:
      return state;
  }
}

const layout = {
  labelCol: {
    offset: 1,
    span: 3
  },
  wrapperCol: {
    span: 6
  }
}

const getColor = (index) => {
  if (index === 1) {
    return '雪花银'
  } else if (index === 2) {
    return '香槟金'
  } else if (index === 3) {
    return '云母黑'
  }
}

const OrderDetail = ({}) => {
  const [form] = Form.useForm();

  const match = useRouteMatch();
  const history = useHistory();
  const {state} = useLocation();
  const [tableData,
    setTableData] = useState([]);
  const [previewList,
    setPreviewList] = useState([]);
  const [totalPrice,
    setTotalPrice] = useState(0);
  const [deviceTotalPrice,
    setDeviceTotalPrice] = useState(0);
  const [taxes,
    setTaxes] = useState(0);
  const [installationPrice,
    setInstallationPrice] = useState(0);
  const [visible,
    setVisible] = useState(false);
  const [current,
    setCurrent] = useState(1);
  initFormValue = state
    ? {
      comunityName: state.comunityName,
      style: state.style,
      room: state
        .roomNo
        .join('-')
    }
    : initFormValue;
  //提交订单到服务器
  const onFinish = useCallback(async values => {
    const newlist = previewList.map(item => {
      const filterObj = {}
      for (let key in item) {
        if (['id', 'number', 'color'].includes(key)) {
          filterObj[key] = item[key];
        }
      }
      return filterObj
    })
    const obj = Object.assign({
      list: newlist
    }, values);
    const res = await createOrder(obj);
    if (res) {
      setVisible(false);
      message.info('创建订单成功！')
    }
  }, [previewList]);

  const changeTableData = (optionalData, associationData) => {
    const rawData = tableData;
    console.log(associationData);

    if (associationData.length > 0) {
      const socketArr = rawData.filter(value => value.typeId === associationData[0].typeId);

      let newArr = [];
      associationData.forEach((item, index, arr) => {
        socketArr.forEach(elem => {
          if (item.childId === elem.childId) {
            item.number = elem.number
            newArr.push(item);
          }
        })
      });
      console.log(newArr);
      newArr.forEach((item, index, arr) => {
        if (index === 0) {
          arr[index].totalNumber = 0;
          arr[index].totalPrice = 0;
          if (item.childId === 11) {
            arr[index].length = arr.length;
          }
        }
        if (!isNaN(item.number) && !isNaN(item.price)) {
          arr[0].totalNumber += item.number;
          arr[0].totalPrice += item.number * Number(item.price);
        }
      })
      const findedAssoIndex = rawData.findIndex(e => associationData[0].typeId === e.typeId);
      rawData.splice(findedAssoIndex, socketArr.length, ...newArr);
    }

    const oldArr = rawData.filter(value => value.typeId === optionalData[0].typeId);

    let newArr = [];
    optionalData.forEach((item, index, arr) => {
      oldArr.forEach(elem => {
        if ((item.childId === elem.childId)) {
          item.number = elem.number;
          newArr.push(item);
        }
      })
    });
    newArr.forEach((item, index, arr) => {
      if (index === 0) {
        arr[index].totalNumber = 0;
        arr[index].totalPrice = 0;
      }
      if (!isNaN(item.number) && !isNaN(item.price)) {
        arr[0].totalNumber += item.number;
        arr[0].totalPrice += item.number * Number(item.price);
        arr[0].length = arr.length;
      }
    })

    const findedIndex = rawData.findIndex(e => newArr[0].typeId === e.typeId);
    rawData.splice(findedIndex, oldArr.length, ...newArr);
    console.log(rawData);
    setTableData(rawData)
  };

  const onPageChange = useCallback(page => {
    setCurrent(page)
  }, []);
  //订单预览
  const preView = async() => {
    const data = await getDefaultProductList({id: match.params.styleId});
    if (data && data.length > 0) {
      const topArr = data.filter(e => (e.typeId === PRODUCT_MACHINE_TYPEID || e.typeId === PRODUCT_MODLE_TYPEID));
      const otherArr = data.filter(e => (e.typeId !== PRODUCT_MACHINE_TYPEID && e.typeId !== PRODUCT_MODLE_TYPEID));
      setPreviewList([
        ...topArr,
        ...tableData,
        ...otherArr
      ]);
    }
    setVisible(true);
  };
  //生成excel
  const submit = () => {
    const formData = form.getFieldsValue(['comunityName', 'style', 'room', 'salesman', 'name']);
    let arr = previewList.map((item, index) => {
      return {
        '产品名称': item.name,
        '颜色': getColor(item.color),
        '价格': item.price,
        '数量': item.number
      }
    });
    // let sheet = xlsx     .utils     .json_to_sheet(arr);
    const topHeader = {
      A1: {
        t: 's',
        v: '项目名称'
      },
      B1: {
        t: 's',
        v: formData.comunityName
      },
      A2: {
        t: 's',
        v: `销售姓名:${formData.salesman}`
      },
      B2: {
        t: 's',
        v: `姓名:${formData.name}`
      },
      C2: {
        t: 's',
        v: `房号:${formData.room}`
      },
      D2: {
        t: 's',
        v: `户型:${formData.style}`
      },
      A3: {
        t: 's',
        v: '总价'
      },
      B3: {
        t: 's',
        v: `${totalPrice}元`
      }
    }
    const _headers = ['产品名称', '颜色', '价格', '数量']
    let headers = _headers.map((v, i) => Object.assign({}, {
      v: v,
      t: 's',
      position: String.fromCharCode(65 + i) + 4
    })).reduce((prev, next) => Object.assign({}, prev, {
      [next.position]: {
        v: next.v,
        t: next.t
      }
    }), {});
    let data = arr.map((v, i) => _headers.map((k, j) => {
      let type = '';
      if (k === '产品名称' || k === '颜色') {
        type = 's'
      } else {
        type = 'n'
      }
      return Object.assign({}, {
        v: v[k],
        t: type,
        position: String.fromCharCode(65 + j) + (i + 5)
      })
    })).reduce((prev, next) => prev.concat(next)).reduce((prev, next) => Object.assign({}, prev, {
      [next.position]: {
        v: next.v,
        t: next.t
      }
    }), {});
    let output = Object.assign({}, topHeader, headers, data);

    let outputPos = Object.keys(output);
    let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];

    let book = xlsx
      .utils
      .book_new();

    xlsx
      .utils
      .book_append_sheet(book, Object.assign({}, output, {'!ref': ref}), "sheet1");
    xlsx.writeFile(book, `user${new Date().getTime()}.xls`);
  }

  useEffect(() => {
    let deviceTotalPrice = 0;
    previewList.forEach(({price, number}) => {
      if (price && number) 
        deviceTotalPrice += (Number(price) * number);
      }
    );
    setDeviceTotalPrice(deviceTotalPrice);
    const installationPrice = Math.round(deviceTotalPrice * 0.15);
    setInstallationPrice(installationPrice);
    const taxes = Math.round((deviceTotalPrice + deviceTotalPrice * 0.15) * 0.10);
    setTaxes(taxes);
    setTotalPrice(deviceTotalPrice + installationPrice + taxes);
  }, [previewList])

  const handleOk = useCallback(e => {
    form.submit();
  }, []);

  const handleCancel = useCallback(e => {
    setVisible(false);
  }, []);

  const columns = useMemo(() => [
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
        if (row.typeId === PRODUCT_PANEL_TYPEID || row.typeId === PRODUCT_SOCKET_TYPEID) {
          pictureUrl = pictureDomian + value + '/' + row.color + '.png';
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
  ], []);

  const callbackHandler = useCallback((pageData) => {
    return ( <>< tr > <th></th> < td > </td> < td > </td> < td > <Button onClick={preView}>
      订单预览
    </Button> < /td></tr > </>)
  }, [tableData]);

  const getPdf = () => {
    const formData = form.getFieldsValue(['comunityName', 'style', 'room', 'salesman', 'name']);

    const domElement = document.getElementsByClassName('ant-modal-body');
    console.log(domElement);
    html2canvas(domElement[0]).then((canvas) => {
      let contentWidth = canvas.width;
      let contentHeight = canvas.height;

      const img = canvas.toDataURL('image/jpeg');

      var imgWidth = 595.28;
      var imgHeight = 592.28 / contentWidth * contentHeight;
      const pdf = new jsPdf('', 'pt', 'a4');

      pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${formData.comunityName}${formData.room}.pdf`)
    })
  }

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
    return () => {}
  }, []);

  return (
    <Switch>
      <Route path={`${match.path}/:typeId`}>
        <DeviceDetail changeTableData={changeTableData}/>
      </Route>
      <Route path={`${match.path}`} exact>
        <HouseHeader title={"选择推荐"}/>
        <MemoTable
          columns={columns}
          dataSource={tableData}
          rowKey='id'
          pagination={false}
          bordered
          summary={callbackHandler}/>
        <Modal
          width={800}
          title="订单预览"
          visible={visible}
          onCancel={handleCancel}
          footer={< div > <Button onClick={getPdf}>导出pdf</Button> < Button key = 'submit' type = "primary" onClick = {
          handleOk
        } > 提交订单 < /Button></div >}>
          <MemoForm
            id="previewModal"
            name="prodForm"
            form={form}
            initialValues={initFormValue}
            onFinish={onFinish}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="项目名称" name="comunityName">
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="户型" name="style">
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="房号" name="room">
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="销售姓名"
                  name="salesman"
                  rules={[{
                    required: true,
                    message: '销售姓名不能为空'
                  }
                ]}>
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="姓名"
                  name="name"
                  rules={[{
                    required: true,
                    message: '姓名不能为空'
                  }
                ]}>
                  <Input/>
                </Form.Item>
              </Col>
            </Row>
          </MemoForm>
          <List
            size="small"
            dataSource={previewList}
            renderItem={item => <List.Item key={item.id}>
            <div className={styles.g_item_name}>{item.name}</div>
            <div className={styles.g_item_item}>{getColor(item.color)}</div>
            <div className={styles.g_item_item}>{`￥${item.price}`}</div>
            <div className={styles.g_item_item}>{`数量${item.number}${item.unit}`}</div>
          </List.Item>}
            footer={< div > < div className = {
            styles.g_devicePrice
          } > 设备小计 : {
            `￥${deviceTotalPrice}`
          } &nbsp;
          &nbsp;
          &nbsp;
          &nbsp;
          &nbsp;
          &nbsp;
          安装调试费 : {
            `￥${installationPrice}`
          } &nbsp;
          &nbsp;
          &nbsp;
          &nbsp;
          &nbsp;
          &nbsp;
          税金 : {
            `￥${taxes}`
          } < /div><div className = {styles.g_totalprice} >总价: { `￥${totalPrice}` }</div > </div>}/>
        </Modal>
      </Route>
    </Switch>
  )
};

export default OrderDetail