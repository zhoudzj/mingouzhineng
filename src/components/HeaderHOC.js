import React, {Component} from 'react';
import {useHistory} from 'react-router-dom'
import {ReactDOM} from 'react-router-dom'
import styles from '../assets/css/header_hoc.css'

const HeaderHOC = WrappedComponent => {
  return class extends Component {
    constructor(props) {
      super(props)
      this.state = {
        data: "初始化"
      };
    }
    componentWillMount() {}
    handleLogout() {
      console.log('走了');
      this.setState({data: "改变数据"})
    }
    render() {
      return (
        <div>
          <WrappedComponent {...this.props}>
            <div className={styles.hoc}><span className={styles.user}>用户名</span>|<span className={styles.logout}>退出</span>
            </div>
          </WrappedComponent>
        </div>
      )
    }
  }
}

export default HeaderHOC