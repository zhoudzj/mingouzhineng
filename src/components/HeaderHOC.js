import React, {Component} from 'react';
import {useHistory, withRouter} from 'react-router-dom'
import {ReactDOM} from 'react-router-dom'
import styles from '@/assets/css/header_hoc.css'
import {Modal,Menu,Dropdown} from 'antd';
import {connect} from 'react-redux';
import {loginOut} from '@/config/api'

const {confirm} = Modal;

const HeaderHOC = WrappedComponent => {
  class Headers extends Component {
    constructor(props) {
      super(props)
      this.handleLogout = this
        .handleLogout
        .bind(this)
      this.userName = this.props.userInfo
        ? this.props.userInfo.name
        : '用户名';
    }
    componentWillMount() {}
    handleLogout() {
      confirm({
        title: '确定退出登录吗?',
        content: '成功退出后将跳转到登录界面',
        okText: "确认",
        cancelText: "取消",
        onOk: async() => {
          try {
            await loginOut();
            this
              .props
              .dispatch({
                type: 'REMOVE_TOKEN',
                payload: {
                  token: '',
                  userInfo: ''
                }
              });
            this
              .props
              .history
              .push('/login');
          } catch (error) {
            console.log(error)
          }
        },
        onCancel() {}
      })
    }
    gotoMyPage = () => {
      this
        .props
        .history
        .push('/my');
    }
    render() {
      const menu = (<Menu><Menu.Item><a target="_blank" rel="noopener noreferrer" onClick={this.gotoMyPage}>我的订单</a></Menu.Item></Menu>)

      return (
        <div>
          <WrappedComponent {...this.props}>
            <div className={styles.hoc}>
              <Dropdown overlay={menu}>
                <a className={styles.user}>{this.userName}</a>
              </Dropdown>
              |<span className={styles.logout} onClick={this.handleLogout}>退出</span>
            </div>
          </WrappedComponent>
        </div>
      )
    }
  }
  return withRouter(connect(mapStateToProps)(Headers))
}

const mapStateToProps = (state) => {
  return {
    ...state.user
  }
}

export default HeaderHOC