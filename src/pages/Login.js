import React, {useState}from 'react';
import { Switch, Route, Link, useHistory } from 'react-router-dom'
import styles from "../assets/scss/login.scss"
import { message } from 'antd';

const Login = () => {
    const history = useHistory();
    const [userName,setUserName]= useState('');
    const [password,setPassword] = useState('');
    const haddleLogin = () => {
        
        if(!userName){
            message.info('请输入用户名！');
            return
        }
        if(!password){
            message.info('请输入密码！');
            return
        }

        history.push('/')
    }
    const onUserChange = e =>{
        setUserName(e.target.value)
        console.log(e.target.value);
    }
    const onPasswordChange = e =>{
        setPassword(e.target.value)
        console.log(e);
    }
    return (
        <div className={styles.Login}>
            <header className={styles.Login_header}>一站式智能场景选装</header>
            <div className={styles.content_wrap}>
                <div className={styles.input_wrap}><span>用户名</span><input onChange={onUserChange}/></div>
                <div className={styles.input_wrap}><span>密码</span><input type="password" onChange={onPasswordChange}/></div>
                <button className={styles.button_login} onClick={haddleLogin}>登录</button>
                <div className={styles.intro}>powered by Mingou</div>
            </div>
        </div>
    )
}

export default Login