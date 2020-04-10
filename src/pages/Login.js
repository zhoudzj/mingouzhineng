import React from 'react';
import { Switch, Route, Link, useHistory } from 'react-router-dom'
import styles from "../assets/css/login.css"

const Login = () => {
    const history = useHistory();
    const haddleLogin = ()=>{
        history.push('/')
    }
    return (
        <div className={styles.g_login}>
            <header className={styles.g_header}>请登录</header>
            <div className={styles.content_wrap}>
                <div><span>用户名</span><input/></div>
                <div><span>密码</span><input/></div>
                <button onClick={haddleLogin}>登录</button>
            </div>
        </div>
    )
}

export default Login