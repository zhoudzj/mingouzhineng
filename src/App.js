import React, { useState, useEffect, useReducer } from 'react';
import styles from './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import { Switch, Route, Redirect,Link,useHistory } from 'react-router-dom'
import {connect} from 'react-redux';

function App() {
  const history = useHistory();
  useEffect(() => {
        const token = localStorage.getItem("token")
        if(!token){
          history.push('/login')
        }
    },[]);

  return (
       <Switch>
          <Route path={"/login"} exact>
           <Login />
         </Route>
          <Route path={"/house"}>
          <div className={styles.App}>
            <Home />
          </div>
          </Route>
          <Redirect from='/' to={'/house'}/>
       </Switch>
  );
}

export default App;
