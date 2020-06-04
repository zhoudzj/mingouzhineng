import React, {useState} from 'react';
import {Switch, Route, Link, useHistory} from 'react-router-dom'
import styles from "../assets/scss/login.scss"
import {message, Input, Button, Tabs} from 'antd';
import {connect} from 'react-redux';
import {getLogin, getUserInfo, getRegister} from '../config/api'
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
            {/*<div className={styles.content_wrap}>
                <div className={styles.input_wrap}>
                    <input size="large" placeholder="请输入用户名" onChange={onUserChange}/></div>
                <div className={styles.input_wrap}>
                    <input type="password" size="large" placeholder="请输入密码" onChange={onPasswordChange}/></div>
                <button className={styles.button_login} onClick={haddleLogin}>登录</button>
                <button className={styles.button_register} onClick={haddleRegister}>注册</button>
                <div className={styles.intro}>powered by Mingou</div>
            </div>*/}
            <div className="card-container">
                <Tabs type="card">
                    <TabPane tab="登录" key="1">
                        <p>Content of Tab Pane 1</p>
                        <p>Content of Tab Pane 1</p>
                        <p>Content of Tab Pane 1</p>
                    </TabPane>
                    <TabPane tab="注册" key="2">
                        <p>Content of Tab Pane 2</p>
                        <p>Content of Tab Pane 2</p>
                        <p>Content of Tab Pane 2</p>
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