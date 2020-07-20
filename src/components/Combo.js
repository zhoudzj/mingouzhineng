import React, { useState, useEffect, useRef } from 'react';
import styles from "@/assets/css/combo.css";
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import errorImg from '@/assets/img/inner.jpg'
const pictureDomian = process.env.REACT_APP_PICTURE_DOMAIN
const COMBO_DATA = [
];

const Combo = ({ getCombo, roomData }) => {
  const match = useRouteMatch();

  const [comboData,
    setComboData] = useState(COMBO_DATA);
  const [loadImgArr, setLoadImgArr] = useState([]);

  useEffect(() => {
    const loadImage = (src) => {
      return new Promise(function (resolve, reject) {
        let img = new Image();
        img.onload = function () {//加载时执行resolve函数
          resolve(img);
        }
        img.onerror = function () {
          img.src = errorImg;
          resolve(img);
        }
        img.src = src;
      })
    }

    const fn = async (resData) => {
      let arr = [];
      for (let i = 0; i < resData.length; i++) {
        const img = await loadImage(pictureDomian + resData[i].img);
        arr.push(img);
      }
      return arr;
    }
    const fetchData = async () => {
      const data = await getCombo({ roomData });
      const arr = await fn(data);
      setLoadImgArr(arr);
      setComboData(data);
    }

    if (roomData.length > 0) {
      fetchData().then(() => {
      }).catch((e) => {
        console.log(e);
      });
    }
  }, [roomData])

  return (
    <div className={styles.g_combos}>
      {comboData.map((item, index) => (
        <Link to={`${match.url}/${String(item.id)}`} key={index}>
          <div className={styles.combo_wrap}>
            <img className={styles.img_wrap} src={loadImgArr[index].src} />
            <span>{item.name}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Combo;