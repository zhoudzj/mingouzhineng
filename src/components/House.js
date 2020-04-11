import React from 'react';
import { Route, Link } from 'react-router-dom'
import styles from "../assets/css/house.css"

const House = ({ url, title, houseId }) => {
    return (
        <div className={styles.house_wrap}>
            <Link to={`/house/:${String(houseId)}`}>
                <img className={styles.img_wrap} src={url} />
                <span >{title}</span>
            </Link>
        </div>
    )
}

export default House;