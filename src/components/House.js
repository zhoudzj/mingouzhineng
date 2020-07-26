import React from 'react';
import {Route, Link} from 'react-router-dom'
import styles from "@/assets/css/house.css"

const House = ({url, title, houseId,houseClickHandle}) => {
    return (
        <Link to={`/house/:${String(houseId)}`} onClick={()=>houseClickHandle(title)}>
            <div className={styles.house_wrap}>
                <img className={styles.img_wrap} src={url}/>
                <span className={styles.g_house_name}>{title}</span>
            </div>
        </Link>
    )
}

export default House;