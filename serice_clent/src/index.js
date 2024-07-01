import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import MessageStore from "./store/MessageStore";
import UserStore from "./store/UserStore";
import {BrowserRouter} from "react-router-dom";
import WebSocketComponent from './components/WebSocketComponent'

const root = ReactDOM.createRoot(document.getElementById('root'));
export const Context = createContext(null)

root.render(

    <Context.Provider value={{
        message: new MessageStore(),
        user: new UserStore()
    }}>
        <BrowserRouter>
            <App />
            <WebSocketComponent/>
        </BrowserRouter>
    </Context.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
