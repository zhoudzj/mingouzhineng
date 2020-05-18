import React from 'react';
import { Switch, Route, Link, useHistory } from 'react-router-dom'
import styles from "../assets/scss/login.scss"

const Login = () => {
    const history = useHistory();
    const haddleLogin = () => {
        history.push('/')
    }
    return (
        <div className={styles.Login}>
            <header className={styles.Login_header}>一站式智能场景选装</header>
            <div className={styles.content_wrap}>
                <div className={styles.input_wrap}><span>用户名</span><input/></div>
                <div className={styles.input_wrap}><span>密码</span><input/></div>
                <button className={styles.button_login} onClick={haddleLogin}>登录</button>
                <div>powered by Mingou</div>
            </div>
        </div>
    )
}

export default Login