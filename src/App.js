import React, { useState, useEffect, useReducer } from 'react';
import styles from './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import { Switch, Route, Link,useHistory } from 'react-router-dom'

function App() {
  const [token,setToken] = useState('aa')
  const history = useHistory();
  useEffect(() => {
        if(!token){
          history.push('/login')
        }
    },[]);

  return (
      //  <Switch> 
      //    {/* <Route path={"/login"}>
      //      <Login />
      //    </Route> */}
          <Route path={"/"}>
          <div className={styles.App}>
            <Home />
          </div> 
          </Route>
      //  </Switch>
  );
}

export default App;
