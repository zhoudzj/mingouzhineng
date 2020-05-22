import { applyMiddleware, createStore } from "redux";
// import createSagaMiddleware from 'redux-saga';
// import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from "./reducers";

export default createStore(rootReducer);