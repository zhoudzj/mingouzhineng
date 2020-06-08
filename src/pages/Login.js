import React, {useState} from 'react';
import {Switch, Route, Link, useHistory} from 'react-router-dom';
import styles from "../assets/scss/login.scss";
import {message, Input, Button, Tabs} from 'antd';
import {connect} from 'react-redux';
import {getLogin, getUserInfo, getRegister} from '../config/api';
import { UserOutlined, LockOutlined, LockFilled, PhoneFilled } from '@ant-design/icons';
import LoginCpn from '../components/LoginCpn.js'

const {TabPane} = Tabs;

const Login = ({dispatch}) => {
    const history = useHistory();
    const [userName,
        setUserName] = useState('');
    const [password,
        setPassword] = useState('');
    const checked = () => {
        if (!userName) {
            message.info('请输入用户名！');
            return false
        }
        if (!password) {
            message.info('请输入密码！');
            return false
        }
        if (password.length < 6 || password.length > 12) {
            message.info('清输入6-12位密码！');
            return false
        }
        return true
    };
    const haddleLogin = async() => {
        if (!checked()) 
            return;
        try {
            const data = await getLogin({userName, password})
            dispatch({
                type: 'ADD_TOKEN',
                payload: {
                    token: data.token
                }
            });
            const userInfo = await getUserInfo({userName, password})
            dispatch({type: 'SET_USERINFO', payload: {
                    userInfo
                }});
            history.push('/')
        } catch (err) {
            console.log(err);
        }
    }
    const haddleRegister = async e => {
        if (!checked()) 
            return;
        try {
            await getRegister({userName, password});
            message.info('注册成功请登录!');
        } catch (err) {
            console.log(err);
        }
    }
    const onUserChange = e => {
        setUserName(e.target.value)
    }
    const onPasswordChange = e => {
        setPassword(e.target.value)
    }
    return (
        <div id = "test" className={styles.Login}>
            <header className={styles.Login_header}>一站式智能场景选装</header>
            <div className="card-container">
                <Tabs type="card">
                    <TabPane tab="登 录" key="1">
                        <LoginCpn btnText="登 录" onUserChange={onUserChange} onPasswordChange={onPasswordChange} onClick={haddleLogin}/>
                    </TabPane>
                    <TabPane tab="注 册" key="2">
                        <LoginCpn btnText="注 册" onUserChange={onUserChange} onPasswordChange={onPasswordChange} onClick={haddleRegister}/>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        ...state.user
    }
}

export default connect(mapStateToProps)(Login)