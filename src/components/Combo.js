import React, {useState, useEffect, useReducer} from 'react';
import styles from "../assets/css/combo.css";
import {Link, useRouteMatch, useHistory} from 'react-router-dom';

const COMBO_DATA = [
  {
    img: require('../assets/img/style_house/A_luxury.png'),
    id: 200,
    name: '豪华套餐'
  }, {
    img: require('../assets/img/style_house/A_standard.png'),
    id: 300,
    name: '标准套餐'
  }
];

const Combo = ({getCombo,typeId}) => {
  const match = useRouteMatch();
  const [comboData,
    setComboData] = useState(COMBO_DATA);

    useEffect(()=>{
      const getData = async ()=>{
        const data = await getCombo({typeId});
        setComboData(data);
        console.log(comboData);
      }
      getData();
    },[typeId])
  return (
    <div className={styles.g_combos}>
      {comboData.map((item, index) => (
        <Link to={`${match.url}/:${String(item.id)}`} key={index}>
          <div  className={styles.combo_wrap}>
            <img className={styles.img_wrap} src={typeof(item.img)==="string"? "http://www.365tc.cn"+item.img:item.img}/>
            <span >{item.name}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Combo;