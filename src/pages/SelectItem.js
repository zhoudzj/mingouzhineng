import React,{ useState, useEffect, useReducer }  from 'react';
import { useParams } from 'react-router-dom';
import { Switch, Route, Link, useRouteMatch, useHistory } from 'react-router-dom'
import Order from './Order'
import Shop from './Shop'
import styles from "../assets/css/selectItem.css"

const SelectItem = ({}) => {

    const match = useRouteMatch();

    let { houseId } = useParams();
    const [name,setName] = useState('');
    const [titile,setTitle] = useState('名欧智能中心')
    useEffect(()=>{
        if(houseId.split(':')[1]==='100'){
            setName('蓝色钱江')
        }else if(houseId.split(':')[1]==='101'){
            setName('留香园')
        }
    },[])
    return (
        <Switch>
            <Route path={`${match.path}/order`}>
                <Order/>
            </Route>
            <Route path={`${match.path}/shop`}>
                <Shop/>
            </Route>
            <Route path={`${match.path}`}>
            <div>
                <header className={styles.g_header}>{name}</header>
                <div className={styles.g_title}>{titile}</div>
                <div className={styles.g_items}>
                <Link to={`${match.url}/order`}>
                    <div className={styles.img_wrap}>
                        <img className={styles.g_image} src={require('../assets/img/my_shop.png')} />
                        <span className={styles.c_font}>智能选装</span>
                    </div>
                </Link>
                <Link to={`${match.url}/shop`}>
                    <div className={styles.img_wrap}>
                        <img className={styles.g_image} src={require('../assets/img/my_order.png')} />
                        <span className={styles.c_font}>我的选装</span>
                    </div>
                </Link>
                </div>
            </div>
            </Route>
        </Switch>
    )
}

export default SelectItem