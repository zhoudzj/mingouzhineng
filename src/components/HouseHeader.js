import React from 'react';
import styles from "../assets/css/house_header.css"
import { useHistory } from 'react-router-dom'

const HouseHeader = ({title}) => {
    const history = useHistory();
    const goBack = ()=>{
        history.goBack()
    }
    return (
        <header className={styles.g_header}>{title}
            <span className={`${styles.arrowLeft} ${styles.g_arrow}`} onClick={goBack}></span>
        </header>
    )
}

export default HouseHeader;