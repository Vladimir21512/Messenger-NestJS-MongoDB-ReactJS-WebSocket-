import React, {useContext, useState} from 'react';
import {login, registration} from "../http/userAPI";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";
import {AUTH_ROUTE, MAIN_ROUTE} from "../router/path";
import {toJS} from "mobx";

const Auth = () => {
    const {user}=useContext(Context)
    const history = useNavigate()
    const [email,setEmail]= useState('')
    const [password,setPassword]= useState('')

    const sendLogin=()=>{

        if(email=='' || email.trim()==''){
            alert('Email field is empty')
        }

        else{
            login({email:email, password:password}).then(e=> {
                user.setIsAuth(true)
                user.SetUser(e['user'][0])
                localStorage.setItem('token',e['accessToken'])
            }).then(a=>{
                history(MAIN_ROUTE)
            }).then(e=>{
                window.location.reload()
            })
        }
    }
    return (
        <div className='Auth'>
            <input onChange={(e)=>setEmail(e.target.value)} className='authForm' placeholder='email' type="text"/>
            <input onChange={(e)=>setPassword(e.target.value)} className='authForm' placeholder='password' type="text"/>
            <button onClick={()=>sendLogin()} className='authButton'>Login</button>
            <h1>Dont`t have account? <b style={{cursor:'pointer'}} onClick={()=>history(AUTH_ROUTE)}>Registration</b></h1>
        </div>
    );
};

export default Auth;