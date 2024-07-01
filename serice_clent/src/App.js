
import './App.css';

import {useContext, useEffect, useState} from "react";
import {Context} from "./index";
import {UseConnectSocket} from './socket/useConnectSocket'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {authRoutes, publicRoutes} from "./router/routes";
import Redirect from "./components/Redirect";
import {observable, toJS} from "mobx";
import {check, GetChatList, GetContacts, refresh} from "./http/userAPI";
import {observer} from "mobx-react";

import {useNavigate} from "react-router-dom";
import {LOGIN_ROUTE} from "./router/path";
import AppRouter from "./components/AppRouter";
function App() {
    const {user} = useContext(Context)
    const {message} = useContext(Context)
    const [vari,setVari]=useState(false)
    useEffect(()=>{
        check({accessToken:localStorage.getItem('token')}).then(e=>{
            if(e) {
                if (e.hasOwnProperty('message') || e=='invalid token') {
                    user.setIsAuth(false)
                    localStorage.removeItem('token')
                    setVari(true)
                } else {
                    user.SetUser(e.data.user)
                    user.setIsAuth(true)
                    setVari(true)
                }
            }
            else{
                user.setIsAuth(false)
                localStorage.removeItem('token')
                setVari(true)
            }
        }).then(ai=>{
            if(toJS(user.isAuth)) {
                GetContacts(String(localStorage.getItem('token'))).then(e => {
                    user.setContacts(e)
                })
            }
        }).then(e=>{
            GetChatList({'userId':toJS(user.User)['_id']}).then(e=> {
                if(e.length!=0 && e[0]!=null){
                    user.SetChatList(e)
                    let ARR=[]
                    for (let i = 0; i < e.length; i++) {
                        ARR.push(e[i]['name'])
                    }
                    user.SetChatListNames(ARR)
                }
            })
            // }).then(()=>{
            //     let arr=[]
            //     for (let i = 0; i < toJS(user.User)['chats'].length; i++) {
            //         arr.push(toJS(user.User)['chats'][i]['chatId'])
            //     }
            //     //for i
            // })
        })
    },[])

  return (
     <>
         {vari &&
            <AppRouter/>
         }
     </>
  );
}

export default observer(App);