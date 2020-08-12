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
  message
} from 'antd';
import HouseHeader from "@/components/HouseHeader";
import styles from "./index.css";
import DeviceDetail from "@pages/DeviceDetail/";
import {getProductList, getDefaultProductList, createOrder,createPdf} from '@/config/api';
import errorImg from '@/assets/img/inner.jpg';
import {Context} from '@/context-manager';
import xlsx from 'xlsx';

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
    offset: 5,
    span: 4
  },
  wrapperCol: {
    span: 10
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

const OrderDetail = ({roomData}) => {
  const [form] = Form.useForm();

  const comunityName = useContext(Context);
  const match = useRouteMatch();
  const history = useHistory();
  const {state} = useLocation();
  const [tableData,
    setTableData] = useState([]);
  const [previewList,
    setPreviewList] = useState([]);
  const [totalPrice,
    setTotalPrice] = useState(0);
  const [visible,
    setVisible] = useState(false);
  const [current,
    setCurrent] = useState(1);
  const room = roomData.join('-');
  initFormValue = comunityName
    ? {
      comunityName: comunityName,
      style: state,
      room: room
    }
    : initFormValue;
  //提交订单到服务器
  const onFinish = useCallback(async values => {
    const newlist = previewList.map(item => {
      const filterObj = {}
      for (let key in item) {
        if (['id', 'number'].includes(key)) {
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
        if (!isNaN(i.number) && !isNaN(i.price)) {
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

      if (!isNaN(i.number) && !isNaN(i.price)) {
        optionalData[0].totalNumber += i.number;
        optionalData[0].totalPrice += i.number * Number(i.price);
      }
    });

    const findedIndex = rawData.findIndex(e => optionalData[0].typeId === e.typeId);
    rawData.splice(findedIndex, selectedArr.length, ...optionalData);

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
    const formData = form.getFieldsValue(['comunityName','style','room','salesman','name']);
    let arr = previewList.map((item, index) => {
      return {
          '产品名称': item.name,
          '颜色': getColor(item.color),
          '价格': item.price,
          '数量': item.number
        }
    });
    // let sheet = xlsx
    //     .utils
    //     .json_to_sheet(arr);
    const topHeader = {
      A1:{t:'s',v:'项目名称'},
      B1:{t:'s',v:formData.comunityName},
      A2:{t:'s',v:`销售姓名:${formData.salesman}`},
      B2:{t:'s',v:`姓名:${formData.name}`},
      C2:{t:'s',v:`房号:${formData.room}`},
      D2:{t:'s',v:`户型:${formData.style}`},
      A3:{t:'s',v:'总价'},
      B3:{t:'s',v:`${totalPrice}元`}
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
  }

  const getPdf = async() => {
    await createPdf({url:window.location.href})
  }
  useEffect(() => {
    let totalPrice = 0;
    previewList.forEach(({price, number}) => {
      if (price && number) 
        totalPrice += (Number(price) * number);
      }
    );
    setTotalPrice(totalPrice)
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
        console.log(value);
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
    return (<><tr><th></th><td></td><td></td><td><Button onClick={preView}>
      订单预览
    </Button></td></tr></>)
  }, [tableData]);

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
          footer={current === 2
          ? (
            <div>
              <Button onClick={getPdf}>导出pdf</Button>
              <Button onClick={submit}>导出EXCEL</Button>
              <Button key='submit' type="primary" onClick={handleOk}>提交订单</Button>
            </div>
          )
          : null}>
          {current === 1
            ? <List
                size="large"
                dataSource={previewList}
                renderItem={item => <List.Item key={item.id}>
                <div className={styles.g_item_name}>{item.name}</div>
                <div className={styles.g_item_item}>{getColor(item.color)}</div>
                <div className={styles.g_item_item}>{`￥${item.price}`}</div>
                <div className={styles.g_item_item}>{`数量${item.number}${item.unit}`}</div>
              </List.Item>}
                footer={< div className = {
                styles.g_totalprice
              } > 总价 : {
                `￥${totalPrice}`
              } < /div>}/>
            : null}
          <div>{current === 2
              ? (
                <MemoForm
                  {...layout}
                  name="prodForm"
                  form={form}
                  initialValues={initFormValue}
                  onFinish={onFinish}>
                  <Form.Item label="项目名称" name="comunityName">
                    <Input/>
                  </Form.Item>
                  <Form.Item label="户型" name="style">
                    <Input/>
                  </Form.Item>
                  <Form.Item label="房号" name="room">
                    <Input/>
                  </Form.Item>
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
                </MemoForm>
              )
              : null}
          </div>
          <Pagination
            simple
            defaultCurrent={1}
            defaultPageSize={1}
            onChange={onPageChange}
            total={2}/>
        </Modal>
      </Route>
    </Switch>
  )
}

export default OrderDetail