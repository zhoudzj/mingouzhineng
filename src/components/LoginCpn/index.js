import React from 'react';
import {Route, Link} from 'react-router-dom'
import styles from "./index.scss"
import {message, Input, Button, Tabs} from 'antd';
import { UserOutlined, LockOutlined} from '@ant-design/icons';

const LoginComponent = ({onUserChange,onPasswordChange,onClick,btnText}) => {
  return (
    <div>
    <div className={styles.input_wrap}>
    <Input
      size="large"
      placeholder="请输入用户名"
      onChange={onUserChange}
      prefix={< UserOutlined />}/>
      </div>< br />< br /> 
    <div className={styles.input_wrap}>
    <Input
      size="large"
      type="password"
      placeholder="请输入密码"
      prefix={< LockOutlined />}
      onChange={onPasswordChange}/>
      </div>< br />< br />
      <button className = {styles.button_login} onClick={onClick}>{btnText}</button>

      <div className={styles.intro}>powered by Mingou</div>
    </div>
    )
}


export default LoginComponent;