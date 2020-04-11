import React,{ useState, useEffect, useReducer }  from 'react';
import { Switch, Route, Link, useRouteMatch, useHistory } from 'react-router-dom'

const Order = () =>{
  const match = useRouteMatch();
  return (
    <div>智能选装</div>
  )
}

export default Order