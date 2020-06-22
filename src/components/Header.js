import React from 'react';
import styles from "@/assets/css/header.css"
import HeaderHOC from './HeaderHOC'

const Header = (props) => {
    console.log(props);
    return (
        <header className={styles.app_header}>
            <div className={styles.app_title}>{props.text}</div>
            {props.children}
        </header>
    )
}

export default HeaderHOC(Header)