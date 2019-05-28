import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import dsAuthReducer from './store/reducers/dsAuth';
import listEnvReducer from './store/reducers/listEnv';
import loadingReducer from './store/reducers/loading';
import sendSignEnvReducer from './store/reducers/sendSignEnv';

const composeEnhancers = (process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null) || compose;
console.log(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__);
const rootReducer = combineReducers({
    dsAuth: dsAuthReducer,
    listEnv: listEnvReducer,
    loading: loadingReducer,
    sendSignEnv: sendSignEnvReducer
});

const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));

const alertOptions = {
    timeout: 5000,
    position: "top center"
  };
  
// Set the BrowserRouter's basename property if this app is not located at the server's root.
// See https://reacttraining.com/react-router/web/api/BrowserRouter/basename-string
const app = (
    <Provider store={store}>
        <BrowserRouter>
            <AlertProvider template={AlertTemplate} {...alertOptions}>
                <App />
            </AlertProvider>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render( app, document.getElementById( 'root' ) );
registerServiceWorker();
