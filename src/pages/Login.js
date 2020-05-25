import React, { useState } from 'react';
import { Switch, Route, Link, useHistory } from 'react-router-dom'
import styles from "../assets/scss/login.scss"
import { message } from 'antd';
import { connect } from 'react-redux';

const Login = ({ dispatch }) => {
    const history = useHistory();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const checked = () => {
        if (!userName) {
            message.info('请输入用户名！');
            return false
        }
        if (!password) {
            message.info('请输入密码！');
            return false
        }
        if (password.length<6||password.length>12) {
            message.info('清输入6-12位密码！');
            return false
        }
        return true
    };
    const haddleLogin = async () => {
        if(!checked()) return;
        try {
            const data = await window.axios.post('/user/login', {
                userName,
                password
            })
            console.log(data);
            dispatch({
                type: 'ADD_TOKEN',
                payload: { token: data.token }
            });
            const userInfo = await window.axios.post('/user/getUserInfo', {
                userName,
                password
            })
            dispatch({
                type: 'SET_USERINFO',
                payload: { userInfo }
            });
            history.push('/')
        } catch(err){
            console.log(err);
        }
    }
    const haddleRegister = async e => {
        if(!checked()) return;
        try {
            const result = await window.axios.post('/user/register', {
                userName,
                password
            })
        } catch(err) {
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
        <div className={styles.Login}>
            <header className={styles.Login_header}>一站式智能场景选装</header>
            <div className={styles.content_wrap}>
                <div className={styles.input_wrap}><span>用户名</span><input onChange={onUserChange} /></div>
                <div className={styles.input_wrap}><span>密码</span><input type="password" onChange={onPasswordChange} /></div>
                <button className={styles.button_login} onClick={haddleLogin}>登录</button>
                <button className={styles.button_register} onClick={haddleRegister}>注册</button>
                <div className={styles.intro}>powered by Mingou</div>
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