import React from 'react';
import styles from "../assets/css/header.css"

const Header = (props) =>{
    return (
        <header className={styles.app_header}>
            <div>{props.text}</div>
        </header>
    )
}

export default Header;