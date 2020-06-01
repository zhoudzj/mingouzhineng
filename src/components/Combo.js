import React, {useState, useEffect, useReducer} from 'react';
import styles from "../assets/css/combo.css";
import {Link, useRouteMatch, useHistory} from 'react-router-dom';

const COMBO_DATA = [
  {
    url: require('../assets/img/style_house/A_luxury.png'),
    id: 200,
    name: '豪华套餐'
  }, {
    url: require('../assets/img/style_house/A_standard.png'),
    id: 300,
    name: '标准套餐'
  }
];

const Combo = ({}) => {
  const match = useRouteMatch();
  const [comboData,
    setComboData] = useState(COMBO_DATA);
  return (
    <div className={styles.g_combos}>
      {comboData.map((item, index) => (
        <Link to={`${match.url}/:${String(item.id)}`} key={index}>
          <div  className={styles.combo_wrap}>
            <img className={styles.img_wrap} src={item.url}/>
            <span >{item.name}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Combo;