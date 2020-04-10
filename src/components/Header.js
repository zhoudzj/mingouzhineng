import React from 'react';
import styles from "../assets/css/header.css"

const Header = (props) =>{
    return (
        <header className={styles.app_header}>
            <h2>{props.text}</h2>
        </header>
    )
}

export default Header;