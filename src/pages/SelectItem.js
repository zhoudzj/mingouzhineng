import React,{ useState, useEffect, useReducer }  from 'react';
import { useParams } from 'react-router-dom';

const SelectItem = ({}) => {
    let { houseId } = useParams();
    const [name,setName] = useState('');

    useEffect(()=>{
        if(houseId.split(':')[1]==='100'){
            setName('蓝色钱江')
        }else if(houseId.split(':')[1]==='101'){
            setName('留香园')
        }
    },[])
    return (
        <div>
            <h2>铭欧智能科技</h2>
            <div>{name}</div>
            <span>{houseId}</span>
        </div> 
    )
}

export default SelectItem