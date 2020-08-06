import React from 'react';
import styles from "@/assets/css/header.css"
import HeaderHOC from './HeaderHOC'
import {useHistory} from 'react-router-dom'

const Header = (props) => {
    console.log(props);
    const history = useHistory();

    return (
        <header className={styles.app_header}>
            <div
                className={styles.home}
                onClick={() => {
                history.push('/')
            }}>{props.home}</div>
            <div className={styles.app_title}>{props.text}</div>
            {props.children}
        </header>
    )
}

export default HeaderHOC(Header)