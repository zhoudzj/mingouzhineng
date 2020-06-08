import React from 'react';
import {Modal, Button} from 'antd';
import {connect} from 'react-redux';
import {Switch, Route, Link, useHistory} from 'react-router-dom';

const NetworkReconnect = ({dispatch, network}) => {
      const history = useHistory();

  const handleOk = e => {
    dispatch({
      type: 'CHANGE_NETWORK',
      payload: {
        network: true
      }
    });
    history.go(0)
  };
  const handleCancel = e => {
    dispatch({
      type: 'CHANGE_NETWORK',
      payload: {
        network: true
      }
    });
  }
  return (
    <Modal
      title="浏览器断线重连"
      visible={!network}
      onOk={handleOk}
      onCancel={handleCancel}>
      <p>浏览器无法连接互联网,是否刷新</p>
    </Modal>
  )
}

const mapStateToProps = (state) => {
  return {
    ...state.global
  }
}

export default connect(mapStateToProps)(NetworkReconnect)