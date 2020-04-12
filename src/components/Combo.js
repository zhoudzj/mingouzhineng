import React, {useState, useEffect, useReducer} from 'react';
import styles from "../assets/css/combo.css";
import {Link, useRouteMatch, useHistory} from 'react-router-dom';

const COMBO_DATA = [
  {
    url: require('../assets/img/A_combo.png'),
    id: 200,
    name: 'A档推荐套餐'
  }, {
    url: require('../assets/img/B_combo.png'),
    id: 300,
    name: 'B档推荐套餐'
  }, {
    url: require('../assets/img/C_combo.png'),
    id: 400,
    name: 'C档推荐套餐'
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