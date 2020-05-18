import React, {Component} from 'react';
import {useHistory, withRouter} from 'react-router-dom'
import {ReactDOM} from 'react-router-dom'
import styles from '../assets/css/header_hoc.css'
import {Modal} from 'antd';
const { confirm } = Modal;

const HeaderHOC = WrappedComponent => {
  class Headers extends Component {
    constructor(props) {
      super(props)
      this.handleLogout = this
        .handleLogout
        .bind(this)
      this.state = {
        data: "初始化"
      };
    }
    componentWillMount() {}
    handleLogout() {
      const that = this;
      confirm({
        title: '确定退出登录吗?',
        content: '成功退出后将跳转到登录界面',
        okText:"确认",
        cancelText:"取消",
        onOk() {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              that.setState({data: "改变数据"});
              resolve();
              that
                .props
                .history
                .push('/login');
            }, 500);
          }).catch(() => console.log('退出登录失败!'));
        },
        onCancel() {}
      })

    }
    render() {
      return (
        <div>
          <WrappedComponent {...this.props}>
            <div className={styles.hoc}>
              <span className={styles.user}>用户名</span>|<span className={styles.logout} onClick={this.handleLogout}>退出</span>
            </div>
          </WrappedComponent>
        </div>
      )
    }
  }
  return withRouter(Headers)
}

export default HeaderHOC