import React from 'react';
import styles from "../assets/css/house_header.css"
import { useHistory } from 'react-router-dom'
import HeaderHOC from './HeaderHOC'

const HouseHeader = ({title,children}) => {
    const history = useHistory();
    const goBack = ()=>{
        history.goBack()
    }
    return (
        <header className={styles.g_header}>
            <span className={`${styles.arrowLeft} ${styles.g_arrow}`} onClick={goBack}></span>
            <div className={styles.app_title}>{title}</div>
            {children}
        </header>
    )
}

export default HeaderHOC(HouseHeader);